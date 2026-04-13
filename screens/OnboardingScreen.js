import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import SpaceBackdrop from '../components/SpaceBackdrop';

const gymOptions = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export default function OnboardingScreen({ onComplete }) {
  const [heightFeet, setHeightFeet] = useState('5');
  const [heightInches, setHeightInches] = useState('10');
  const [weightLbs, setWeightLbs] = useState('');
  const [age, setAge] = useState('24');
  const [gymStatus, setGymStatus] = useState('beginner');
  const [netWorthUsd, setNetWorthUsd] = useState('');

  const canContinue = useMemo(
    () => Number(weightLbs) > 0 && Number(netWorthUsd) >= 0 && Number(age) > 0,
    [weightLbs, netWorthUsd, age]
  );

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    onComplete({
      heightFeet,
      heightInches,
      weightLbs,
      age,
      gymStatus,
      netWorthUsd,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SpaceBackdrop />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Welcome to MaxxHub</Text>
        <Text style={styles.subheading}>Build your baseline to unlock personalized drawbacks.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Height (ft / in)</Text>
          <View style={styles.wheelRow}>
            <View style={styles.wheelBox}>
              <Text style={styles.wheelLabel}>Feet</Text>
              <Picker
                selectedValue={heightFeet}
                onValueChange={(value) => setHeightFeet(value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {Array.from({ length: 4 }, (_, index) => `${index + 4}`).map((feet) => (
                  <Picker.Item key={feet} label={`${feet} ft`} value={feet} />
                ))}
              </Picker>
            </View>
            <View style={styles.wheelBox}>
              <Text style={styles.wheelLabel}>Inches</Text>
              <Picker
                selectedValue={heightInches}
                onValueChange={(value) => setHeightInches(value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {Array.from({ length: 12 }, (_, index) => `${index}`).map((inch) => (
                  <Picker.Item key={inch} label={`${inch} in`} value={inch} />
                ))}
              </Picker>
            </View>
          </View>

          <Text style={styles.label}>Age</Text>
          <View style={styles.singleWheel}>
            <Picker
              selectedValue={age}
              onValueChange={(value) => setAge(value)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {Array.from({ length: 53 }, (_, index) => `${index + 16}`).map((optionAge) => (
                <Picker.Item key={optionAge} label={`${optionAge}`} value={optionAge} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Weight (lbs)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={weightLbs}
            onChangeText={setWeightLbs}
            placeholder="e.g. 170"
            placeholderTextColor="#6074A0"
          />

          <Text style={styles.label}>Net Worth (USD)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={netWorthUsd}
            onChangeText={setNetWorthUsd}
            placeholder="e.g. 15000"
            placeholderTextColor="#6074A0"
          />

          <Text style={styles.label}>Gym Status</Text>
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
        </View>

        <Pressable
          style={[styles.ctaButton, !canContinue && styles.ctaDisabled]}
          disabled={!canContinue}
          onPress={handleContinue}
        >
          <Text style={styles.ctaText}>Launch My Maxx System</Text>
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
    paddingBottom: 32,
  },
  heading: {
    color: '#E6ECFF',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 6,
  },
  subheading: {
    color: '#8FA2CC',
    fontSize: 14,
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#0A0F1F',
    borderColor: '#1B2540',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  label: {
    color: '#8FA2CC',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 10,
    marginBottom: 6,
  },
  wheelRow: {
    flexDirection: 'row',
    gap: 10,
  },
  wheelBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#1F335F',
    backgroundColor: '#060B18',
    borderRadius: 10,
    overflow: 'hidden',
  },
  wheelLabel: {
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: 8,
  },
  singleWheel: {
    borderWidth: 1,
    borderColor: '#1F335F',
    backgroundColor: '#060B18',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    color: '#E6ECFF',
    height: 150,
  },
  pickerItem: {
    color: '#E6ECFF',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#060B18',
    borderColor: '#1F335F',
    borderWidth: 1,
    borderRadius: 10,
    color: '#E6ECFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1F335F',
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: '#00E5FF',
    backgroundColor: '#082030',
  },
  optionText: {
    color: '#8FA2CC',
    fontWeight: '600',
    fontSize: 12,
  },
  optionTextSelected: {
    color: '#00E5FF',
  },
  ctaButton: {
    marginTop: 14,
    backgroundColor: '#00B8D9',
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: 'center',
  },
  ctaDisabled: {
    opacity: 0.45,
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
