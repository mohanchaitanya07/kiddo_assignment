import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BannerHeroBlock, RawBlock } from '../../types/sdui';
import { useTheme } from '../../theme/ThemeContext';
import { handleAction } from '../../actions/dispatcher';
import { registerBlock } from '../../registry/registry';
import { isObject, isString, parseAction } from '../../registry/validate';

function BannerHeroBase({ block }: { block: BannerHeroBlock }): React.JSX.Element {
  const theme = useTheme();
  const { title, subtitle, emoji, bgColor, action } = block.data;
  const onPress = useCallback(() => handleAction(action), [action]);

  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: bgColor ?? theme.primary }]}>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={[styles.cta, { backgroundColor: theme.accent }]}>
          <Text style={styles.ctaText}>Shop now →</Text>
        </View>
      </View>
      <Text style={styles.emoji}>{emoji}</Text>
    </Pressable>
  );
}

const BannerHero = React.memo(BannerHeroBase);

function parse(raw: RawBlock): BannerHeroBlock | null {
  if (!isString(raw.id) || !isObject(raw.data)) return null;
  const d = raw.data;
  const action = parseAction(d.action);
  if (!isString(d.title) || !isString(d.subtitle) || !isString(d.emoji) || !action) {
    return null;
  }
  return {
    id: raw.id,
    type: 'BANNER_HERO',
    data: {
      title: d.title,
      subtitle: d.subtitle,
      emoji: d.emoji,
      bgColor: isString(d.bgColor) ? d.bgColor : undefined,
      action,
    },
  };
}

registerBlock({ type: 'BANNER_HERO', parse, Component: BannerHero });

const styles = StyleSheet.create({
  card: {
    minHeight: 140,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  textCol: { flex: 1, paddingRight: 8 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#fff', fontSize: 13, marginTop: 4, opacity: 0.95 },
  cta: { alignSelf: 'flex-start', marginTop: 12, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  emoji: { fontSize: 64 },
});

export default BannerHero;
