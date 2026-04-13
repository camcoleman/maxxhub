import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SpaceBackdrop from '../components/SpaceBackdrop';

function ProgressBar({ value }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${value}%` }]} />
    </View>
  );
}

export default function RealmsScreen({ user }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SpaceBackdrop />
      <ScrollView contentContainerStyle={styles.content}>
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
    paddingBottom: 34,
  },
  heading: {
    color: '#E6ECFF',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  realmCard: {
    backgroundColor: '#0A0F1F',
    borderWidth: 1,
    borderColor: '#1B2540',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#00B8D9',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  realmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  realmTitle: {
    color: '#D6DEFA',
    fontSize: 16,
    fontWeight: '600',
  },
  realmValue: {
    color: '#00E5FF',
    fontSize: 16,
    fontWeight: '700',
  },
  progressTrack: {
    height: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#19233F',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00B8D9',
  },
});
