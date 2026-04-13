import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MAXXING_GUIDES } from '../data/maxxingGuides';
import SpaceBackdrop from '../components/SpaceBackdrop';

export default function MaxxingGuideScreen({ route }) {
  const navigation = useNavigation();
  const categoryId = route?.params?.categoryId;
  const guide = categoryId ? MAXXING_GUIDES[categoryId] : null;

  if (!guide) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <SpaceBackdrop />
        <View style={styles.content}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={styles.heading}>Guide Not Found</Text>
          <Text style={styles.description}>
            We could not find this maxxing category. Go back and select another one.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SpaceBackdrop />
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.heading}>{guide.title}</Text>
        <Text style={styles.description}>{guide.subtitle}</Text>

        <Text style={styles.sectionTitle}>How to maxx this category</Text>
        {guide.steps.map((step, index) => (
          <View key={step} style={styles.stepCard}>
            <Text style={styles.stepNumber}>Step {index + 1}</Text>
            <Text style={styles.stepText}>{step}</Text>
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
    paddingTop: 24,
    paddingBottom: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#0A0F1F',
    borderColor: '#1B2540',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 12,
    shadowColor: '#00E5FF',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  backText: {
    color: '#00E5FF',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  heading: {
    color: '#ECF2FF',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 8,
  },
  description: {
    color: '#8FA2CC',
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#D6DEFA',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  stepCard: {
    backgroundColor: '#0A0F1F',
    borderWidth: 1,
    borderColor: '#1B2540',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#00B8D9',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  stepNumber: {
    color: '#00E5FF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  stepText: {
    color: '#D6DEFA',
    fontSize: 15,
    lineHeight: 22,
  },
});
