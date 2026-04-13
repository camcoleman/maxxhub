import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SpaceBackdrop from '../components/SpaceBackdrop';
import { getGlobalLeaderboard } from '../data/globalLeaderboard';

export default function LeaderboardScreen({ user, maxxScale }) {
  const [selectedEntry, setSelectedEntry] = useState(null);

  const leaderboard = useMemo(
    () =>
      getGlobalLeaderboard({
        handle: 'You',
        maxxScale: Number(maxxScale),
        rankTitle: 'Your Current Tier',
        stats: {
          Looks: user.stats?.Looks || 0,
          Body: user.stats?.Body || 0,
          Money: user.stats?.Money || 0,
          Energy: user.stats?.Energy || 0,
          Social: user.stats?.Social || 0,
          Identity: user.stats?.Identity || 0,
        },
      }),
    [maxxScale, user.stats]
  );

  if (selectedEntry) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <SpaceBackdrop />
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable style={styles.backButton} onPress={() => setSelectedEntry(null)}>
            <Text style={styles.backText}>← Back to Leaderboard</Text>
          </Pressable>
          <Text style={styles.heading}>{selectedEntry.handle}</Text>
          <Text style={styles.subheading}>Profile Rating + Stat Breakdown</Text>

          <View style={styles.card}>
            <Text style={styles.bigScale}>{selectedEntry.maxxScale.toFixed(1)}</Text>
            <Text style={styles.label}>Maxx Scale</Text>
            <Text style={styles.item}>Rank: #{selectedEntry.rank}</Text>
            <Text style={styles.item}>Tier: {selectedEntry.rankTitle}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Stats</Text>
            {Object.entries(selectedEntry.stats || {}).map(([key, value]) => (
              <Text key={key} style={styles.item}>
                {key}: {value}
              </Text>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SpaceBackdrop />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Leaderboard</Text>
        <Text style={styles.subheading}>Global vertical ranking by Maxx Scale</Text>

        <View style={styles.card}>
          {leaderboard.map((entry) => (
            <Pressable
              key={`${entry.handle}-${entry.rank}`}
              style={styles.row}
              onPress={() => setSelectedEntry(entry)}
            >
              <Text style={styles.rank}>#{entry.rank}</Text>
              <View style={styles.mid}>
                <Text style={styles.name}>{entry.handle}</Text>
                <Text style={styles.meta}>{entry.rankTitle}</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.scale}>{entry.maxxScale.toFixed(1)}</Text>
                <Text style={styles.scaleLabel}>Scale</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03040A',
  },
  content: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 34,
  },
  heading: {
    color: '#E6ECFF',
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 4,
  },
  subheading: {
    color: '#8FA2CC',
    fontSize: 13,
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: '#0A0F1F',
    borderColor: '#1B2540',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#16213A',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  rank: {
    width: 36,
    color: '#00E5FF',
    fontWeight: '800',
  },
  mid: {
    flex: 1,
  },
  name: {
    color: '#E6ECFF',
    fontWeight: '700',
    fontSize: 15,
  },
  meta: {
    color: '#8FA2CC',
    fontSize: 12,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  scale: {
    color: '#00E5FF',
    fontSize: 20,
    fontWeight: '800',
  },
  scaleLabel: {
    color: '#8FA2CC',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  backButton: {
    alignSelf: 'flex-start',
    borderColor: '#1F335F',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 12,
  },
  backText: {
    color: '#00E5FF',
    fontWeight: '700',
    fontSize: 12,
  },
  bigScale: {
    color: '#00E5FF',
    fontSize: 46,
    fontWeight: '800',
    textAlign: 'center',
  },
  label: {
    color: '#8FA2CC',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 0.8,
    fontSize: 12,
  },
  sectionTitle: {
    color: '#D6DEFA',
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 2,
    fontSize: 16,
  },
  item: {
    color: '#BFD0F3',
    fontSize: 14,
    marginBottom: 5,
  },
});
