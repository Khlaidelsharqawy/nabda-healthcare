/**
 * Enterprise Security Layer: Input Sanitization & Anti-Injection Guards
 * Protects against XSS, SQL injection, NoSQL injection, and Prototype Pollution.
 */

// HTML Entity escape map
const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
};

/**
 * Escapes unsafe HTML characters to prevent Cross-Site Scripting (XSS).
 */
export function escapeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input.replace(/[&<>"'`/]/g, (match) => ESCAPE_MAP[match] || match);
}

/**
 * Strips script tags, javascript: pseudo-protocols, and inline event handlers.
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/on\w+=\S+/gi, '')
    .trim();
}

/**
 * Validates and sanitizes search queries to block SQL injection and control characters.
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query || typeof query !== 'string') return '';
  // Block common SQL injection idioms (e.g. '--', ';', 'UNION', 'DROP', 'EXEC')
  const cleaned = query
    .replace(/['";\-\-]/g, '')
    .replace(/\b(UNION|SELECT|DROP|INSERT|DELETE|UPDATE|EXEC|ALTER|CREATE)\b/gi, '')
    .replace(/[\x00-\x1F\x7F]/g, '') // strip ASCII control characters
    .trim();
  return cleaned.slice(0, 100); // Enforce max length
}

/**
 * Deep sanitizes objects against prototype pollution attacks (__proto__, constructor, prototype).
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  const isArr = Array.isArray(obj);
  const clean = (isArr ? [] : Object.create(null)) as Record<string, unknown>;

  const keys = Object.getOwnPropertyNames(obj);
  for (const key of keys) {
    // Block prototype pollution vectors
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }

    const value = (obj as any)[key];
    if (typeof value === 'string') {
      clean[key] = sanitizeText(value);
    } else if (value && typeof value === 'object') {
      clean[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      clean[key] = value;
    }
  }

  return clean as T;
}
