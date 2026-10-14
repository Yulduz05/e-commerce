/**
 * Security input sanitizer for user-provided search strings and form fields.
 * Prevents HTML tag injection, dangerous javascript: schemas, and control characters.
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // strip literal angle brackets
    .replace(/javascript:/gi, '') // strip dangerous URI schemes
    .replace(/on\w+=/gi, '') // strip event handler attributes like onerror=, onclick=
    .trim();
}

export function sanitizeHtmlEntities(str: string): string {
  if (!str || typeof str !== 'string') return '';
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}
