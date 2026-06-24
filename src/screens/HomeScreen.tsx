import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { CampaignId, HomePayload } from '../types/sdui';
import { parseLayout, type RenderableBlock } from '../registry/parseLayout';
import { useTheme } from '../theme/ThemeContext';
import { Header } from '../components/common/Header';
import { FeedList } from '../components/common/FeedList';

interface Props {
  payload: HomePayload;
  active: CampaignId;
  onSelectCampaign: (id: CampaignId) => void;
}

function HomeScreenBase({ payload, active, onSelectCampaign }: Props): React.JSX.Element {
  const theme = useTheme();

  const data = useMemo<RenderableBlock[]>(() => parseLayout(payload.layout), [payload.layout]);

  const renderItem = useCallback((item: RenderableBlock) => {
    const { Component, block } = item;
    return (
      <View style={styles.row}>
        <Component block={block} />
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: RenderableBlock) => item.id, []);
  const getItemType = useCallback((item: RenderableBlock) => item.block.type, []);

  const header = useMemo(
    () => <Header active={active} onSelect={onSelectCampaign} />,
    [active, onSelectCampaign],
  );

  return (
    <FeedList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemType={getItemType}
      ListHeaderComponent={header}
      contentContainerStyle={{ backgroundColor: theme.background, paddingHorizontal: 16, paddingBottom: 40 }}
    />
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: 18 },
});

export const HomeScreen = React.memo(HomeScreenBase);
