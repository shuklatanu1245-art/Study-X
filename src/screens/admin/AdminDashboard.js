import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { subjectService } from '../../services/subjectService';
import { quizService } from '../../services/quizService';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import COLORS from '../../theme/colors';

const AdminDashboard = () => {
  const { user, userData, logout } = useAuth();
  const [studentCount, setStudentCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      // Count students from Firestore
      const studentsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'student')
      );
      const studentsSnapshot = await getDocs(studentsQuery);
      setStudentCount(studentsSnapshot.size);

      // Count subjects
      const subjects = await subjectService.getSubjectCount();
      setSubjectCount(subjects);

      // Count quizzes
      const quizzes = await quizService.getQuizCount();
      setQuizCount(quizzes);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchStats();
    }, [fetchStats])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
  }, [fetchStats]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.secondary}
            colors={[COLORS.secondary]}
            progressBackgroundColor={COLORS.surface}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.avatarContainer}>
              <Ionicons name="shield-checkmark" size={28} color={COLORS.secondary} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greeting}>
                Welcome back, {userData?.name || 'Admin'}
              </Text>
              <Text style={styles.headerTitle}>Admin Dashboard</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>Manage your learning platform</Text>
          <View style={styles.headerDivider} />
        </View>

        {/* Stat Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Platform Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Students"
              value={studentCount}
              icon="people"
              color={COLORS.secondary}
            />
            <StatCard
              title="Total Subjects"
              value={subjectCount}
              icon="book"
              color={COLORS.accent}
            />
            <StatCard
              title="Total Quizzes"
              value={quizCount}
              icon="clipboard"
              color={COLORS.warning}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <View style={styles.actionCard}>
              <View style={[styles.actionIconContainer, { backgroundColor: COLORS.secondary + '20' }]}>
                <Ionicons name="add-circle" size={24} color={COLORS.secondary} />
              </View>
              <Text style={styles.actionLabel}>Add Content</Text>
            </View>
            <View style={styles.actionCard}>
              <View style={[styles.actionIconContainer, { backgroundColor: COLORS.accent + '20' }]}>
                <Ionicons name="create" size={24} color={COLORS.accent} />
              </View>
              <Text style={styles.actionLabel}>Build Quiz</Text>
            </View>
            <View style={styles.actionCard}>
              <View style={[styles.actionIconContainer, { backgroundColor: COLORS.warning + '20' }]}>
                <Ionicons name="people-circle" size={24} color={COLORS.warning} />
              </View>
              <Text style={styles.actionLabel}>Students</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.secondary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: COLORS.secondary + '30',
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    marginTop: 4,
    marginLeft: 66,
  },
  headerDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 20,
    opacity: 0.5,
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActions: {
    marginBottom: 30,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.danger + '12',
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.danger + '30',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.danger,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default AdminDashboard;
