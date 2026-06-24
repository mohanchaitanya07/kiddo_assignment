import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Product } from '../../types/sdui';
import { useTheme } from '../../theme/ThemeContext';
import { handleAction } from '../../actions/dispatcher';
import { useItemQty } from '../../store/cartStore';

interface Props {
  product: Product;
  width: number;
}

function ProductCardBase({ product, width }: Props): React.JSX.Element {
  const theme = useTheme();
  const qty = useItemQty(product.id);

  const onAdd = useCallback(() => {
    handleAction(product.addAction);
  }, [product.addAction]);

  const onOpen = useCallback(() => handleAction(product.action), [product.action]);

  return (
    <View style={[styles.card, { width, backgroundColor: theme.card }]}>
      <Pressable onPress={onOpen} style={[styles.thumb, { backgroundColor: product.swatch }]}>
        <Text style={styles.emoji}>{product.emoji}</Text>
        {product.badge ? (
          <View style={[styles.badge, { backgroundColor: theme.accent }]}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        ) : null}
      </Pressable>

      <Text numberOfLines={1} style={[styles.name, { color: theme.text }]}>
        {product.name}
      </Text>
      <Text style={[styles.price, { color: theme.textMuted }]}>₹{product.price}</Text>

      <Pressable
        onPress={onAdd}
        style={[styles.addBtn, { backgroundColor: theme.primary }]}
        accessibilityRole="button"
        accessibilityLabel={`Add ${product.name} to cart`}
      >
        <Text style={styles.addText}>{qty > 0 ? `Added · ${qty}` : 'ADD'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  thumb: {
    height: 96,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  emoji: { fontSize: 40 },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  name: { fontSize: 13, fontWeight: '600' },
  price: { fontSize: 12, marginTop: 2, marginBottom: 8 },
  addBtn: { borderRadius: 8, paddingVertical: 7, alignItems: 'center' },
  addText: { color: '#fff', fontWeight: '700', fontSize: 12 },
});

export const ProductCard = React.memo(ProductCardBase);
