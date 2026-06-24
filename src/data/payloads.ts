import type { CampaignId, HomePayload, RawBlock, Theme } from '../types/sdui';
import { collectionBlock, gridBlock, heroBlock, makeProducts } from './products';


const snacks = makeProducts([
  ['Fruit Puffs', 89, '🍪', '#FFE0B2', '20% off'],
  ['Veggie Sticks', 75, '🥕', '#FFCCBC'],
  ['Mini Cookies', 99, '🍪', '#D7CCC8'],
  ['Juice Box x4', 120, '🧃', '#C8E6C9'],
  ['Yogurt Melts', 145, '🍦', '#F8BBD0'],
  ['Rice Crackers', 60, '🍘', '#FFF9C4'],
]);

const diapers = makeProducts([
  ['Diapers M-72', 699, '🧷', '#BBDEFB', 'Bestseller'],
  ['Wipes x3', 249, '🧻', '#B2EBF2'],
  ['Diaper Rash Cream', 199, '🧴', '#C5CAE9'],
  ['Changing Mat', 449, '🛏️', '#D1C4E9'],
]);

const toys = makeProducts([
  ['Stacking Rings', 299, '🧩', '#FFCDD2', 'New'],
  ['Soft Blocks', 399, '🧱', '#F0F4C3'],
  ['Plush Bunny', 349, '🧸', '#FFE0B2'],
  ['Shape Sorter', 449, '🔷', '#B3E5FC'],
  ['Bath Ducks', 199, '🦆', '#FFF59D'],
  ['Musical Drum', 549, '🥁', '#FFAB91'],
]);

const feeding = makeProducts([
  ['Sippy Cup', 199, '🥤', '#C8E6C9'],
  ['Baby Spoons x4', 149, '🥄', '#FFE0B2'],
  ['Bib Set', 249, '👶', '#F8BBD0'],
  ['Bowl + Lid', 179, '🥣', '#B2DFDB'],
]);

const bath = makeProducts([
  ['Baby Shampoo', 220, '🧴', '#B3E5FC', 'Gentle'],
  ['Hooded Towel', 399, '🧖', '#D1C4E9'],
  ['Bath Toys Set', 299, '🛁', '#FFCCBC'],
  ['Soft Sponge', 99, '🧽', '#C5E1A5'],
  ['Body Lotion', 240, '🧴', '#F8BBD0'],
]);

const BASE_LAYOUT: RawBlock[] = [
  heroBlock('hero-1', {
    title: 'Everything for your little one',
    subtitle: 'Delivered in minutes',
    emoji: '🍼',
    url: '/home',
  }),
  gridBlock('grid-snacks', 'Snack time', snacks),
  collectionBlock('col-snacks', 'Snacks under ₹99', '₹99 Store', snacks),
  gridBlock('grid-diapers', 'Diapering essentials', diapers),
  collectionBlock('col-toys', 'Playtime picks', 'Top Toys', toys),
  heroBlock('hero-2', {
    title: 'Free delivery over ₹499',
    subtitle: 'Stock up & save',
    emoji: '🚚',
    bgColor: '#5C6BC0',
    url: '/offers',
  }),
  gridBlock('grid-feeding', 'Feeding & weaning', feeding),

  // Unknown type: dropped by the registry.
  { id: 'future-1', type: 'NEW_COMPONENT_V2', data: { foo: 'bar' } },

  collectionBlock('col-bath', 'Bath & skincare', 'Daily Care', bath),

  // Known type but corrupt (no products): dropped by the validator.
  { id: 'broken-1', type: 'PRODUCT_GRID_2X2', data: { title: 'Oops', products: [] } },

  gridBlock('grid-toys', 'More to explore', toys),
  collectionBlock('col-feeding', 'Mealtime must-haves', 'New In', feeding),
];

const DEFAULT_THEME: Theme = {
  primary: '#FF9933',
  background: '#FFF5E6',
  card: '#FFFFFF',
  accent: '#FF6F00',
  text: '#1A1A1A',
  textMuted: '#6B6B6B',
};

const BACK_TO_SCHOOL_THEME: Theme = {
  primary: '#1565C0',
  background: '#FFFDE7',
  card: '#FFFFFF',
  accent: '#FFC107',
  text: '#0D2B45',
  textMuted: '#5A6B7B',
};

const SUMMER_THEME: Theme = {
  primary: '#0288D1',
  background: '#E1F5FE',
  card: '#FFFFFF',
  accent: '#00ACC1',
  text: '#073B4C',
  textMuted: '#4F7A8A',
};

