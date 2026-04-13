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
    backgroundColor: '#1F2A44',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2F3D60',
  },
  title: {
    fontSize: 16,
    color: '#E5E7EB',
    fontWeight: '600',
    marginBottom: 6,
  },
  category: {
    fontSize: 13,
    color: '#A5B4FC',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#6D28D9',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#475569',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
