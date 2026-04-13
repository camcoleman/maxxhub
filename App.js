import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import RealmsScreen from './screens/RealmsScreen';
import ProfileScreen from './screens/ProfileScreen';
import MaxxingGuideScreen from './screens/MaxxingGuideScreen';
import { QUEST_POOL } from './data/quests';

const Tab = createBottomTabNavigator();

const DARK_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#03040A',
    card: '#0A0F1F',
    text: '#E6ECFF',
    border: '#1B2540',
    primary: '#00E5FF',
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
          tabBarShowIcon: false,
          tabBarStyle: {
            backgroundColor: '#050913',
            borderTopColor: '#1B2540',
            borderTopWidth: 1,
            height: 78,
            paddingBottom: 12,
            paddingTop: 10,
          },
          tabBarActiveTintColor: '#00E5FF',
          tabBarInactiveTintColor: '#6E7FA8',
          tabBarItemStyle: {
            justifyContent: 'center',
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '700',
            letterSpacing: 0.4,
          },
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
        <Tab.Screen
          name="MaxxingGuide"
          component={MaxxingGuideScreen}
          options={({ route }) => ({
            headerShown: true,
            title: route?.params?.title || 'Maxxing Guide',
            tabBarButton: () => null,
            tabBarItemStyle: { width: 0, display: 'none' },
            tabBarStyle: { display: 'none' },
            headerStyle: { backgroundColor: '#050913' },
            headerTintColor: '#E6ECFF',
            headerTitleStyle: { fontWeight: '700' },
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
