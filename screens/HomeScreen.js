import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuestCard from '../components/QuestCard';
import { REALM_SUMMARY } from '../data/maxxLibrary';
import SpaceBackdrop from '../components/SpaceBackdrop';

export default function HomeScreen({
  user,
  maxxScale,
  onCompleteQuest,
  onRefreshDailyQuests,
}) {
  const navigation = useNavigation();
  const pslProgressPercent = Math.max(0, Math.min(100, (Number(maxxScale) || 0) * 10));

  useEffect(() => {
    onRefreshDailyQuests();
  }, [onRefreshDailyQuests]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SpaceBackdrop />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>MaxxHub</Text>
        <Text style={styles.subheading}>Futuristic protocol for elite self-upgrades</Text>

        <View style={styles.scoreCard}>
          <View style={styles.scoreItem}>
            <Text style={styles.bigNumber}>{maxxScale}</Text>
            <Text style={styles.label}>Maxx Scale</Text>
          </View>
        </View>

        <View style={styles.scoreCardSecondary}>
          <View style={styles.scoreItem}>
            <Text style={styles.bigNumber}>{user.level}</Text>
            <Text style={styles.label}>Level</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.bigNumber}>{user.streak}</Text>
            <Text style={styles.label}>Streak</Text>
          </View>
        </View>

        <View style={styles.scoreCardSecondary}>
          <Text style={styles.smallSectionTitle}>PSL Ladder</Text>
          <View style={styles.scaleTrack}>
            <View style={[styles.scaleFill, { width: `${pslProgressPercent}%` }]} />
            <View style={[styles.scaleMarker, { left: `${pslProgressPercent}%` }]} />
          </View>
          <View style={styles.scaleLabels}>
            {['F', 'D', 'C', 'B', 'A', 'S'].map((tier) => (
              <Text key={tier} style={styles.scaleLabel}>
                {tier}
              </Text>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Maxxing Categories</Text>
        {REALM_SUMMARY.map((realm) => (
          <Pressable
            key={realm.id}
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Explore', { initialRealmId: realm.id })}
          >
            <Text style={styles.categoryTitle}>{realm.title}</Text>
            <Text style={styles.categorySubtitle}>{realm.subtitle}</Text>
            <Text style={styles.categoryLink}>
              Open {realm.subcategoryCount} Subsystems
            </Text>
          </Pressable>
        ))}

        <Text style={styles.sectionTitle}>Daily Quests</Text>
        {user.dailyQuests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} onComplete={onCompleteQuest} />
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
    paddingTop: 24,
    paddingBottom: 34,
  },
  heading: {
    color: '#E6ECFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  subheading: {
    color: '#7A8CB4',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  scoreCard: {
    backgroundColor: '#0A0F1F',
    borderWidth: 1,
    borderColor: '#1B2540',
    borderRadius: 16,
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
    color: '#00E5FF',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  bigNumberSmall: {
    color: '#00E5FF',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  label: {
    color: '#7A8CB4',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    color: '#D6DEFA',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  categoryCard: {
    backgroundColor: '#0A0F1F',
    borderWidth: 1,
    borderColor: '#1B2540',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#00E5FF',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  scoreCardSecondary: {
    backgroundColor: '#0A0F1F',
    borderWidth: 1,
    borderColor: '#1B2540',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryTitle: {
    color: '#ECF2FF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  categorySubtitle: {
    color: '#8FA2CC',
    fontSize: 14,
    marginBottom: 8,
  },
  categoryLink: {
    color: '#00E5FF',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  smallSectionTitle: {
    color: '#D6DEFA',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  scaleTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#1F335F',
    overflow: 'visible',
  },
  scaleFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#00E5FF',
  },
  scaleMarker: {
    position: 'absolute',
    top: -4,
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#00E5FF',
    marginLeft: -9,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  scaleLabel: {
    color: '#8FA2CC',
    fontSize: 11,
    fontWeight: '700',
  },
});
