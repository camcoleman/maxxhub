import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function QuestCard({ quest, onComplete }) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>{quest.title}</Text>
        <Text style={styles.category}>{quest.category}</Text>
      </View>
      <Pressable
        style={[styles.button, quest.completed && styles.buttonDisabled]}
        onPress={() => onComplete(quest.id)}
        disabled={quest.completed}
      >
        <Text style={styles.buttonText}>
          {quest.completed ? 'Completed' : 'Complete'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0A0F1F',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1B2540',
    shadowColor: '#00B8D9',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  title: {
    fontSize: 16,
    color: '#E6ECFF',
    fontWeight: '600',
    marginBottom: 6,
  },
  category: {
    fontSize: 13,
    color: '#00E5FF',
    letterSpacing: 0.3,
  },
  button: {
    marginTop: 12,
    backgroundColor: '#00B8D9',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#324261',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
