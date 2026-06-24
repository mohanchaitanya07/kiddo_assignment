import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

// Catches any render fault so a single bad block can't blank the whole app,
// and surfaces the message instead of failing silently.
interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render(): React.ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={styles.emoji}>🧯</Text>
        <Text style={styles.title}>Something went wrong</Text>
        <View style={styles.box}>
          <Text style={styles.msg}>{error.message}</Text>
        </View>
        <Text style={styles.hint}>{error.stack?.split('\n').slice(0, 6).join('\n')}</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  wrap: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#FFF5E6' },
  emoji: { fontSize: 48, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 16, color: '#1A1A1A' },
  box: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#FFCDD2' },
  msg: { fontSize: 14, color: '#C62828', fontWeight: '600' },
  hint: { fontSize: 11, color: '#6B6B6B', marginTop: 16, fontFamily: 'monospace' },
});
