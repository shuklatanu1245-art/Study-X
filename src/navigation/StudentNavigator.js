import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

// ── Student Screens ────────────────────────────────────────────
import HomeScreen from '../screens/student/HomeScreen';
import ChaptersScreen from '../screens/student/ChaptersScreen';
import NotesViewerScreen from '../screens/student/NotesViewerScreen';
import QuizListScreen from '../screens/student/QuizListScreen';
import QuizScreen from '../screens/student/QuizScreen';
import ResultsScreen from '../screens/student/ResultsScreen';
import ProfileScreen from '../screens/student/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ── Shared stack header options ────────────────────────────────
const defaultStackScreenOptions = {
  headerStyle: {
    backgroundColor: COLORS.primary,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTintColor: COLORS.text,
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 17,
    color: COLORS.text,
  },
  headerBackTitleVisible: false,
  cardStyle: { backgroundColor: COLORS.background },
};

// ── Home Stack ─────────────────────────────────────────────────
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={defaultStackScreenOptions}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: 'Study X', headerLeft: () => null }}
      />
      <Stack.Screen
        name="ChaptersScreen"
        component={ChaptersScreen}
        options={{ title: 'Chapters' }}
      />
      <Stack.Screen
        name="NotesViewerScreen"
        component={NotesViewerScreen}
        options={{ title: 'Notes' }}
      />
      <Stack.Screen
        name="QuizListScreen"
        component={QuizListScreen}
        options={{ title: 'Quizzes' }}
      />
      <Stack.Screen
        name="QuizScreen"
        component={QuizScreen}
        options={{
          title: 'Quiz',
          gestureEnabled: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="ResultsScreen"
        component={ResultsScreen}
        options={{ title: 'Results' }}
      />
    </Stack.Navigator>
  );
};

// ── Tab Icon Helper ────────────────────────────────────────────
const getTabIcon = (routeName, focused) => {
  const icons = {
    Home: focused ? 'home' : 'home-outline',
    Profile: focused ? 'person' : 'person-outline',
  };
  return icons[routeName] || 'ellipse';
};

// ── Student Tab Navigator ──────────────────────────────────────
const StudentNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={getTabIcon(route.name, focused)}
            size={size}
            color={color}
          />
        ),
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 17,
            color: COLORS.text,
          },
          title: 'My Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default StudentNavigator;
