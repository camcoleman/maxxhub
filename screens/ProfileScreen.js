import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SpaceBackdrop from '../components/SpaceBackdrop';

export default function ProfileScreen({ user, maxxScore }) {
  const handleShare = () => {
    const message = `MaxxHub Progress -> Level ${user.level}, XP ${user.xp}, Streak ${user.streak}, Maxx Score ${maxxScore}`;
    console.log(message);
    Alert.alert('Progress Shared', 'Your progress summary was logged to the console.');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SpaceBackdrop />
      <View style={styles.content}>
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
    paddingBottom: 30,
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
