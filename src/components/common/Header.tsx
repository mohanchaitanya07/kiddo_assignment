import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { CampaignId } from '../../types/sdui';
import { useTheme } from '../../theme/ThemeContext';
import { useCartCount } from '../../store/cartStore';
import { CAMPAIGN_LABELS, CAMPAIGN_ORDER } from '../../data/payloads';

// Subscribes only to `count`, so it re-renders on cart changes while the feed does not.
const CartBadge = React.memo(function CartBadge() {
  const theme = useTheme();
  const count = useCartCount();
  return (
    <View style={[styles.cart, { backgroundColor: theme.primary }]}>
      <Text style={styles.cartEmoji}>🛒</Text>
      {count > 0 ? (
        <View style={[styles.countBubble, { backgroundColor: theme.accent }]}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      ) : null}
    </View>
  );
});

interface Props {
  active: CampaignId;
  onSelect: (id: CampaignId) => void;
}

function HeaderBase({ active, onSelect }: Props): React.JSX.Element {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.hi, { color: theme.textMuted }]}>Deliver in 10 min</Text>
          <Text style={[styles.title, { color: theme.text }]}>Kiddo</Text>
        </View>
        <CartBadge />
      </View>

      <Text style={[styles.switchLabel, { color: theme.textMuted }]}>
        Live campaign (server-driven — no app update):
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {CAMPAIGN_ORDER.map((id) => {
          const selected = id === active;
          return (
            <Pressable
              key={id}
              onPress={() => onSelect(id)}
              style={[
                styles.chip,
                { borderColor: theme.primary },
                selected && { backgroundColor: theme.primary },
              ]}
            >
              <Text style={[styles.chipText, { color: selected ? '#fff' : theme.primary }]}>
                {CAMPAIGN_LABELS[id]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 4, paddingBottom: 12 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  hi: { fontSize: 12 },
  title: { fontSize: 26, fontWeight: '900' },
  cart: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cartEmoji: { fontSize: 20 },
  countBubble: {
    position: 'absolute', top: -4, right: -4, minWidth: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  countText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  switchLabel: { fontSize: 11, marginBottom: 8 },
  chips: { gap: 8, paddingRight: 8 },
  chip: { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  chipText: { fontSize: 12, fontWeight: '700' },
});

export const Header = React.memo(HeaderBase);
