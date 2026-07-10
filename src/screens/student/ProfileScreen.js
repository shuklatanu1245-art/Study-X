import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { getScoresByUser } from '../../services/scoreService';
import { COLORS } from '../../theme/colors';
import { SPACING, FONTS, BORDER_RADIUS } from '../../utils/constants';

export default function ProfileScreen() {
  const { user, userData, logout } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchScores = async () => {
        if (!user) return;
        try {
          const data = await getScoresByUser(user.uid);
          setScores(data);
        } catch (err) {
          console.error('Error fetching scores:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchScores();
    }, [user])
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {userData?.name ? userData.name.charAt(0).toUpperCase() : 'S'}
        </Text>
      </View>
      <Text style={styles.name}>{userData?.name || 'Student'}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <View style={styles.roleBadge}>
        <Text style={styles.roleText}>{userData?.role?.toUpperCase() || 'STUDENT'}</Text>
      </View>
      
      <Text style={styles.historyTitle}>Test History</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    const percentage = Math.round((item.score / item.totalQuestions) * 100);
    let color = COLORS.danger;
    if (percentage >= 70) color = COLORS.accent;
    else if (percentage >= 40) color = COLORS.warning;

    return (
      <View style={styles.scoreCard}>
        <View style={styles.scoreInfo}>
          <Text style={styles.quizIdText}>Quiz ID: {item.quizId.slice(0, 8)}...</Text>
          <Text style={styles.dateText}>
            {item.completedAt?.toDate ? item.completedAt.toDate().toLocaleDateString() : 'Recent'}
          </Text>
        </View>
        <View style={styles.scoreDetails}>
          <Text style={styles.scoreFraction}>{item.score}/{item.totalQuestions}</Text>
          <View style={[styles.percentageBadge, { backgroundColor: color }]}>
            <Text style={styles.percentageText}>{percentage}%</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>You haven't taken any tests yet.</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={scores}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
      />
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
  name: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  roleBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.xl,
  },
  roleText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: FONTS.weights.bold,
  },
  historyTitle: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    alignSelf: 'flex-start',
  },
  listContent: {
    padding: SPACING.lg,
  },
  scoreCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreInfo: {
    flex: 1,
  },
  quizIdText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.medium,
    fontSize: FONTS.sizes.body,
    marginBottom: 4,
  },
  dateText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  scoreDetails: {
    alignItems: 'flex-end',
  },
  scoreFraction: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.body,
    marginBottom: 4,
  },
  percentageBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  percentageText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
    fontSize: 12,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.body,
  },
  footer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  logoutButton: {
    backgroundColor: COLORS.danger,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
    fontSize: FONTS.sizes.body,
  }
});
