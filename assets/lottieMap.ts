import type { AnimationObject } from 'lottie-react-native';
import type { LottieKey } from '../src/types/sdui';

// Bundled campaign animations resolved by key (the on-device cache-hit path).
export const LOTTIE_ASSETS: Record<LottieKey, AnimationObject> = {
  'back-to-school': require('./lottie/back-to-school.json') as AnimationObject,
  'summer-playhouse': require('./lottie/summer-playhouse.json') as AnimationObject,
  'mystery-carnival': require('./lottie/mystery-carnival.json') as AnimationObject,
};
