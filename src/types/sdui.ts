export type Action =
  | { type: 'ADD_TO_CART'; payload: { id: string; name: string; price: number } }
  | { type: 'DEEP_LINK'; payload: { url: string } }
  | { type: 'OPEN_PRODUCT'; payload: { id: string } }
  | { type: 'BOOK_EVENT'; payload: { eventId: string; title: string } }
  | { type: 'APPLY_MYSTERY_GIFT_COUPON'; payload: { code: string } };

export type ActionType = Action['type'];

export interface Theme {
  primary: string;
  background: string;
  card: string;
  accent: string;
  text: string;
  textMuted: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  swatch: string;
  emoji: string;
  badge?: string;
  action: Action;
  addAction: Extract<Action, { type: 'ADD_TO_CART' }>;
}

export interface BannerHeroBlock {
  id: string;
  type: 'BANNER_HERO';
  data: {
    title: string;
    subtitle: string;
    emoji: string;
    bgColor?: string;
    action: Action;
  };
}

export interface ProductGrid2x2Block {
  id: string;
  type: 'PRODUCT_GRID_2X2';
  data: {
    title: string;
    products: Product[];
  };
}

export interface DynamicCollectionBlock {
  id: string;
  type: 'DYNAMIC_COLLECTION';
  data: {
    title: string;
    contextTheme: string;
    products: Product[];
  };
}

export type LayoutBlock =
  | BannerHeroBlock
  | ProductGrid2x2Block
  | DynamicCollectionBlock;

export type BlockType = LayoutBlock['type'];

// Untrusted wire format: `type` may be unknown to this app version and `data`
// is unverified until a block validator narrows it.
export interface RawBlock {
  id?: string;
  type?: string;
  data?: unknown;
  [key: string]: unknown;
}

export type CampaignId =
  | 'default'
  | 'back-to-school'
  | 'summer-playhouse'
  | 'mystery-carnival';

export type LottieKey = 'back-to-school' | 'summer-playhouse' | 'mystery-carnival';

export interface OverlayConfig {
  type: 'FULL_SCREEN_OVERLAY';
  animation: LottieKey;
  animation_url: string;
}

export interface HomePayload {
  campaignId: CampaignId;
  theme: Theme;
  overlay: OverlayConfig | null;
  layout: RawBlock[];
}
