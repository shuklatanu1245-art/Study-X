import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { subjectService } from '../../services/subjectService';
import { chapterService } from '../../services/chapterService';
import LoadingSpinner from '../../components/LoadingSpinner';
import COLORS from '../../theme/colors';

const ContentManager = () => {
  // Subject form state
  const [subjectTitle, setSubjectTitle] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [addingSubject, setAddingSubject] = useState(false);

  // Chapter form state
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [chapterTitle, setChapterTitle] = useState('');
  const [contentText, setContentText] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [addingChapter, setAddingChapter] = useState(false);

  // Data state
  const [subjects, setSubjects] = useState([]);
  const [subjectChapters, setSubjectChapters] = useState({});
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Feedback state
  const [subjectFeedback, setSubjectFeedback] = useState({ type: '', message: '' });
  const [chapterFeedback, setChapterFeedback] = useState({ type: '', message: '' });

  const fetchSubjects = useCallback(async () => {
    try {
      const data = await subjectService.getSubjects();
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchSubjects();
    }, [fetchSubjects])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSubjects();
  }, [fetchSubjects]);

  const fetchChaptersForSubject = async (subjectId) => {
    try {
      const chapters = await chapterService.getChaptersBySubject(subjectId);
      setSubjectChapters((prev) => ({
        ...prev,
        [subjectId]: chapters || [],
      }));
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const toggleExpandSubject = (subjectId) => {
    if (expandedSubject === subjectId) {
      setExpandedSubject(null);
    } else {
      setExpandedSubject(subjectId);
      if (!subjectChapters[subjectId]) {
        fetchChaptersForSubject(subjectId);
      }
    }
  };

  const clearSubjectFeedback = () => {
    setTimeout(() => setSubjectFeedback({ type: '', message: '' }), 3000);
  };

  const clearChapterFeedback = () => {
    setTimeout(() => setChapterFeedback({ type: '', message: '' }), 3000);
  };

  const handleAddSubject = async () => {
    if (!subjectTitle.trim()) {
      setSubjectFeedback({ type: 'error', message: 'Subject title is required.' });
      clearSubjectFeedback();
      return;
    }
    if (!classLevel.trim()) {
      setSubjectFeedback({ type: 'error', message: 'Class level is required.' });
      clearSubjectFeedback();
      return;
    }

    setAddingSubject(true);
    try {
      await subjectService.addSubject(subjectTitle.trim(), classLevel.trim());
      setSubjectTitle('');
      setClassLevel('');
      setSubjectFeedback({ type: 'success', message: 'Subject added successfully!' });
      clearSubjectFeedback();
      fetchSubjects();
    } catch (error) {
      console.error('Error adding subject:', error);
      setSubjectFeedback({ type: 'error', message: 'Failed to add subject. Please try again.' });
      clearSubjectFeedback();
    } finally {
      setAddingSubject(false);
    }
  };

  const handleAddChapter = async () => {
    if (!selectedSubjectId) {
      setChapterFeedback({ type: 'error', message: 'Please select a subject.' });
      clearChapterFeedback();
      return;
    }
    if (!chapterTitle.trim()) {
      setChapterFeedback({ type: 'error', message: 'Chapter title is required.' });
      clearChapterFeedback();
      return;
    }
    if (!contentText.trim()) {
      setChapterFeedback({ type: 'error', message: 'Content text is required.' });
      clearChapterFeedback();
      return;
    }

    const order = orderNumber.trim() ? parseInt(orderNumber.trim(), 10) : 1;
    if (isNaN(order) || order < 1) {
      setChapterFeedback({ type: 'error', message: 'Order must be a positive number.' });
      clearChapterFeedback();
      return;
    }

    setAddingChapter(true);
    try {
      await chapterService.addChapter(
        selectedSubjectId,
        chapterTitle.trim(),
        contentText.trim(),
        pdfUrl.trim() || null,
        order
      );
      setChapterTitle('');
      setContentText('');
      setPdfUrl('');
      setOrderNumber('');
      setChapterFeedback({ type: 'success', message: 'Chapter added successfully!' });
      clearChapterFeedback();
      // Refresh chapters for the selected subject
      fetchChaptersForSubject(selectedSubjectId);
    } catch (error) {
      console.error('Error adding chapter:', error);
      setChapterFeedback({ type: 'error', message: 'Failed to add chapter. Please try again.' });
      clearChapterFeedback();
    } finally {
      setAddingChapter(false);
    }
  };

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
          <Ionicons name="library" size={28} color={COLORS.secondary} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Content Manager</Text>
            <Text style={styles.headerSubtitle}>Add subjects and chapters</Text>
          </View>
        </View>

        {/* Section 1: Add Subject */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: COLORS.secondary + '20' }]}>
              <Ionicons name="book-outline" size={18} color={COLORS.secondary} />
            </View>
            <Text style={styles.sectionTitle}>Add Subject</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Subject Title"
            placeholderTextColor={COLORS.textMuted}
            value={subjectTitle}
            onChangeText={setSubjectTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Class Level (e.g., Class 10, Class 12)"
            placeholderTextColor={COLORS.textMuted}
            value={classLevel}
            onChangeText={setClassLevel}
          />

          {subjectFeedback.message ? (
            <View
              style={[
                styles.feedbackContainer,
                subjectFeedback.type === 'success'
                  ? styles.feedbackSuccess
                  : styles.feedbackError,
              ]}
            >
              <Ionicons
                name={subjectFeedback.type === 'success' ? 'checkmark-circle' : 'alert-circle'}
                size={16}
                color={subjectFeedback.type === 'success' ? COLORS.accent : COLORS.danger}
              />
              <Text
                style={[
                  styles.feedbackText,
                  {
                    color:
                      subjectFeedback.type === 'success' ? COLORS.accent : COLORS.danger,
                  },
                ]}
              >
                {subjectFeedback.message}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.submitButton, addingSubject && styles.buttonDisabled]}
            onPress={handleAddSubject}
            disabled={addingSubject}
            activeOpacity={0.8}
          >
            {addingSubject ? (
              <ActivityIndicator color={COLORS.text} size="small" />
            ) : (
              <>
                <Ionicons name="add-circle" size={20} color={COLORS.text} />
                <Text style={styles.submitButtonText}>Add Subject</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Section 2: Add Chapter */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: COLORS.accent + '20' }]}>
              <Ionicons name="document-text-outline" size={18} color={COLORS.accent} />
            </View>
            <Text style={styles.sectionTitle}>Add Chapter</Text>
          </View>

          {/* Subject Picker Chips */}
          <Text style={styles.pickerLabel}>Select Subject</Text>
          {subjects.length === 0 ? (
            <View style={styles.emptyChips}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.textMuted} />
              <Text style={styles.emptyChipsText}>No subjects available. Add a subject first.</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsScroll}
              contentContainerStyle={styles.chipsContent}
            >
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.chip,
                    selectedSubjectId === subject.id && styles.chipSelected,
                  ]}
                  onPress={() => setSelectedSubjectId(subject.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedSubjectId === subject.id && styles.chipTextSelected,
                    ]}
                  >
                    {subject.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <TextInput
            style={styles.input}
            placeholder="Chapter Title"
            placeholderTextColor={COLORS.textMuted}
            value={chapterTitle}
            onChangeText={setChapterTitle}
          />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Content Text"
            placeholderTextColor={COLORS.textMuted}
            value={contentText}
            onChangeText={setContentText}
            multiline
            textAlignVertical="top"
          />
          <TextInput
            style={styles.input}
            placeholder="PDF URL (optional)"
            placeholderTextColor={COLORS.textMuted}
            value={pdfUrl}
            onChangeText={setPdfUrl}
            autoCapitalize="none"
            keyboardType="url"
          />
          <TextInput
            style={styles.input}
            placeholder="Order Number"
            placeholderTextColor={COLORS.textMuted}
            value={orderNumber}
            onChangeText={setOrderNumber}
            keyboardType="numeric"
          />

          {chapterFeedback.message ? (
            <View
              style={[
                styles.feedbackContainer,
                chapterFeedback.type === 'success'
                  ? styles.feedbackSuccess
                  : styles.feedbackError,
              ]}
            >
              <Ionicons
                name={chapterFeedback.type === 'success' ? 'checkmark-circle' : 'alert-circle'}
                size={16}
                color={chapterFeedback.type === 'success' ? COLORS.accent : COLORS.danger}
              />
              <Text
                style={[
                  styles.feedbackText,
                  {
                    color:
                      chapterFeedback.type === 'success' ? COLORS.accent : COLORS.danger,
                  },
                ]}
              >
                {chapterFeedback.message}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.submitButton, styles.accentButton, addingChapter && styles.buttonDisabled]}
            onPress={handleAddChapter}
            disabled={addingChapter}
            activeOpacity={0.8}
          >
            {addingChapter ? (
              <ActivityIndicator color={COLORS.text} size="small" />
            ) : (
              <>
                <Ionicons name="add-circle" size={20} color={COLORS.text} />
                <Text style={styles.submitButtonText}>Add Chapter</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Existing Content */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: COLORS.warning + '20' }]}>
              <Ionicons name="folder-open-outline" size={18} color={COLORS.warning} />
            </View>
            <Text style={styles.sectionTitle}>Existing Content</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{subjects.length}</Text>
            </View>
          </View>

          {subjects.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyStateTitle}>No Subjects Yet</Text>
              <Text style={styles.emptyStateText}>
                Add your first subject using the form above.
              </Text>
            </View>
          ) : (
            subjects.map((subject) => {
              const isExpanded = expandedSubject === subject.id;
              const chapters = subjectChapters[subject.id] || [];

              return (
                <TouchableOpacity
                  key={subject.id}
                  style={[styles.contentCard, isExpanded && styles.contentCardExpanded]}
                  onPress={() => toggleExpandSubject(subject.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.contentCardHeader}>
                    <View style={styles.contentCardLeft}>
                      <View style={styles.subjectIconContainer}>
                        <Ionicons name="book" size={18} color={COLORS.secondary} />
                      </View>
                      <View style={styles.contentCardInfo}>
                        <Text style={styles.contentCardTitle}>{subject.title}</Text>
                        <Text style={styles.contentCardMeta}>
                          {subject.classLevel || 'No class level'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.contentCardRight}>
                      {chapters.length > 0 && (
                        <View style={styles.chapterCountBadge}>
                          <Text style={styles.chapterCountText}>
                            {chapters.length} ch.
                          </Text>
                        </View>
                      )}
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={COLORS.textMuted}
                      />
                    </View>
                  </View>

                  {isExpanded && (
                    <View style={styles.chaptersContainer}>
                      <View style={styles.chaptersDivider} />
                      {chapters.length === 0 ? (
                        <Text style={styles.noChaptersText}>
                          No chapters added yet.
                        </Text>
                      ) : (
                        chapters.map((chapter, index) => (
                          <View key={chapter.id || index} style={styles.chapterItem}>
                            <View style={styles.chapterOrder}>
                              <Text style={styles.chapterOrderText}>
                                {chapter.order || index + 1}
                              </Text>
                            </View>
                            <View style={styles.chapterInfo}>
                              <Text style={styles.chapterItemTitle}>
                                {chapter.title}
                              </Text>
                              {chapter.pdfUrl ? (
                                <View style={styles.pdfBadge}>
                                  <Ionicons
                                    name="document-attach"
                                    size={12}
                                    color={COLORS.accent}
                                  />
                                  <Text style={styles.pdfBadgeText}>PDF</Text>
                                </View>
                              ) : null}
                            </View>
                          </View>
                        ))
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    gap: 14,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 10,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  countBadge: {
    backgroundColor: COLORS.warning + '25',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.warning,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    color: COLORS.text,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  multilineInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  chipsScroll: {
    marginBottom: 14,
  },
  chipsContent: {
    gap: 8,
    paddingRight: 4,
  },
  chip: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondaryLight,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.text,
    fontWeight: '600',
  },
  emptyChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  emptyChipsText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  feedbackSuccess: {
    backgroundColor: COLORS.accent + '15',
    borderWidth: 1,
    borderColor: COLORS.accent + '30',
  },
  feedbackError: {
    backgroundColor: COLORS.danger + '15',
    borderWidth: 1,
    borderColor: COLORS.danger + '30',
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  submitButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  accentButton: {
    backgroundColor: COLORS.accent,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 8,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  contentCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contentCardExpanded: {
    borderColor: COLORS.secondary + '50',
  },
  contentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  subjectIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.secondary + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCardInfo: {
    flex: 1,
  },
  contentCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  contentCardMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  contentCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chapterCountBadge: {
    backgroundColor: COLORS.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  chapterCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.accent,
  },
  chaptersContainer: {
    marginTop: 12,
  },
  chaptersDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 12,
  },
  noChaptersText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  chapterOrder: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterOrderText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  chapterInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chapterItemTitle: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  pdfBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accent + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pdfBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.accent,
  },
  bottomSpacer: {
    height: 30,
  },
});

export default ContentManager;
