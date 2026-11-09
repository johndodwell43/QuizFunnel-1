// Shopify Admin customer save for quiz leads.
// Requires SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_TOKEN. Neither value is stored in the repo.

const SHOPIFY_API_VERSION = '2026-10';

const FIND_CUSTOMER = `
  query FindQuizLead($query: String!) {
    customers(first: 1, query: $query) {
      edges { node { id tags } }
    }
  }
`;

const CREATE_CUSTOMER = `
  mutation CreateQuizLead($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer { id }
      userErrors { field message }
    }
  }
`;

const UPDATE_CUSTOMER = `
  mutation UpdateQuizLead($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer { id }
      userErrors { field message }
    }
  }
`;

function marketingConsent(subscribed) {
  const consent = {
    marketingState: subscribed ? 'SUBSCRIBED' : 'NOT_SUBSCRIBED',
    consentUpdatedAt: new Date().toISOString()
  };
  if (subscribed) consent.marketingOptInLevel = 'SINGLE_OPT_IN';
  return consent;
}

export function buildShopifyCustomerInput(lead, existingTags = []) {
  const kept = (existingTags || []).filter((tag) => tag && tag !== 'quiz-lead');
  const input = {
    email: lead.email,
    tags: ['quiz-lead', ...kept],
    emailMarketingConsent: marketingConsent(lead.emailMarketingConsent === true)
  };
  if (lead.firstName) input.firstName = lead.firstName;
  if (lead.phone) {
    input.phone = lead.phone;
    input.smsMarketingConsent = marketingConsent(lead.smsConsent === true);
  }
  return input;
}

function shopifyConfig() {
  const domain = String(process.env.SHOPIFY_STORE_DOMAIN || '')
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
  const token = String(process.env.SHOPIFY_ADMIN_TOKEN || '').trim();
  if (!domain || !token) {
    const error = new Error('shopify-not-configured');
    throw error;
  }
  return { domain, token };
}

async function shopifyGraphql(query, variables) {
  const { domain, token } = shopifyConfig();
  const response = await fetch(`https://${domain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-shopify-access-token': token
    },
    body: JSON.stringify({ query, variables })
  });
  if (!response.ok) throw new Error('shopify-http');
  const payload = await response.json();
  if (payload.errors) throw new Error('shopify-graphql');
  return payload.data;
}

function emailQuery(email) {
  const safe = String(email || '').replace(/["\\]/g, '');
  return `email:"${safe}"`;
}

async function findCustomer(email) {
  const data = await shopifyGraphql(FIND_CUSTOMER, { query: emailQuery(email) });
  const node = data?.customers?.edges?.[0]?.node;
  if (!node?.id) return null;
  return node;
}

function userErrorsOf(result) {
  return result?.userErrors || [];
}

export async function saveShopifyCustomer(lead) {
  const existing = await findCustomer(lead.email);
  const input = buildShopifyCustomerInput(lead, existing?.tags || []);
  if (existing?.id) {
    const updated = await shopifyGraphql(UPDATE_CUSTOMER, { input: { ...input, id: existing.id } });
    if (userErrorsOf(updated?.customerUpdate).length) throw new Error('shopify-user-error');
    return;
  }

  const created = await shopifyGraphql(CREATE_CUSTOMER, { input });
  const createErrors = userErrorsOf(created?.customerCreate);
  if (!createErrors.length) return;

  const again = await findCustomer(lead.email);
  if (!again?.id) throw new Error('shopify-user-error');
  const updated = await shopifyGraphql(UPDATE_CUSTOMER, {
    input: { ...buildShopifyCustomerInput(lead, again.tags || []), id: again.id }
  });
  if (userErrorsOf(updated?.customerUpdate).length) throw new Error('shopify-user-error');
}
