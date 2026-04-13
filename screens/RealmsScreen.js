import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function ProgressBar({ value }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${value}%` }]} />
    </View>
  );
}

export default function RealmsScreen({ user }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Realms</Text>
      {Object.entries(user.stats).map(([realm, value]) => (
        <View key={realm} style={styles.realmCard}>
          <View style={styles.realmHeader}>
            <Text style={styles.realmTitle}>{realm}</Text>
            <Text style={styles.realmValue}>{value}</Text>
          </View>
          <ProgressBar value={value} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
    padding: 16,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 14,
  },
  realmCard: {
    backgroundColor: '#121A31',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  realmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  realmTitle: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '600',
  },
  realmValue: {
    color: '#A78BFA',
    fontSize: 16,
    fontWeight: '700',
  },
  progressTrack: {
    height: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#334155',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6D28D9',
  },
});
