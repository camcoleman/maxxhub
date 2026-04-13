import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ExploreScreen from './screens/ExploreScreen';
import RealmsScreen from './screens/RealmsScreen';
import ProfileScreen from './screens/ProfileScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import { QUEST_POOL } from './data/quests';
import { SUBCATEGORY_INDEX } from './data/maxxLibrary';

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

const realmStatKeys = ['Looks', 'Body', 'Money', 'Energy', 'Social', 'Identity'];

const pickDailyQuests = () => {
  const shuffled = [...QUEST_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((quest) => ({
    ...quest,
    completed: false,
  }));
};

const createInitialSubcategoryProgress = () =>
  Object.keys(SUBCATEGORY_INDEX).reduce((acc, subcategoryId) => {
    acc[subcategoryId] = { level: 1, completionCount: 0, tier: 'Beginner' };
    return acc;
  }, {});

const defaultStats = {
  Looks: 42,
  Body: 46,
  Money: 38,
  Energy: 44,
  Social: 40,
  Identity: 43,
};

const defaultMetrics = {
  heightFeet: '5',
  heightInches: '10',
  weightLbs: '',
  age: '24',
  gender: 'male',
  gymStatus: 'beginner',
  sleepHours: '7',
  groomingConsistency: '6',
  socialConfidence: '5',
  incomeMomentum: '5',
  netWorthUsd: '',
};

const clampStat = (value) => Math.max(0, Math.min(100, value));

const createStatsFromMetrics = (metrics) => {
  const heightInches = (Number(metrics.heightFeet) || 5) * 12 + (Number(metrics.heightInches) || 8);
  const weightLbs = Number(metrics.weightLbs) || 165;
  const age = Number(metrics.age) || 24;
  const netWorth = Number(metrics.netWorthUsd) || 0;
  const gymStatus = metrics.gymStatus || 'beginner';
  const sleepHours = Number(metrics.sleepHours) || 7;
  const groomingConsistency = Number(metrics.groomingConsistency) || 6;
  const socialConfidence = Number(metrics.socialConfidence) || 5;
  const incomeMomentum = Number(metrics.incomeMomentum) || 5;

  const bmi = (weightLbs * 703) / Math.max(heightInches, 1) ** 2;
  const bodyBase =
    gymStatus === 'advanced' ? 64 : gymStatus === 'intermediate' ? 56 : 48;
  const body = clampStat(
    Math.round(bodyBase + (bmi > 20 && bmi < 27 ? 4 : -2) + (sleepHours >= 7 ? 2 : -2))
  );
  const looks = clampStat(
    Math.round(
      38 +
        (heightInches >= 70 ? 4 : 0) +
        (gymStatus !== 'beginner' ? 3 : 0) +
        groomingConsistency * 2
    )
  );
  const money = clampStat(
    Math.round(30 + Math.min(25, Math.log10(Math.max(netWorth, 1)) * 5) + incomeMomentum * 2)
  );
  const energy = clampStat(
    Math.round(40 + (age < 30 ? 4 : age > 40 ? -3 : 1) + sleepHours * 3)
  );
  const social = clampStat(Math.round(36 + socialConfidence * 4 + (gymStatus === 'advanced' ? 3 : 0)));
  const identity = clampStat(Math.round(40 + incomeMomentum * 2 + (netWorth > 10000 ? 4 : 1)));

  return {
    Looks: looks,
    Body: body,
    Money: money,
    Energy: energy,
    Social: social,
    Identity: identity,
  };
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
    subcategoryProgress: createInitialSubcategoryProgress(),
    metrics: defaultMetrics,
    onboardingComplete: false,
  });

  const maxxScore = useMemo(() => {
    const values = realmStatKeys.map((realm) => user.stats[realm] || 0);
    const total = values.reduce((sum, value) => sum + value, 0);
    return Math.round(total / values.length);
  }, [user.stats]);

  const maxxScale = useMemo(() => (maxxScore / 10).toFixed(1), [maxxScore]);

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

  const handleCompleteSubcategorySession = (subcategoryId) => {
    const subcategory = SUBCATEGORY_INDEX[subcategoryId];
    if (!subcategory) {
      return;
    }

    const today = getToday();

    setUser((prevUser) => {
      const previousProgress = prevUser.subcategoryProgress[subcategoryId] || {
        level: 1,
        completionCount: 0,
        tier: 'Beginner',
      };
      const completionCount = previousProgress.completionCount + 1;
      const level = Math.min(10, Math.floor(completionCount / 2) + 1);
      let tier = 'Beginner';
      if (level >= 7) {
        tier = 'Advanced';
      } else if (level >= 4) {
        tier = 'Intermediate';
      }

      const xp = prevUser.xp + 15;
      const profileLevel = Math.floor(xp / 100) + 1;
      const statKey = subcategory.realmTitle;
      const updatedStats = {
        ...prevUser.stats,
        [statKey]: Math.min((prevUser.stats[statKey] || 0) + 1, 100),
      };

      return {
        ...prevUser,
        stats: updatedStats,
        xp,
        level: profileLevel,
        lastActiveDate: today,
        subcategoryProgress: {
          ...prevUser.subcategoryProgress,
          [subcategoryId]: {
            level,
            completionCount,
            tier,
          },
        },
      };
    });
  };

  const handleUpdateMetrics = (incomingMetrics) => {
    setUser((prevUser) => ({
      ...prevUser,
      metrics: {
        ...prevUser.metrics,
        ...incomingMetrics,
      },
    }));
  };

  const handleCompleteOnboarding = (metrics) => {
    setUser((prevUser) => ({
      ...prevUser,
      stats: createStatsFromMetrics({
        ...prevUser.metrics,
        ...metrics,
      }),
      metrics: {
        ...prevUser.metrics,
        ...metrics,
      },
      onboardingComplete: true,
    }));
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
    maxxScale,
    onCompleteQuest: handleCompleteQuest,
    onCompleteSubcategorySession: handleCompleteSubcategorySession,
    onRefreshDailyQuests: refreshDailyQuestsIfNeeded,
    onUpdateMetrics: handleUpdateMetrics,
  };

  if (!user.onboardingComplete) {
    return (
      <SafeAreaProvider>
        <NavigationContainer theme={DARK_THEME}>
          <StatusBar style="light" />
          <OnboardingScreen onComplete={handleCompleteOnboarding} />
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
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
          <Tab.Screen name="Leaderboard">
            {() => <LeaderboardScreen user={user} maxxScale={maxxScale} />}
          </Tab.Screen>
          <Tab.Screen name="Explore">
            {(props) => <ExploreScreen {...props} {...sharedProps} />}
          </Tab.Screen>
          <Tab.Screen name="Realms">
            {() => <RealmsScreen user={user} />}
          </Tab.Screen>
          <Tab.Screen name="Profile">
            {() => (
              <ProfileScreen
                user={user}
                maxxScale={maxxScale}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
