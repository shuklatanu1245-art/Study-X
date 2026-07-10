import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { scoreService } from '../../services/scoreService';
import LoadingSpinner from '../../components/LoadingSpinner';
import COLORS from '../../theme/colors';

const StudentManager = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentScores, setStudentScores] = useState([]);
  const [loadingScores, setLoadingScores] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      const studentsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'student')
      );
      const snapshot = await getDocs(studentsQuery);
      const studentsList = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsList);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchStudents();
    }, [fetchStudents])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStudents();
  }, [fetchStudents]);

  const handleStudentPress = async (student) => {
    setSelectedStudent(student);
    setModalVisible(true);
    setLoadingScores(true);
    setStudentScores([]);

    try {
      const scores = await scoreService.getScoresByUser(student.uid);
      setStudentScores(scores || []);
    } catch (error) {
      console.error('Error fetching student scores:', error);
    } finally {
      setLoadingScores(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedStudent(null);
    setStudentScores([]);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (index) => {
    const colors = [
      COLORS.secondary,
      COLORS.accent,
      COLORS.warning,
      '#E040FB',
      '#FF5252',
      '#448AFF',
      '#69F0AE',
    ];
    return colors[index % colors.length];
  };

  const renderStudentCard = ({ item, index }) => {
    const avatarColor = getAvatarColor(index);

    return (
      <TouchableOpacity
        style={styles.studentCard}
        onPress={() => handleStudentPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.avatar, { backgroundColor: avatarColor + '20' }]}>
          <Text style={[styles.avatarText, { color: avatarColor }]}>
            {getInitials(item.name)}
          </Text>
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName} numberOfLines={1}>
            {item.name || 'Unknown Student'}
          </Text>
          <Text style={styles.studentEmail} numberOfLines={1}>
            {item.email || 'No email'}
          </Text>
          <View style={styles.joinedRow}>
            <Ionicons name="calendar-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.joinedText}>
              Joined {formatDate(item.createdAt)}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="people-outline" size={56} color={COLORS.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No Students Yet</Text>
      <Text style={styles.emptyText}>
        Students will appear here once they register on the platform.
      </Text>
    </View>
  );

  const renderScoreItem = (score, index) => {
    const percentage =
      score.totalQuestions && score.totalQuestions > 0
        ? Math.round((score.score / score.totalQuestions) * 100)
        : 0;

    let percentageColor = COLORS.danger;
    if (percentage >= 80) percentageColor = COLORS.accent;
    else if (percentage >= 60) percentageColor = COLORS.warning;
    else if (percentage >= 40) percentageColor = COLORS.secondaryLight;

    return (
      <View key={score.id || index} style={styles.scoreCard}>
        <View style={styles.scoreHeader}>
          <View style={styles.scoreQuizInfo}>
            <Ionicons name="clipboard-outline" size={16} color={COLORS.secondary} />
            <Text style={styles.scoreQuizId} numberOfLines={1}>
              {score.quizTitle || score.quizId || 'Quiz'}
            </Text>
          </View>
          <View style={[styles.percentageBadge, { backgroundColor: percentageColor + '20' }]}>
            <Text style={[styles.percentageText, { color: percentageColor }]}>
              {percentage}%
            </Text>
          </View>
        </View>
        <View style={styles.scoreDetails}>
          <View style={styles.scoreDetailItem}>
            <Text style={styles.scoreDetailLabel}>Score</Text>
            <Text style={styles.scoreDetailValue}>
              {score.score}/{score.totalQuestions}
            </Text>
          </View>
          <View style={styles.scoreDetailDivider} />
          <View style={styles.scoreDetailItem}>
            <Text style={styles.scoreDetailLabel}>Date</Text>
            <Text style={styles.scoreDetailValue}>
              {formatDateTime(score.completedAt || score.createdAt)}
            </Text>
          </View>
        </View>
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${percentage}%`,
                backgroundColor: percentageColor,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="school" size={24} color={COLORS.accent} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Students</Text>
            <Text style={styles.headerSubtitle}>
              {students.length} registered student{students.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>

      {/* Student List */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.uid}
        renderItem={renderStudentCard}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={[
          styles.listContent,
          students.length === 0 && styles.listContentEmpty,
        ]}
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
      />

      {/* Student Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Handle */}
            <View style={styles.modalHandle} />

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={[styles.modalAvatar, { backgroundColor: COLORS.secondary + '20' }]}>
                  <Text style={[styles.modalAvatarText, { color: COLORS.secondary }]}>
                    {selectedStudent ? getInitials(selectedStudent.name) : '??'}
                  </Text>
                </View>
                <View style={styles.modalHeaderInfo}>
                  <Text style={styles.modalName} numberOfLines={1}>
                    {selectedStudent?.name || 'Unknown Student'}
                  </Text>
                  <Text style={styles.modalEmail} numberOfLines={1}>
                    {selectedStudent?.email || 'No email'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModal}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalDivider} />

            {/* Test History */}
            <Text style={styles.modalSectionTitle}>
              <Ionicons name="stats-chart" size={16} color={COLORS.warning} />
              {'  '}Test History
            </Text>

            <ScrollView
              style={styles.scoresScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scoresContent}
            >
              {loadingScores ? (
                <View style={styles.loadingScores}>
                  <ActivityIndicator size="large" color={COLORS.secondary} />
                  <Text style={styles.loadingScoresText}>Loading scores...</Text>
                </View>
              ) : studentScores.length === 0 ? (
                <View style={styles.emptyScores}>
                  <Ionicons name="document-text-outline" size={44} color={COLORS.textMuted} />
                  <Text style={styles.emptyScoresTitle}>No Test History</Text>
                  <Text style={styles.emptyScoresText}>
                    This student hasn't taken any quizzes yet.
                  </Text>
                </View>
              ) : (
                studentScores.map((score, index) => renderScoreItem(score, index))
              )}
            </ScrollView>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeModal}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.accent + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent + '30',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  listContentEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  studentEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  joinedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  joinedText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 34,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textMuted,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  modalAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAvatarText: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalHeaderInfo: {
    flex: 1,
  },
  modalName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 18,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 14,
  },
  scoresScroll: {
    flex: 1,
  },
  scoresContent: {
    paddingBottom: 10,
  },
  scoreCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scoreQuizInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  scoreQuizId: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  percentageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '800',
  },
  scoreDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreDetailItem: {
    flex: 1,
  },
  scoreDetailLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  scoreDetailDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: COLORS.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  loadingScores: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingScoresText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  emptyScores: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 8,
  },
  emptyScoresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  emptyScoresText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  modalCloseButton: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
});

export default StudentManager;
