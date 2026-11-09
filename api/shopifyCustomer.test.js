import test from 'node:test';
import assert from 'node:assert/strict';
import { buildShopifyCustomerInput, saveShopifyCustomer } from './shopifyCustomer.js';
import { saveQuizLead } from './saveLead.js';

const ANSWERS = { arch: 'upper', teeth: '1', extraction: 'no', pain: 'no', loose: 'no' };

function consentLead(overrides = {}) {
  return {
    email: 'results@example.com',
    firstName: 'Ada',
    phone: '+14155550100',
    emailMarketingConsent: false,
    smsConsent: false,
    ...ANSWERS,
    ...overrides
  };
}

test('shopify customer input keeps only quiz-lead and checkbox consent', () => {
  const declined = buildShopifyCustomerInput(consentLead({ phone: '', firstName: '', smsConsent: true }));
  assert.deepEqual(declined.tags, ['quiz-lead']);
  assert.equal(declined.emailMarketingConsent.marketingState, 'NOT_SUBSCRIBED');
  assert.equal(declined.emailMarketingConsent.marketingOptInLevel, undefined);
  assert.equal(declined.phone, undefined);
  assert.equal(declined.smsMarketingConsent, undefined);
  assert.equal(declined.firstName, undefined);
  for (const key of ['arch', 'teeth', 'extraction', 'pain', 'loose', 'note']) {
    assert.equal(Object.hasOwn(declined, key), false);
  }

  const textOnly = buildShopifyCustomerInput(
    consentLead({ emailMarketingConsent: false, smsConsent: true })
  );
  assert.equal(textOnly.emailMarketingConsent.marketingState, 'NOT_SUBSCRIBED');
  assert.equal(textOnly.smsMarketingConsent.marketingState, 'SUBSCRIBED');
  assert.equal(textOnly.smsMarketingConsent.marketingOptInLevel, 'SINGLE_OPT_IN');
  assert.equal(textOnly.phone, '+14155550100');
  assert.equal(textOnly.firstName, 'Ada');

  const emailOnly = buildShopifyCustomerInput(
    consentLead({ emailMarketingConsent: true, smsConsent: false, phone: '' })
  );
  assert.equal(emailOnly.emailMarketingConsent.marketingState, 'SUBSCRIBED');
  assert.equal(emailOnly.emailMarketingConsent.marketingOptInLevel, 'SINGLE_OPT_IN');
  assert.equal(emailOnly.smsMarketingConsent, undefined);

  const kept = buildShopifyCustomerInput(consentLead({ phone: '' }), ['wholesale']);
  assert.deepEqual(kept.tags, ['quiz-lead', 'wholesale']);
});

test('shopify create and update use mocked fetch and ignore service failures', async () => {
  const originalFetch = global.fetch;
  const originalDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const originalToken = process.env.SHOPIFY_ADMIN_TOKEN;
  const calls = [];

  process.env.SHOPIFY_STORE_DOMAIN = 'tfvziu-ia.myshopify.com';
  process.env.SHOPIFY_ADMIN_TOKEN = 'test-token-not-real';

  global.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    calls.push({ url: String(url), body, token: options.headers['x-shopify-access-token'] });
    if (String(url).includes('klaviyo.com')) {
      return { ok: true, json: async () => ({}) };
    }
    if (body.query.includes('FindQuizLead')) {
      return { ok: true, json: async () => ({ data: { customers: { edges: [] } } }) };
    }
    if (body.query.includes('CreateQuizLead')) {
      return {
        ok: true,
        json: async () => ({ data: { customerCreate: { customer: { id: 'gid://shopify/Customer/1' }, userErrors: [] } } })
      };
    }
    return { ok: false, json: async () => ({}) };
  };

  try {
    const saved = await saveQuizLead({
      email: 'results@example.com',
      firstName: 'Ada',
      phone: '',
      emailMarketingConsent: true,
      smsConsent: true
    });
    assert.equal(saved.emailMarketingConsent, true);
    assert.equal(saved.smsConsent, false);

    const create = calls.find((call) => call.body.query?.includes('CreateQuizLead'));
    assert.ok(create, 'customerCreate was not called');
    assert.equal(create.token, 'test-token-not-real');
    assert.equal(create.url, 'https://tfvziu-ia.myshopify.com/admin/api/2026-10/graphql.json');
    const input = create.body.variables.input;
    assert.deepEqual(input.tags, ['quiz-lead']);
    assert.equal(input.email, 'results@example.com');
    assert.equal(input.firstName, 'Ada');
    assert.equal(input.phone, undefined);
    assert.equal(input.smsMarketingConsent, undefined);
    assert.equal(input.emailMarketingConsent.marketingState, 'SUBSCRIBED');
    assert.equal(input.emailMarketingConsent.marketingOptInLevel, 'SINGLE_OPT_IN');
    const serialized = JSON.stringify(input);
    assert.equal(/\b(arch|teeth|extraction|pain|loose)\b/.test(serialized), false);
    assert.ok(calls.some((call) => String(call.url).includes('klaviyo.com')));

    calls.length = 0;
    global.fetch = async (url, options) => {
      const body = JSON.parse(options.body);
      calls.push({ url: String(url), body });
      if (String(url).includes('klaviyo.com')) return { ok: true, json: async () => ({}) };
      if (body.query.includes('FindQuizLead')) {
        return {
          ok: true,
          json: async () => ({
            data: { customers: { edges: [{ node: { id: 'gid://shopify/Customer/9', tags: ['returning'] } }] } }
          })
        };
      }
      if (body.query.includes('UpdateQuizLead')) {
        return {
          ok: true,
          json: async () => ({ data: { customerUpdate: { customer: { id: 'gid://shopify/Customer/9' }, userErrors: [] } } })
        };
      }
      throw new Error('unexpected shopify call');
    };

    await saveShopifyCustomer(consentLead({ emailMarketingConsent: false, smsConsent: false }));
    const update = calls.find((call) => call.body.query?.includes('UpdateQuizLead'));
    assert.equal(update.body.variables.input.id, 'gid://shopify/Customer/9');
    assert.deepEqual(update.body.variables.input.tags, ['quiz-lead', 'returning']);
    assert.equal(update.body.variables.input.emailMarketingConsent.marketingState, 'NOT_SUBSCRIBED');
    assert.equal(update.body.variables.input.smsMarketingConsent.marketingState, 'NOT_SUBSCRIBED');
    assert.equal(update.body.variables.input.smsMarketingConsent.marketingOptInLevel, undefined);

    global.fetch = async () => {
      throw new Error('network down');
    };
    const stillSaved = await saveQuizLead({
      email: 'results@example.com',
      phone: '',
      emailMarketingConsent: false,
      smsConsent: false
    });
    assert.equal(stillSaved.email, 'results@example.com');

    delete process.env.SHOPIFY_ADMIN_TOKEN;
    global.fetch = async () => {
      throw new Error('should not be required for a missing token');
    };
    const skipped = await saveQuizLead({
      email: 'results@example.com',
      phone: '4155550100',
      emailMarketingConsent: false,
      smsConsent: true
    });
    assert.equal(skipped.smsConsent, true);
    assert.equal(skipped.phone, '+14155550100');
  } finally {
    global.fetch = originalFetch;
    if (originalDomain === undefined) delete process.env.SHOPIFY_STORE_DOMAIN;
    else process.env.SHOPIFY_STORE_DOMAIN = originalDomain;
    if (originalToken === undefined) delete process.env.SHOPIFY_ADMIN_TOKEN;
    else process.env.SHOPIFY_ADMIN_TOKEN = originalToken;
  }
});
