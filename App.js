// ============================================================
// Study X — Root Entry Point
// ============================================================

import React, { useEffect } from 'react';
import { StyleSheet, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/contexts/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

// Suppress known non-critical warnings in dev
LogBox.ignoreLogs([
  'AsyncStorage has been extracted',
  'Setting a timer',
]);

export default function App() {
  useEffect(() => {
    // App initialized
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer
          theme={{
            dark: true,
            colors: {
              primary: '#6C63FF',
              background: '#0A1128',
              card: '#151D33',
              text: '#FFFFFF',
              border: '#2A3454',
              notification: '#FF6B6B',
            },
          }}
        >
          <RootNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
