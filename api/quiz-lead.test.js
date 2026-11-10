import test from 'node:test';
import assert from 'node:assert/strict';
import handler from './quiz-lead.js';

function mockRes() {
  return {
    statusCode: 0,
    payload: null,
    setHeader() {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    }
  };
}

async function capture(run) {
  const lines = [];
  const original = console.error;
  console.error = (line) => lines.push(String(line));
  try {
    await run();
  } finally {
    console.error = original;
  }
  return lines;
}

test('a failed lead save logs status and reason without contact fields', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({ ok: false, status: 429 });
  const res = mockRes();
  let lines = [];
  try {
    lines = await capture(() =>
      handler({
        method: 'POST',
        body: {
          email: 'secret@example.com',
          phone: '+14155550100',
          firstName: 'Ada'
        }
      }, res)
    );
  } finally {
    global.fetch = originalFetch;
  }
  assert.equal(res.statusCode, 502);
  assert.equal(lines.length, 1);
  assert.equal(lines[0], 'quiz-lead failed status=502 reason=upstream-429');
  assert.equal(lines[0].includes('secret@example.com'), false);
  assert.equal(lines[0].includes('415'), false);
  assert.equal(lines[0].includes('Ada'), false);
});

test('an invalid lead logs a reason and not the submitted fields', async () => {
  const res = mockRes();
  const lines = await capture(() =>
    handler({
      method: 'POST',
      body: { email: 'not-an-email', phone: '5551234567', firstName: 'Ada' }
    }, res)
  );
  assert.equal(res.statusCode, 400);
  assert.equal(lines.length, 1);
  assert.equal(lines[0], 'quiz-lead failed status=400 reason=invalid-email');
  assert.equal(lines[0].includes('not-an-email'), false);
  assert.equal(lines[0].includes('555'), false);
});

test('a network failure log does not include the thrown message', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => {
    throw new Error('secret@example.com timed out');
  };
  const res = mockRes();
  let lines = [];
  try {
    lines = await capture(() =>
      handler({ method: 'POST', body: { email: 'secret@example.com' } }, res)
    );
  } finally {
    global.fetch = originalFetch;
  }
  assert.equal(res.statusCode, 502);
  assert.equal(lines[0], 'quiz-lead failed status=502 reason=network');
  assert.equal(lines[0].includes('secret@example.com'), false);
});
