import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView, { type AnimationObject } from 'lottie-react-native';

// Native Lottie renderer (Metro picks LottieOverlay.web.tsx on web instead).
// pointerEvents="none" keeps the underlying feed fully interactive.
export interface LottieOverlayProps {
  source: AnimationObject | { uri: string };
  animationKey: string;
}

export function LottieOverlay({ source, animationKey }: LottieOverlayProps): React.JSX.Element {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LottieView
        key={animationKey}
        source={source}
        autoPlay
        loop
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