const CARNIVAL_THEME: Theme = {
  primary: '#E53935',
  background: '#FFF3E0',
  card: '#FFFFFF',
  accent: '#FB8C00',
  text: '#3E1212',
  textMuted: '#7A5A5A',
};

const lunchboxes = makeProducts([
  ['Steel Lunchbox', 549, '🍱', '#FFF59D', 'Sale'],
  ['Insulated Bag', 699, '🎒', '#90CAF9'],
  ['Water Bottle', 349, '🍶', '#FFE082'],
  ['Pencil Pouch', 199, '✏️', '#64B5F6'],
  ['Snack Box', 299, '🥪', '#FFF176'],
]);

const pettingZoo = makeProducts([
  ['Petting Zoo Ticket', 250, '🦙', '#B2EBF2', 'Event'],
  ['Family Pass x4', 800, '🎟️', '#80DEEA'],
  ['Pony Ride Add-on', 150, '🐴', '#4DD0E1'],
]).map((p) => ({
  ...p,
  action: { type: 'BOOK_EVENT' as const, payload: { eventId: p.id, title: p.name } },
}));

const mysteryGifts = makeProducts([
  ['Mystery Box S', 199, '🎁', '#FFCDD2', '???'],
  ['Mystery Box M', 399, '🎁', '#F8BBD0', '???'],
  ['Mystery Box L', 699, '🎁', '#E1BEE7', '???'],
  ['Golden Ticket', 99, '🎫', '#FFE082'],
]).map((p) => ({
  ...p,
  action: { type: 'APPLY_MYSTERY_GIFT_COUPON' as const, payload: { code: `GIFT-${p.id.toUpperCase()}` } },
}));

function withCampaignBlocks(hero: RawBlock, signatureRow: RawBlock): RawBlock[] {
  return [hero, signatureRow, ...BASE_LAYOUT];
}

export const PAYLOADS: Record<CampaignId, HomePayload> = {
  default: {
    campaignId: 'default',
    theme: DEFAULT_THEME,
    overlay: null,
    layout: BASE_LAYOUT,
  },

  'back-to-school': {
    campaignId: 'back-to-school',
    theme: BACK_TO_SCHOOL_THEME,
    overlay: {
      type: 'FULL_SCREEN_OVERLAY',
      animation: 'back-to-school',
      animation_url: 'https://assets.example.com/back_to_school_pencils.json',
    },
    layout: withCampaignBlocks(
      heroBlock('bts-hero', {
        title: 'Back to School Mega-Sale',
        subtitle: 'Lunchboxes, bags & more',
        emoji: '🎒',
        bgColor: '#1565C0',
        url: '/campaign/back-to-school',
      }),
      collectionBlock('bts-row', 'Lunchboxes & Bags', 'Mega-Sale', lunchboxes),
    ),
  },

  'summer-playhouse': {
    campaignId: 'summer-playhouse',
    theme: SUMMER_THEME,
    overlay: {
      type: 'FULL_SCREEN_OVERLAY',
      animation: 'summer-playhouse',
      animation_url: 'https://assets.example.com/summer_water_splash.json',
    },
    layout: withCampaignBlocks(
      heroBlock('summer-hero', {
        title: 'Summer Playhouse Festival',
        subtitle: 'Splash into savings',
        emoji: '🏖️',
        bgColor: '#0288D1',
        url: '/campaign/summer',
      }),
      collectionBlock('summer-row', 'Petting Zoo Tickets', 'Book Now', pettingZoo),
    ),
  },

  'mystery-carnival': {
    campaignId: 'mystery-carnival',
    theme: CARNIVAL_THEME,
    overlay: {
      type: 'FULL_SCREEN_OVERLAY',
      animation: 'mystery-carnival',
      animation_url: 'https://assets.example.com/confetti_carnival.json',
    },
    layout: withCampaignBlocks(
      heroBlock('carnival-hero', {
        title: 'Mystery Gift Carnival',
        subtitle: 'Tap a box, win a gift!',
        emoji: '🎪',
        bgColor: '#E53935',
        url: '/campaign/carnival',
      }),
      collectionBlock('carnival-row', 'Mystery Gifts', 'Surprise!', mysteryGifts),
    ),
  },
};

export const CAMPAIGN_ORDER: CampaignId[] = [
  'default',
  'back-to-school',
  'summer-playhouse',
  'mystery-carnival',
];

export const CAMPAIGN_LABELS: Record<CampaignId, string> = {
  default: '🏠 Default',
  'back-to-school': '🎒 Back to School',
  'summer-playhouse': '🏖️ Summer',
  'mystery-carnival': '🎪 Carnival',
};
