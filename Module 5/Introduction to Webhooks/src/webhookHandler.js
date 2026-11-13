'use strict';

const crypto = require('node:crypto');
const { handleEvent } = require('./eventHandlers');

const _processedIds = new Set();
const SIGNATURE_PATTERN = /^sha256=([a-fA-F0-9]{64})$/;

function invalidSignature(res) {
  return res.status(401).json({ error: 'Invalid signature' });
}

async function handleWebhook(req, res) {
  const body = req.body;
  const signature = req.headers['x-webhook-signature'];
  const match = typeof signature === 'string' ? SIGNATURE_PATTERN.exec(signature) : null;
  const secret = process.env.WEBHOOK_SECRET;

  if (!Buffer.isBuffer(body) || !match || typeof secret !== 'string' || secret.length === 0) {
    return invalidSignature(res);
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest();
  const received = Buffer.from(match[1], 'hex');

  if (received.length !== expected.length || !crypto.timingSafeEqual(expected, received)) {
    return invalidSignature(res);
  }

  let event;
  try {
    event = JSON.parse(body.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  if (!event || typeof event.id !== 'string' || event.id.length === 0) {
    return res.status(400).json({ error: 'Event id is required' });
  }

  if (_processedIds.has(event.id)) {
    return res.status(200).json({ status: 'already_processed' });
  }

  _processedIds.add(event.id);
  res.status(200).json({ status: 'received' });

  setImmediate(() => {
    Promise.resolve(handleEvent(event)).catch((err) => {
      console.error(`Failed to process webhook event ${event.id}:`, err);
    });
  });
}

module.exports = { handleWebhook, _processedIds };
