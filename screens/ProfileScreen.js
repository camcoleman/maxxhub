import React from 'react';
import { Alert, Pressable, Share, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SpaceBackdrop from '../components/SpaceBackdrop';

function getRecommendations(metrics) {
  const age = Number(metrics.age);
  const heightFeet = Number(metrics.heightFeet);
  const heightInches = Number(metrics.heightInches);
  const totalInches = heightFeet * 12 + heightInches;
  const heightCm = totalInches > 0 ? totalInches * 2.54 : 0;
  const weightLbs = Number(metrics.weightLbs);
  const weightKg = weightLbs > 0 ? weightLbs * 0.453592 : 0;
  const netWorth = Number(metrics.netWorthUsd);
  const gymStatus = metrics.gymStatus;

  const recommendations = [];

  if (heightCm > 0 && weightKg > 0) {
    const bmi = weightKg / (heightCm / 100) ** 2;
    if (bmi < 20) {
      recommendations.push(
        'Body drawback: low mass for your frame. Prioritize strengthmaxxing with calorie surplus and 3-4 progressive gym sessions weekly.'
      );
    } else if (bmi > 27) {
      recommendations.push(
        'Body drawback: excess body-fat likely reducing looks and energy. Run a controlled cut with high protein, daily steps, and sleep consistency.'
      );
    }
  }

  if (Number.isFinite(age) && age < 21) {
    recommendations.push(
      'Money drawback: early-stage financial leverage. Focus on skillmaxxing and incomemaxxing through one monetizable skill.'
    );
  } else if (Number.isFinite(age) && age > 35) {
    recommendations.push(
      'Energy drawback: recovery becomes strategic. Lock sleepmaxxing and posturemaxxing to keep output high.'
    );
  }

  if (gymStatus === 'beginner') {
    recommendations.push(
      'Gym drawback: low training baseline. Start with full-body sessions 3x/week and track lifts to build momentum.'
    );
  } else if (gymStatus === 'advanced') {
    recommendations.push(
      'Gym drawback: plateaus from complexity. Simplify programming cycles and protect recovery quality.'
    );
  }

  if (Number.isFinite(netWorth) && netWorth < 10000) {
    recommendations.push(
      'Money drawback: low financial runway. Build emergency savings and increase income reps before lifestyle upgrades.'
    );
  } else if (Number.isFinite(netWorth) && netWorth >= 100000) {
    recommendations.push(
      'Identity drawback: comfort trap risk. Shift to networkmaxxing and high-leverage projects for exponential growth.'
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      'Your profile has no major red flags. Keep compounding across Sleepmaxxing, Skillmaxxing, and Socialmaxxing for balanced growth.'
    );
  }

  return recommendations.slice(0, 4);
}

export default function ProfileScreen({ user, maxxRating }) {
  const sortedStats = Object.entries(user.stats).sort((a, b) => b[1] - a[1]);
  const topThree = sortedStats.slice(0, 3).map(([name]) => name);
  const weakest = sortedStats[sortedStats.length - 1]?.[0] || 'N/A';
  const metrics = user.metrics || {};
  const recommendations = getRecommendations(metrics);

  const handleShare = async () => {
    const message = [
      'MAXX BREAKDOWN CARD',
      `Maxx Score: ${maxxRating}`,
      `Strongest: ${topThree.join(', ')}`,
      `Weakest: ${weakest}`,
      `Level ${user.level} | ${user.streak} day streak`,
      'Built in MaxxHub',
    ].join('\n');

    try {
      await Share.share({ message });
    } catch (error) {
      Alert.alert('Share failed', 'Could not open share sheet right now.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SpaceBackdrop />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Profile</Text>

        <View style={styles.card}>
          <Text style={styles.item}>Level: {user.level}</Text>
          <Text style={styles.item}>XP: {user.xp}</Text>
          <Text style={styles.item}>Streak: {user.streak}</Text>
          <Text style={styles.item}>Maxx Score: {maxxRating}</Text>
          <Text style={styles.item}>Strongest: {topThree.join(', ')}</Text>
          <Text style={styles.item}>Weakest: {weakest}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subheading}>Stats</Text>
          {Object.entries(user.stats).map(([name, value]) => (
            <Text key={name} style={styles.item}>
              {name}: {value}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.subheading}>Baseline Snapshot</Text>
          <Text style={styles.item}>
            Height: {metrics.heightFeet || '-'} ft {metrics.heightInches || '0'} in
          </Text>
          <Text style={styles.item}>Weight: {metrics.weightLbs || '-'} lbs</Text>
          <Text style={styles.item}>Age: {metrics.age || '-'}</Text>
          <Text style={styles.item}>Gym Status: {metrics.gymStatus || '-'}</Text>
          <Text style={styles.item}>Net Worth: ${metrics.netWorthUsd || '-'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subheading}>Recommendation Engine</Text>
          {recommendations.map((entry) => (
            <Text key={entry} style={styles.recommendation}>
              • {entry}
            </Text>
          ))}
        </View>

        <Pressable style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareText}>Share Maxx Breakdown Card</Text>
        </Pressable>
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
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#0A0F1F',
    borderWidth: 1,
    borderColor: '#1B2540',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#00B8D9',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  subheading: {
    color: '#D6DEFA',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  item: {
    color: '#9FB0D6',
    fontSize: 15,
    marginBottom: 4,
  },
  recommendation: {
    color: '#BFD0F3',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 7,
  },
  shareButton: {
    marginTop: 4,
    backgroundColor: '#00B8D9',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  shareText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
