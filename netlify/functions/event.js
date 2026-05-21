/**
 * Event ingestion endpoint -- placeholder.
 *
 * Accepts POSTs from src/lib/trackServerEvent.js (page_view, quiz_start,
 * quiz_complete, med_search, etc.) and returns 204 No Content so the
 * client-side fire-and-forget doesn't produce 404 noise in the browser
 * console.
 *
 * No persistence yet. When an `events` table is set up in Neon, swap the
 * body of `handler` for an INSERT and keep the same response shape.
 *
 * The client-side tracker swallows all errors, so this endpoint also
 * never throws -- it returns 204 even on malformed bodies. That matches
 * the existing "analytics must never break the app" contract.
 */

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
};

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: '' };
  }
  return { statusCode: 204, headers, body: '' };
}
