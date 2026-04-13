import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import QuestCard from '../components/QuestCard';

export default function HomeScreen({
  user,
  maxxScore,
  onCompleteQuest,
  onRefreshDailyQuests,
}) {
  useEffect(() => {
    onRefreshDailyQuests();
  }, [onRefreshDailyQuests]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>MaxxHub</Text>

      <View style={styles.scoreCard}>
        <View style={styles.scoreItem}>
          <Text style={styles.bigNumber}>{maxxScore}</Text>
          <Text style={styles.label}>Maxx Score</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.bigNumber}>{user.level}</Text>
          <Text style={styles.label}>Level</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.bigNumber}>{user.streak}</Text>
          <Text style={styles.label}>Streak</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Daily Quests</Text>
      {user.dailyQuests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} onComplete={onCompleteQuest} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  scoreCard: {
    backgroundColor: '#121A31',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  scoreItem: {
    alignItems: 'center',
    flex: 1,
  },
  bigNumber: {
    color: '#F8FAFC',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#E2E8F0',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
});
