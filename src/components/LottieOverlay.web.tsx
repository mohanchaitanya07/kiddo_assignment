import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import type { LottieOverlayProps } from './LottieOverlay';

const PARTICLES = 16;

const VISUALS: Record<string, { glyphs: string[]; color: string }> = {
  'back-to-school': { glyphs: ['✏️', '📄', '📘'], color: 'rgba(21,101,192,0.18)' },
  'summer-playhouse': { glyphs: ['💧', '⚪', '🏖️'], color: 'rgba(0,172,193,0.18)' },
  'mystery-carnival': { glyphs: ['🎊', '🎁', '✨'], color: 'rgba(229,57,53,0.16)' },
};

// Web variant: lottie-react-native is native-first, so web gets a lightweight
// full-screen animation that preserves the same non-occluding overlay contract.
export function LottieOverlay({ animationKey }: LottieOverlayProps): React.JSX.Element {
  const progress = useRef(new Animated.Value(0)).current;
  const visual = VISUALS[animationKey] ?? VISUALS['mystery-carnival'];

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLES }, (_, index) => ({
        id: index,
        glyph: visual.glyphs[index % visual.glyphs.length],
        left: `${(index * 19) % 100}%` as `${number}%`,
        delay: index / PARTICLES,
        size: 18 + (index % 4) * 4,
      })),
    [visual],
  );

  useEffect(() => {
    progress.setValue(0);
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 5200,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [animationKey, progress]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: visual.color }]} />
      {particles.map((particle) => {
        const phase = Animated.modulo(Animated.add(progress, particle.delay), 1);
        const translateY = phase.interpolate({
          inputRange: [0, 1],
          outputRange: [-80, 820],
        });
        const rotate = phase.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        });
        const opacity = phase.interpolate({
          inputRange: [0, 0.12, 0.85, 1],
          outputRange: [0, 0.9, 0.9, 0],
        });

        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                left: particle.left,
                opacity,
                transform: [{ translateY }, { rotate }],
              },
            ]}
          >
            <Text style={[styles.glyph, { fontSize: particle.size }]}>{particle.glyph}</Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    top: 0,
  },
  glyph: {
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
