import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SpaceBackdrop from '../components/SpaceBackdrop';
import { MAXX_LIBRARY } from '../data/maxxLibrary';

function getTierColor(tier) {
  if (tier === 'Advanced') {
    return '#F59E0B';
  }
  if (tier === 'Intermediate') {
    return '#22D3EE';
  }
  return '#6EE7B7';
}

export default function ExploreScreen({ route, user, onCompleteSubcategorySession }) {
  const initialRealmId = route?.params?.initialRealmId;
  const [expandedRealmId, setExpandedRealmId] = useState(initialRealmId || MAXX_LIBRARY[0].id);

  const totalCompletedSessions = useMemo(() => {
    return Object.values(user.subcategoryProgress || {}).reduce(
      (total, progress) => total + (progress.completionCount || 0),
      0
    );
  }, [user.subcategoryProgress]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SpaceBackdrop />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>MaxxLibrary</Text>
        <Text style={styles.subheading}>Explore realms, train sub-maxxing systems, stack levels.</Text>

        <View style={styles.metaCard}>
          <Text style={styles.metaTitle}>Optimization Feed</Text>
          <Text style={styles.metaText}>Total logged sessions: {totalCompletedSessions}</Text>
          <Text style={styles.metaText}>Tap a realm, then swipe across sub-maxxing cards.</Text>
        </View>

        {MAXX_LIBRARY.map((realm) => {
          const realmSessions = realm.subcategories.reduce(
            (total, sub) => total + (user.subcategoryProgress?.[sub.id]?.completionCount || 0),
            0
          );
          const isExpanded = expandedRealmId === realm.id;

          return (
            <View key={realm.id} style={styles.realmContainer}>
              <Pressable
                style={styles.realmHeader}
                onPress={() => setExpandedRealmId(isExpanded ? '' : realm.id)}
              >
                <View>
                  <Text style={styles.realmTitle}>{realm.title}</Text>
                  <Text style={styles.realmSubtitle}>{realm.subtitle}</Text>
                </View>
                <View style={styles.realmMeta}>
                  <Text style={styles.realmMetaText}>{realmSessions} sessions</Text>
                  <Text style={styles.realmMetaText}>{isExpanded ? 'Hide' : 'Open'}</Text>
                </View>
              </Pressable>

              {isExpanded && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardRail}>
                  {realm.subcategories.map((subcategory) => {
                    const progress = user.subcategoryProgress?.[subcategory.id] || {
                      level: 1,
                      completionCount: 0,
                      tier: 'Beginner',
                    };

                    return (
                      <View key={subcategory.id} style={styles.subCard}>
                        <Text style={styles.subTitle}>{subcategory.title}</Text>
                        <Text style={styles.impact}>Impact Score {subcategory.impactScore}/10</Text>
                        <Text style={styles.why}>{subcategory.whyItMatters}</Text>

                        <Text style={styles.blockHeading}>Action Steps</Text>
                        {subcategory.steps.map((step) => (
                          <Text key={step} style={styles.step}>
                            • {step}
                          </Text>
                        ))}

                        <Text style={styles.blockHeading}>Most Common Advice Online</Text>
                        <Text style={styles.advice}>{subcategory.advice.common}</Text>

                        <Text style={styles.blockHeading}>Most Effective Pattern</Text>
                        <Text style={styles.advice}>{subcategory.advice.pattern}</Text>

                        <Text style={styles.blockHeading}>Beginner Mistakes</Text>
                        <Text style={styles.advice}>{subcategory.advice.mistake}</Text>

                        <View style={styles.progressRow}>
                          <Text style={styles.progressText}>Level {progress.level}/10</Text>
                          <Text style={[styles.tierPill, { color: getTierColor(progress.tier) }]}>
                            {progress.tier}
                          </Text>
                        </View>
                        <Text style={styles.progressText}>
                          Sessions completed: {progress.completionCount}
                        </Text>

                        <Pressable
                          style={styles.sessionButton}
                          onPress={() => onCompleteSubcategorySession(subcategory.id)}
                        >
                          <Text style={styles.sessionButtonText}>Log Maxx Session +15 XP</Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          );
        })}
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
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  subheading: {
    color: '#8FA2CC',
    fontSize: 14,
    marginBottom: 12,
  },
  metaCard: {
    backgroundColor: '#0A0F1F',
    borderColor: '#1B2540',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  metaTitle: {
    color: '#ECF2FF',
    fontWeight: '700',
    marginBottom: 6,
  },
  metaText: {
    color: '#9FB0D6',
    fontSize: 13,
    marginBottom: 3,
  },
  realmContainer: {
    marginBottom: 12,
  },
  realmHeader: {
    backgroundColor: '#0A0F1F',
    borderColor: '#1B2540',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  realmTitle: {
    color: '#ECF2FF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  realmSubtitle: {
    color: '#8FA2CC',
    fontSize: 13,
    maxWidth: 220,
  },
  realmMeta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  realmMetaText: {
    color: '#00E5FF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardRail: {
    marginTop: 10,
  },
  subCard: {
    width: 310,
    backgroundColor: '#0B1124',
    borderColor: '#1D2D53',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    shadowColor: '#00E5FF',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  subTitle: {
    color: '#ECF2FF',
    fontSize: 18,
    fontWeight: '800',
  },
  impact: {
    color: '#00E5FF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  why: {
    color: '#9FB0D6',
    marginTop: 10,
    marginBottom: 10,
    lineHeight: 20,
  },
  blockHeading: {
    color: '#D6DEFA',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 4,
  },
  step: {
    color: '#DCE6FF',
    fontSize: 13,
    marginBottom: 4,
    lineHeight: 20,
  },
  advice: {
    color: '#AFC1E8',
    fontSize: 13,
    lineHeight: 20,
  },
  progressRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    color: '#9FB0D6',
    fontSize: 13,
    marginTop: 4,
  },
  tierPill: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  sessionButton: {
    marginTop: 12,
    backgroundColor: '#00B8D9',
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: 'center',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  sessionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
