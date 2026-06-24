import React from 'react';
import {
  FlatList,
  type ListRenderItem,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';

// FlashList v2 requires the New Architecture. We detect it once and fall back to
// a tuned FlatList otherwise, so the single-list feed runs on any host.
const g = globalThis as {
  nativeFabricUIManager?: unknown;
  __turboModuleProxy?: unknown;
};
const IS_NEW_ARCH: boolean = Boolean(g.nativeFabricUIManager || g.__turboModuleProxy);

export interface FeedListProps<T> {
  data: ReadonlyArray<T>;
  renderItem: (item: T, index: number) => React.ReactElement | null;
  keyExtractor: (item: T, index: number) => string;
  getItemType?: (item: T) => string;
  ListHeaderComponent?: React.ReactElement;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function FeedList<T>(props: FeedListProps<T>): React.JSX.Element {
  const { data, renderItem, keyExtractor, getItemType, ListHeaderComponent, contentContainerStyle } = props;

  if (IS_NEW_ARCH) {
    return (
      <FlashList
        data={data as T[]}
        renderItem={({ item, index }) => renderItem(item, index)}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  const flatRenderItem: ListRenderItem<T> = ({ item, index }) => renderItem(item, index);
  return (
    <FlatList
      data={data as T[]}
      renderItem={flatRenderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={9}
      updateCellsBatchingPeriod={50}
    />
  );
}
