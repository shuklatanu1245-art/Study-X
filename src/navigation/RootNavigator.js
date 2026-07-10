import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import StudentNavigator from './StudentNavigator';
import AdminNavigator from './AdminNavigator';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * RootNavigator — top-level route guard.
 * Renders the correct navigator based on auth state and user role.
 */
const RootNavigator = () => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading Study X..." />;
  }

  if (!user) {
    return <AuthNavigator />;
  }

  if (userRole === 'admin') {
    return <AdminNavigator />;
  }

  // Default to student for any known or unknown role
  return <StudentNavigator />;
};

export default RootNavigator;
