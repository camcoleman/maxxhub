import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import SpaceBackdrop from '../components/SpaceBackdrop';

const gymOptions = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];
const genderOptions = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
];
const confidenceScale = Array.from({ length: 10 }, (_, index) => `${index + 1}`);

export default function OnboardingScreen({ onComplete }) {
  const insets = useSafeAreaInsets();
  const [heightFeet, setHeightFeet] = useState('5');
  const [heightInches, setHeightInches] = useState('10');
  const [weightLbs, setWeightLbs] = useState('');
  const [age, setAge] = useState('24');
  const [gender, setGender] = useState('male');
  const [gymStatus, setGymStatus] = useState('beginner');
  const [sleepHours, setSleepHours] = useState('7');
  const [groomingConsistency, setGroomingConsistency] = useState('6');
  const [socialConfidence, setSocialConfidence] = useState('5');
  const [incomeMomentum, setIncomeMomentum] = useState('5');
  const [netWorthUsd, setNetWorthUsd] = useState('');
  const [step, setStep] = useState(0);

  const steps = ['Gender', 'Age', 'Height', 'Weight', 'Gym', 'Sleep', 'Grooming', 'Social', 'Income', 'Net Worth'];
  const canSubmit = useMemo(
    () => Number(weightLbs) > 0 && Number(netWorthUsd) >= 0 && Number(age) > 0,
    [weightLbs, netWorthUsd, age]
  );

  const handleContinue = () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    if (!canSubmit) {
      return;
    }
    onComplete({
      heightFeet,
      heightInches,
      weightLbs,
      age,
      gender,
      gymStatus,
      sleepHours,
      groomingConsistency,
      socialConfidence,
      incomeMomentum,
      netWorthUsd,
    });
  };
  const handleBack = () => setStep((prev) => Math.max(0, prev - 1));
  const progressWidth = `${((step + 1) / steps.length) * 100}%`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SpaceBackdrop />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 16) + 16 }]}
      >
        <Text style={styles.heading}>Welcome to MaxxHub</Text>
        <Text style={styles.subheading}>Answer quick prompts to generate a sharper starting score.</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.stepLabel}>Step {step + 1}/{steps.length} - {steps[step]}</Text>

        <View style={styles.card}>
          {step === 0 ? (
            <>
              <Text style={styles.question}>What is your gender?</Text>
              <View style={styles.optionRow}>
                {genderOptions.map((option) => {
                  const selected = gender === option.id;
                  return (
                    <Pressable
                      key={option.id}
                      style={[styles.optionButton, selected && styles.optionButtonSelected]}
                      onPress={() => setGender(option.id)}
                    >
                      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <Text style={styles.question}>How old are you?</Text>
              <View style={styles.singleWheel}>
                <Picker selectedValue={age} onValueChange={setAge} style={styles.picker} itemStyle={styles.pickerItem}>
                  {Array.from({ length: 53 }, (_, index) => `${index + 16}`).map((optionAge) => (
                    <Picker.Item key={optionAge} label={`${optionAge}`} value={optionAge} />
                  ))}
                </Picker>
              </View>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <Text style={styles.question}>What is your height?</Text>
              <View style={styles.wheelRow}>
                <View style={styles.wheelBox}>
                  <Text style={styles.wheelLabel}>Feet</Text>
                  <Picker selectedValue={heightFeet} onValueChange={setHeightFeet} style={styles.picker} itemStyle={styles.pickerItem}>
                    {Array.from({ length: 4 }, (_, index) => `${index + 4}`).map((feet) => (
                      <Picker.Item key={feet} label={`${feet} ft`} value={feet} />
                    ))}
                  </Picker>
                </View>
                <View style={styles.wheelBox}>
                  <Text style={styles.wheelLabel}>Inches</Text>
                  <Picker selectedValue={heightInches} onValueChange={setHeightInches} style={styles.picker} itemStyle={styles.pickerItem}>
                    {Array.from({ length: 12 }, (_, index) => `${index}`).map((inch) => (
                      <Picker.Item key={inch} label={`${inch} in`} value={inch} />
                    ))}
                  </Picker>
                </View>
              </View>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <Text style={styles.question}>What is your weight in pounds?</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={weightLbs}
                onChangeText={setWeightLbs}
                placeholder="e.g. 170"
                placeholderTextColor="#6074A0"
              />
            </>
          ) : null}

          {step === 4 ? (
            <>
              <Text style={styles.question}>How would you rate your gym status?</Text>
              <View style={styles.optionRow}>
                {gymOptions.map((option) => {
                  const selected = gymStatus === option.id;
                  return (
                    <Pressable
                      key={option.id}
                      style={[styles.optionButton, selected && styles.optionButtonSelected]}
                      onPress={() => setGymStatus(option.id)}
                    >
                      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}

          {step === 5 ? (
            <>
              <Text style={styles.question}>How many hours do you usually sleep?</Text>
              <View style={styles.singleWheel}>
                <Picker selectedValue={sleepHours} onValueChange={setSleepHours} style={styles.picker} itemStyle={styles.pickerItem}>
                  {Array.from({ length: 7 }, (_, index) => `${index + 4}`).map((hours) => (
                    <Picker.Item key={hours} label={`${hours} hours`} value={hours} />
                  ))}
                </Picker>
              </View>
            </>
          ) : null}

          {step === 6 ? (
            <>
              <Text style={styles.question}>Grooming consistency (1-10)</Text>
              <View style={styles.scaleRow}>
                {confidenceScale.map((value) => {
                  const selected = groomingConsistency === value;
                  return (
                    <Pressable
                      key={value}
                      style={[styles.scaleChip, selected && styles.scaleChipActive]}
                      onPress={() => setGroomingConsistency(value)}
                    >
                      <Text style={[styles.scaleText, selected && styles.scaleTextActive]}>{value}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}

          {step === 7 ? (
            <>
              <Text style={styles.question}>Social confidence right now (1-10)</Text>
              <View style={styles.scaleRow}>
                {confidenceScale.map((value) => {
                  const selected = socialConfidence === value;
                  return (
                    <Pressable
                      key={value}
                      style={[styles.scaleChip, selected && styles.scaleChipActive]}
                      onPress={() => setSocialConfidence(value)}
                    >
                      <Text style={[styles.scaleText, selected && styles.scaleTextActive]}>{value}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}

          {step === 8 ? (
            <>
              <Text style={styles.question}>Income momentum this month (1-10)</Text>
              <View style={styles.scaleRow}>
                {confidenceScale.map((value) => {
                  const selected = incomeMomentum === value;
                  return (
                    <Pressable
                      key={value}
                      style={[styles.scaleChip, selected && styles.scaleChipActive]}
                      onPress={() => setIncomeMomentum(value)}
                    >
                      <Text style={[styles.scaleText, selected && styles.scaleTextActive]}>{value}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}

          {step === 9 ? (
            <>
              <Text style={styles.question}>Current net worth (USD)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={netWorthUsd}
                onChangeText={setNetWorthUsd}
                placeholder="e.g. 15000"
                placeholderTextColor="#6074A0"
              />
            </>
          ) : null}

          <View style={styles.navRow}>
            <Pressable
              style={[styles.navButton, step === 0 && styles.navButtonDisabled]}
              onPress={handleBack}
              disabled={step === 0}
            >
              <Text style={styles.navText}>Back</Text>
            </Pressable>
            <Pressable
              style={[
                styles.navButton,
                styles.navPrimary,
                step === steps.length - 1 && !canSubmit && styles.navButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={step === steps.length - 1 && !canSubmit}
            >
              <Text style={styles.navText}>{step === steps.length - 1 ? 'Finish' : 'Next'}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#03040A' },
  content: { padding: 16, paddingBottom: 32 },
  heading: { color: '#E6ECFF', fontSize: 32, fontWeight: '800', marginBottom: 6 },
  subheading: { color: '#8FA2CC', fontSize: 14, marginBottom: 10 },
  progressTrack: { height: 8, borderRadius: 999, backgroundColor: '#152544', overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: '#00E5FF' },
  stepLabel: { color: '#8FA2CC', fontSize: 12, textTransform: 'uppercase', marginBottom: 12 },
  card: { backgroundColor: '#0A0F1F', borderColor: '#1B2540', borderWidth: 1, borderRadius: 14, padding: 14 },
  question: { color: '#E6ECFF', fontSize: 20, fontWeight: '700', marginBottom: 10 },
  wheelRow: { flexDirection: 'row', gap: 10 },
  wheelBox: { flex: 1, borderWidth: 1, borderColor: '#1F335F', backgroundColor: '#060B18', borderRadius: 10, overflow: 'hidden' },
  wheelLabel: { color: '#00E5FF', fontSize: 11, fontWeight: '700', textAlign: 'center', paddingTop: 8 },
  singleWheel: { borderWidth: 1, borderColor: '#1F335F', backgroundColor: '#060B18', borderRadius: 10, overflow: 'hidden' },
  picker: { color: '#E6ECFF', height: 150 },
  pickerItem: { color: '#E6ECFF', fontSize: 16 },
  input: { backgroundColor: '#060B18', borderColor: '#1F335F', borderWidth: 1, borderRadius: 10, color: '#E6ECFF', paddingHorizontal: 12, paddingVertical: 10 },
  optionRow: { flexDirection: 'row', gap: 8 },
  optionButton: { flex: 1, borderRadius: 999, borderWidth: 1, borderColor: '#1F335F', paddingVertical: 10, alignItems: 'center' },
  optionButtonSelected: { borderColor: '#00E5FF', backgroundColor: '#082030' },
  optionText: { color: '#8FA2CC', fontWeight: '600', fontSize: 12 },
  optionTextSelected: { color: '#00E5FF' },
  scaleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  scaleChip: { width: '17%', minWidth: 38, borderRadius: 999, borderWidth: 1, borderColor: '#1F335F', paddingVertical: 8, alignItems: 'center' },
  scaleChipActive: { borderColor: '#00E5FF', backgroundColor: '#082030' },
  scaleText: { color: '#8FA2CC', fontWeight: '700' },
  scaleTextActive: { color: '#00E5FF' },
  navRow: { marginTop: 18, flexDirection: 'row', gap: 10 },
  navButton: { flex: 1, borderRadius: 999, borderWidth: 1, borderColor: '#1F335F', paddingVertical: 12, alignItems: 'center' },
  navPrimary: { backgroundColor: '#00B8D9', borderColor: '#00B8D9' },
  navButtonDisabled: { opacity: 0.35 },
  navText: { color: '#FFFFFF', fontWeight: '800', letterSpacing: 0.4 },
});
