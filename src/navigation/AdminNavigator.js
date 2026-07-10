import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

// ── Admin Screens ──────────────────────────────────────────────
import AdminDashboard from '../screens/admin/AdminDashboard';
import ContentManager from '../screens/admin/ContentManager';
import QuizBuilder from '../screens/admin/QuizBuilder';
import StudentManager from '../screens/admin/StudentManager';

const Tab = createBottomTabNavigator();

// ── Tab Icon Helper ────────────────────────────────────────────
const getTabIcon = (routeName, focused) => {
  const icons = {
    Dashboard: focused ? 'grid' : 'grid-outline',
    Content: focused ? 'book' : 'book-outline',
    Quizzes: focused ? 'clipboard' : 'clipboard-outline',
    Students: focused ? 'people' : 'people-outline',
  };
  return icons[routeName] || 'ellipse';
};

// ── Admin Tab Navigator ────────────────────────────────────────
const AdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
        name="Dashboard"
        component={AdminDashboard}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Content"
        component={ContentManager}
        options={{ title: 'Content' }}
      />
      <Tab.Screen
        name="Quizzes"
        component={QuizBuilder}
        options={{ title: 'Quizzes' }}
      />
      <Tab.Screen
        name="Students"
        component={StudentManager}
        options={{ title: 'Students' }}
      />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
