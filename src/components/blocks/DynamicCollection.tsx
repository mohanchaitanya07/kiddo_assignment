import React, { useCallback } from 'react';
import { FlatList, type ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
import type { DynamicCollectionBlock, Product, RawBlock } from '../../types/sdui';
import { useTheme } from '../../theme/ThemeContext';
import { registerBlock } from '../../registry/registry';
import { isObject, isString, parseProducts } from '../../registry/validate';
import { ProductCard } from '../common/ProductCard';

const CARD_W = 150;
const SPACING = 12;

function DynamicCollectionBase({ block }: { block: DynamicCollectionBlock }): React.JSX.Element {
  const theme = useTheme();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Product>) => <ProductCard product={item} width={CARD_W} />,
    [],
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<Product> | null | undefined, index: number) => ({
      length: CARD_W + SPACING,
      offset: (CARD_W + SPACING) * index,
      index,
    }),
    [],
  );

  return (
    <View>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{block.data.title}</Text>
        <View style={[styles.contextChip, { backgroundColor: theme.accent }]}>
          <Text style={styles.contextText}>{block.data.contextTheme}</Text>
        </View>
      </View>

      <FlatList
        data={block.data.products}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        horizontal
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.listContent}
        nestedScrollEnabled
      />
    </View>
  );
}

const Separator = () => <View style={{ width: SPACING }} />;

const DynamicCollection = React.memo(DynamicCollectionBase);

function parse(raw: RawBlock): DynamicCollectionBlock | null {
  if (!isString(raw.id) || !isObject(raw.data)) return null;
  const d = raw.data;
  if (!isString(d.title) || !isString(d.contextTheme)) return null;
  const products = parseProducts(d.products);
  if (products.length === 0) return null;
  return {
    id: raw.id,
    type: 'DYNAMIC_COLLECTION',
    data: { title: d.title, contextTheme: d.contextTheme, products },
  };
}

registerBlock({ type: 'DYNAMIC_COLLECTION', parse, Component: DynamicCollection });

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 17, fontWeight: '800' },
  contextChip: { marginLeft: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  contextText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  listContent: { paddingRight: 16 },
});

export default DynamicCollection;
