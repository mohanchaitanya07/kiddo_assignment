import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { ProductGrid2x2Block, RawBlock } from '../../types/sdui';
import { useTheme } from '../../theme/ThemeContext';
import { registerBlock } from '../../registry/registry';
import { isObject, isString, parseProducts } from '../../registry/validate';
import { ProductCard } from '../common/ProductCard';

function ProductGrid2x2Base({ block }: { block: ProductGrid2x2Block }): React.JSX.Element {
  const theme = useTheme();
  const { width: screenW } = useWindowDimensions();
  const GUTTER = 10;
  const cardW = (screenW - 16 * 2 - GUTTER) / 2;
  const products = block.data.products.slice(0, 4);

  return (
    <View>
      <Text style={[styles.title, { color: theme.text }]}>{block.data.title}</Text>
      <View style={styles.grid}>
        {products.map((p) => (
          <View key={p.id} style={{ marginBottom: GUTTER }}>
            <ProductCard product={p} width={cardW} />
          </View>
        ))}
      </View>
    </View>
  );
}

const ProductGrid2x2 = React.memo(ProductGrid2x2Base);

function parse(raw: RawBlock): ProductGrid2x2Block | null {
  if (!isString(raw.id) || !isObject(raw.data)) return null;
  const d = raw.data;
  if (!isString(d.title)) return null;
  const products = parseProducts(d.products);
  if (products.length === 0) return null;
  return { id: raw.id, type: 'PRODUCT_GRID_2X2', data: { title: d.title, products } };
}

registerBlock({ type: 'PRODUCT_GRID_2X2', parse, Component: ProductGrid2x2 });

const styles = StyleSheet.create({
  title: { fontSize: 17, fontWeight: '800', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});

export default ProductGrid2x2;
