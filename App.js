import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import RealmsScreen from './screens/RealmsScreen';
import ProfileScreen from './screens/ProfileScreen';
import { QUEST_POOL } from './data/quests';

const Tab = createBottomTabNavigator();

const DARK_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0B1020',
    card: '#121A31',
    text: '#E5E7EB',
    border: '#1E293B',
    primary: '#6D28D9',
  },
};

const getToday = () => new Date().toISOString().split('T')[0];

const pickDailyQuests = () => {
  const shuffled = [...QUEST_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((quest) => ({
    ...quest,
    completed: false,
  }));
};

const defaultStats = {
  Attractiveness: 50,
  Status: 50,
  Energy: 50,
  Social: 50,
  Identity: 50,
};

export default function App() {
  const [user, setUser] = useState({
    stats: defaultStats,
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null,
    dailyQuestDate: getToday(),
    dailyQuests: pickDailyQuests(),
  });

  const maxxScore = useMemo(() => {
    const values = Object.values(user.stats);
    const total = values.reduce((sum, value) => sum + value, 0);
    return Math.round(total / values.length);
  }, [user.stats]);

  const handleCompleteQuest = (questId) => {
    const today = getToday();

    setUser((prevUser) => {
      let streak = prevUser.streak;
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];

      if (prevUser.lastActiveDate !== today) {
        if (prevUser.lastActiveDate === yesterdayString) {
          streak += 1;
        } else {
          streak = 1;
        }
      }

      const updatedQuests = prevUser.dailyQuests.map((quest) => {
        if (quest.id === questId && !quest.completed) {
          return { ...quest, completed: true };
        }
        return quest;
      });

      const completedQuest = prevUser.dailyQuests.find((quest) => quest.id === questId);
      if (!completedQuest || completedQuest.completed) {
        return prevUser;
      }

      const updatedStats = {
        ...prevUser.stats,
        [completedQuest.category]: Math.min(
          prevUser.stats[completedQuest.category] + 2,
          100
        ),
      };

      const xp = prevUser.xp + 10;
      const level = Math.floor(xp / 100) + 1;

      return {
        ...prevUser,
        stats: updatedStats,
        xp,
        level,
        streak,
        lastActiveDate: today,
        dailyQuests: updatedQuests,
      };
    });
  };

  const refreshDailyQuestsIfNeeded = () => {
    const today = getToday();
    setUser((prevUser) => {
      if (prevUser.dailyQuestDate === today) {
        return prevUser;
      }

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      const streak = prevUser.lastActiveDate === yesterdayString ? prevUser.streak : 0;

      return {
        ...prevUser,
        streak,
        dailyQuestDate: today,
        dailyQuests: pickDailyQuests(),
      };
    });
  };

  const sharedProps = {
    user,
    maxxScore,
    onCompleteQuest: handleCompleteQuest,
    onRefreshDailyQuests: refreshDailyQuestsIfNeeded,
  };

  return (
    <NavigationContainer theme={DARK_THEME}>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#121A31', borderTopColor: '#1E293B' },
          tabBarActiveTintColor: '#A78BFA',
          tabBarInactiveTintColor: '#94A3B8',
        }}
      >
        <Tab.Screen name="Home">
          {() => <HomeScreen {...sharedProps} />}
        </Tab.Screen>
        <Tab.Screen name="Realms">
          {() => <RealmsScreen user={user} />}
        </Tab.Screen>
        <Tab.Screen name="Profile">
          {() => <ProfileScreen user={user} maxxScore={maxxScore} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
