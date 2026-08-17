import DOMPurify from 'isomorphic-dompurify';

export function sanitizeText(input: string, maxLength = 5000): string {
  if (!input) return '';
  const sanitized = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  return sanitized.slice(0, maxLength);
}

export function sanitizeRichText(input: string, maxLength = 10000): string {
  if (!input) return '';
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href']
  });
  return sanitized.slice(0, maxLength);
}

export function sanitizeEmail(input: string): string {
  if (!input) return '';
  return input.toLowerCase().trim();
}

export function sanitizeSlug(input: string): string {
  if (!input) return '';
  return input.toLowerCase().replace(/[^a-z0-9-]/g, '').trim();
}
