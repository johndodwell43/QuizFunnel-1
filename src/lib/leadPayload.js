import { isValidEmail, normalizeFirstName } from './email.js';

export const QUIZ_LEAD_METRIC = 'Quiz Results Requested';

function invalidLead() {
  const error = new Error('invalid-lead');
  error.statusCode = 400;
  return error;
}

// Marketing fields are email and an optional first name. Quiz answers,
// notes, and attribution tags are dropped on purpose.
export function buildLeadPayload(input) {
  const source = input && typeof input === 'object' ? input : {};
  const email = String(source.email || '').trim();
  const firstName = normalizeFirstName(source.firstName);
  if (!isValidEmail(email) || firstName === null) throw invalidLead();
  return firstName ? { email, firstName } : { email };
}

export function klaviyoProfileAttributes(payload) {
  const attributes = { email: payload.email };
  if (payload.firstName) attributes.first_name = payload.firstName;
  return attributes;
}

export function buildKlaviyoRequests(payload) {
  const attributes = klaviyoProfileAttributes(payload);
  return {
    profileBody: {
      data: { type: 'profile', attributes }
    },
    eventBody: {
      data: {
        type: 'event',
        attributes: {
          properties: {},
          metric: {
            data: { type: 'metric', attributes: { name: QUIZ_LEAD_METRIC } }
          },
          profile: {
            data: { type: 'profile', attributes: { ...attributes } }
          }
        }
      }
    }
  };
}
