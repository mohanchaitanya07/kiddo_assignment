import React, { useMemo } from 'react';
import type { OverlayConfig } from '../types/sdui';
import { LOTTIE_ASSETS } from '../../assets/lottieMap';
import { LottieOverlay } from './LottieOverlay';

// Resolves the campaign animation through a cache pipeline: bundled on-device
// asset is the cache hit; the remote animation_url is the documented miss path.
function resolveAnimationSource(overlay: OverlayConfig) {
  const local = LOTTIE_ASSETS[overlay.animation];
  if (local) return local;
  return { uri: overlay.animation_url };
}

function CampaignOverlayBase({ overlay }: { overlay: OverlayConfig | null }): React.JSX.Element | null {
  const source = useMemo(
    () => (overlay ? resolveAnimationSource(overlay) : null),
    [overlay],
  );

  if (!overlay || source === null) return null;

  return <LottieOverlay source={source} animationKey={overlay.animation} />;
}

export const CampaignOverlay = React.memo(CampaignOverlayBase);
