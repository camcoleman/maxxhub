import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen({ user, maxxScore }) {
  const handleShare = () => {
    const message = `MaxxHub Progress -> Level ${user.level}, XP ${user.xp}, Streak ${user.streak}, Maxx Score ${maxxScore}`;
    console.log(message);
    Alert.alert('Progress Shared', 'Your progress summary was logged to the console.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.item}>Level: {user.level}</Text>
        <Text style={styles.item}>XP: {user.xp}</Text>
        <Text style={styles.item}>Streak: {user.streak}</Text>
        <Text style={styles.item}>Maxx Score: {maxxScore}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.subheading}>Stats</Text>
        {Object.entries(user.stats).map(([name, value]) => (
          <Text key={name} style={styles.item}>
            {name}: {value}
          </Text>
        ))}
      </View>

      <Pressable style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareText}>Share Progress</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
    padding: 16,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#121A31',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  subheading: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  item: {
    color: '#CBD5E1',
    fontSize: 15,
    marginBottom: 4,
  },
  shareButton: {
    marginTop: 4,
    backgroundColor: '#6D28D9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  shareText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
