import type { Product, RawBlock } from '../types/sdui';

let pid = 0;
const nextId = () => `p${++pid}`;

export function product(
  name: string,
  price: number,
  emoji: string,
  swatch: string,
  badge?: string,
): Product {
  const id = nextId();
  return {
    id,
    name,
    price,
    emoji,
    swatch,
    badge,
    action: { type: 'OPEN_PRODUCT', payload: { id } },
    addAction: { type: 'ADD_TO_CART', payload: { id, name, price } },
  };
}

export function makeProducts(
  defs: Array<[string, number, string, string, string?]>,
): Product[] {
  return defs.map(([n, p, e, s, b]) => product(n, p, e, s, b));
}

export const heroBlock = (
  id: string,
  data: { title: string; subtitle: string; emoji: string; bgColor?: string; url: string },
): RawBlock => ({
  id,
  type: 'BANNER_HERO',
  data: {
    title: data.title,
    subtitle: data.subtitle,
    emoji: data.emoji,
    bgColor: data.bgColor,
    action: { type: 'DEEP_LINK', payload: { url: data.url } },
  },
});

export const gridBlock = (id: string, title: string, products: Product[]): RawBlock => ({
  id,
  type: 'PRODUCT_GRID_2X2',
  data: { title, products },
});

export const collectionBlock = (
  id: string,
  title: string,
  contextTheme: string,
  products: Product[],
): RawBlock => ({
  id,
  type: 'DYNAMIC_COLLECTION',
  data: { title, contextTheme, products },
});
