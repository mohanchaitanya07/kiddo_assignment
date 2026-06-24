import type { Action, Product } from '../types/sdui';

export const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export const isString = (v: unknown): v is string => typeof v === 'string';
export const isNumber = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v);

export function parseAction(raw: unknown): Action | null {
  if (!isObject(raw) || !isString(raw.type)) return null;
  const payload = isObject(raw.payload) ? raw.payload : {};

  switch (raw.type) {
    case 'ADD_TO_CART':
      if (isString(payload.id) && isString(payload.name) && isNumber(payload.price)) {
        return { type: 'ADD_TO_CART', payload: { id: payload.id, name: payload.name, price: payload.price } };
      }
      return null;
    case 'DEEP_LINK':
      if (isString(payload.url)) return { type: 'DEEP_LINK', payload: { url: payload.url } };
      return null;
    case 'OPEN_PRODUCT':
      if (isString(payload.id)) return { type: 'OPEN_PRODUCT', payload: { id: payload.id } };
      return null;
    case 'BOOK_EVENT':
      if (isString(payload.eventId) && isString(payload.title)) {
        return { type: 'BOOK_EVENT', payload: { eventId: payload.eventId, title: payload.title } };
      }
      return null;
    case 'APPLY_MYSTERY_GIFT_COUPON':
      if (isString(payload.code)) return { type: 'APPLY_MYSTERY_GIFT_COUPON', payload: { code: payload.code } };
      return null;
    default:
      return null;
  }
}

export function parseProduct(raw: unknown): Product | null {
  if (!isObject(raw)) return null;
  if (!isString(raw.id) || !isString(raw.name) || !isNumber(raw.price)) return null;
  const action = parseAction(raw.action);
  const addAction = parseAction(raw.addAction);
  if (!action || !addAction || addAction.type !== 'ADD_TO_CART') return null;
  return {
    id: raw.id,
    name: raw.name,
    price: raw.price,
    swatch: isString(raw.swatch) ? raw.swatch : '#E0E0E0',
    emoji: isString(raw.emoji) ? raw.emoji : '🛍️',
    badge: isString(raw.badge) ? raw.badge : undefined,
    action,
    addAction,
  };
}

export function parseProducts(raw: unknown): Product[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseProduct).filter((p): p is Product => p !== null);
}
