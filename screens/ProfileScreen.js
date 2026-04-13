import React, { useMemo, useState } from 'react';
import { Alert, Pressable, Share, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SpaceBackdrop from '../components/SpaceBackdrop';
import { calculateMaxxScore } from '../utils/scoring';
import { calculatePSLScore } from '../utils/pslScoring';

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

export default function ProfileScreen({ user, maxxRating, onUpdateTopPSL }) {
  const sortedStats = Object.entries(user.stats).sort((a, b) => b[1] - a[1]);
  const topThree = sortedStats.slice(0, 3).map(([name]) => name);
  const weakest = sortedStats[sortedStats.length - 1]?.[0] || 'N/A';
  const metrics = user.metrics || {};
  const recommendations = getRecommendations(metrics);
  const heightInInches = (Number(metrics.heightFeet) || 0) * 12 + (Number(metrics.heightInches) || 0);

  // Replace these demo fallbacks with persisted profile fields when backend user profiles are added.
  const scoringInputs = {
    looks: user.stats?.Looks ?? 62,
    body: user.stats?.Body ?? 58,
    status: user.stats?.Money ?? 55,
    energy: user.stats?.Energy ?? 60,
    social: user.stats?.Social ?? 57,
    heightInInches: heightInInches || 69,
    gender: metrics.gender === 'female' ? 'female' : 'male',
  };

  const scoreBreakdown = calculateMaxxScore(scoringInputs);
  const pslDefaults = useMemo(
    () => ({
      canthalTilt: '5',
      eyeSpacing: '5',
      browArea: '5',
      underEye: '5',
      eyeOpenness: '5',
      jawline: '5',
      chinProjection: '5',
      cheekbones: '5',
      profileBalance: '5',
      skinClarity: '5',
      acneTexture: '5',
      grooming: '5',
      haircutFit: '5',
      hairDensity: '5',
      hairline: '5',
      hairstyleFit: '5',
      symmetry: '5',
      facialHarmony: '5',
      physique: '5',
      bodyFatScore: '5',
      posture: '5',
      style: '5',
      heightInInches: String(heightInInches || 68),
      gender: metrics.gender === 'female' ? 'female' : 'male',
    }),
    [heightInInches, metrics.gender]
  );
  const [pslForm, setPslForm] = useState(pslDefaults);
  const [pslResult, setPslResult] = useState(null);
  const [pslError, setPslError] = useState('');

  const pslFields = [
    ['canthalTilt', 'Canthal Tilt'],
    ['eyeSpacing', 'Eye Spacing'],
    ['browArea', 'Brow Area'],
    ['underEye', 'Under Eye'],
    ['eyeOpenness', 'Eye Openness'],
    ['jawline', 'Jawline'],
    ['chinProjection', 'Chin Projection'],
    ['cheekbones', 'Cheekbones'],
    ['profileBalance', 'Profile Balance'],
    ['skinClarity', 'Skin Clarity'],
    ['acneTexture', 'Acne Texture'],
    ['grooming', 'Grooming'],
    ['haircutFit', 'Haircut Fit'],
    ['hairDensity', 'Hair Density'],
    ['hairline', 'Hairline'],
    ['hairstyleFit', 'Hairstyle Fit'],
    ['symmetry', 'Symmetry'],
    ['facialHarmony', 'Facial Harmony'],
    ['physique', 'Physique'],
    ['bodyFatScore', 'Body Fat Score'],
    ['posture', 'Posture'],
    ['style', 'Style'],
  ];

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

  const handleSubmitPSL = () => {
    try {
      // Replace this temporary form state with persisted profile inputs later.
      const result = calculatePSLScore(pslForm);
      if (!result || typeof result.rawPSL !== 'number') {
        setPslResult(null);
        setPslError('Unable to compute PSL score right now. Please check your inputs and try again.');
        return;
      }
      setPslError('');
      setPslResult(result);
      onUpdateTopPSL?.(result.rawPSL);
    } catch (error) {
      setPslResult(null);
      setPslError('Unable to compute PSL score right now. Please check your inputs and try again.');
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
          <Text style={styles.subheading}>Central Scoring Engine</Text>
          <Text style={styles.item}>Overall Grade: {scoreBreakdown.grade}</Text>
          <Text style={styles.item}>Raw Maxx Score: {scoreBreakdown.rawScore}/100</Text>
          <Text style={styles.item}>
            Controllable Score: {scoreBreakdown.controllableScore}/100
          </Text>
          <Text style={styles.item}>Height Modifier: {scoreBreakdown.heightModifier}</Text>
          <Text style={styles.item}>Strongest Area: {scoreBreakdown.strongestArea}</Text>
          <Text style={styles.item}>Weakest Area: {scoreBreakdown.weakestArea}</Text>
          <Text style={styles.recommendation}>{scoreBreakdown.personalizedMessage}</Text>
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
          <Text style={styles.item}>Gender: {metrics.gender || '-'}</Text>
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

        <View style={styles.card}>
          <Text style={styles.subheading}>PSL Input Lab (0-10)</Text>
          <Text style={styles.item}>
            Enter face/body/style scores, then submit to render a live PSL-style rating.
          </Text>

          <View style={styles.row}>
            <View style={styles.inputCol}>
              <Text style={styles.inputLabel}>Height (inches)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={pslForm.heightInInches}
                onChangeText={(value) =>
                  setPslForm((prev) => ({
                    ...prev,
                    heightInInches: value,
                  }))
                }
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderRow}>
                {['male', 'female'].map((gender) => (
                  <Pressable
                    key={gender}
                    onPress={() => setPslForm((prev) => ({ ...prev, gender }))}
                    style={[
                      styles.genderButton,
                      pslForm.gender === gender && styles.genderButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        pslForm.gender === gender && styles.genderButtonTextActive,
                      ]}
                    >
                      {gender}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.formGrid}>
            {pslFields.map(([key, label]) => (
              <View key={key} style={styles.inputBlock}>
                <Text style={styles.inputLabel}>{label}</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={pslForm[key]}
                  onChangeText={(value) =>
                    setPslForm((prev) => ({
                      ...prev,
                      [key]: value,
                    }))
                  }
                />
              </View>
            ))}
          </View>

          <Pressable style={styles.submitButton} onPress={handleSubmitPSL}>
            <Text style={styles.submitText}>Calculate PSL Score</Text>
          </Pressable>

          {pslError ? <Text style={styles.errorText}>{pslError}</Text> : null}

          {pslResult ? (
            <View style={styles.resultCard}>
              <Text style={styles.item}>Grade: {pslResult.grade}</Text>
              <Text style={styles.item}>Raw PSL Score: {pslResult.rawPSL}/100</Text>
              <Text style={styles.item}>
                Controllable Score: {pslResult.controllablePSL}/100
              </Text>
              <Text style={styles.item}>Height Modifier: {pslResult.heightModifier}</Text>
              <Text style={styles.item}>Strongest Area: {pslResult.strongestArea}</Text>
              <Text style={styles.item}>Weakest Area: {pslResult.weakestArea}</Text>
              <Text style={styles.recommendation}>{pslResult.personalizedMessage}</Text>
            </View>
          ) : null}
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
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  inputCol: {
    flex: 1,
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  inputBlock: {
    width: '48.5%',
    marginBottom: 10,
  },
  inputLabel: {
    color: '#8FA2CC',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#050913',
    borderWidth: 1,
    borderColor: '#1F335F',
    borderRadius: 10,
    color: '#E6ECFF',
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    borderRadius: 999,
    borderColor: '#1F335F',
    borderWidth: 1,
    paddingVertical: 9,
    alignItems: 'center',
  },
  genderButtonActive: {
    borderColor: '#00E5FF',
    backgroundColor: '#082030',
  },
  genderButtonText: {
    color: '#8FA2CC',
    fontWeight: '700',
    textTransform: 'capitalize',
    fontSize: 12,
  },
  genderButtonTextActive: {
    color: '#00E5FF',
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 999,
    backgroundColor: '#00B8D9',
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 12,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    marginTop: 4,
  },
  resultCard: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F335F',
    backgroundColor: '#060B18',
    padding: 12,
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
