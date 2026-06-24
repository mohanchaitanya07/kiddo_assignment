import React, { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Side-effect import: registers all block types before any layout is parsed.
import './src/components/blocks';

import type { CampaignId } from './src/types/sdui';
import { PAYLOADS } from './src/data/payloads';
import { ThemeProvider } from './src/theme/ThemeContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { CampaignOverlay } from './src/components/CampaignOverlay';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';

// Root engine node. Holds the active campaign and selects its payload; the
// payload's theme drives the ThemeProvider and its overlay drives the Lottie layer.
export default function App(): React.JSX.Element {
  const [active, setActive] = useState<CampaignId>('default');
  const payload = PAYLOADS[active];

  const onSelectCampaign = useCallback((id: CampaignId) => setActive(id), []);

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={payload.theme}>
        <SafeAreaView style={[styles.root, { backgroundColor: payload.theme.background }]} edges={['top']}>
          <ErrorBoundary>
            <View style={styles.fill}>
              <HomeScreen payload={payload} active={active} onSelectCampaign={onSelectCampaign} />
              <CampaignOverlay overlay={payload.overlay} />
            </View>
          </ErrorBoundary>
          <StatusBar style="dark" />
        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fill: { flex: 1 },
});
