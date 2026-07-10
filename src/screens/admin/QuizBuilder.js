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
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { subjectService } from '../../services/subjectService';
import { quizService } from '../../services/quizService';
import LoadingSpinner from '../../components/LoadingSpinner';
import COLORS from '../../theme/colors';

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const createEmptyQuestion = () => ({
  localId: generateId(),
  questionText: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctOption: '',
});

const QuizBuilder = () => {
  // Subjects
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  // Quiz form state
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [questions, setQuestions] = useState([createEmptyQuestion()]);
  const [submitting, setSubmitting] = useState(false);

  // Feedback
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchSubjects = useCallback(async () => {
    try {
      const data = await subjectService.getSubjects();
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoadingSubjects(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoadingSubjects(true);
      fetchSubjects();
    }, [fetchSubjects])
  );

  const clearFeedback = () => {
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion()]);
  };

  const removeQuestion = (localId) => {
    if (questions.length <= 1) {
      Alert.alert('Cannot Remove', 'A quiz must have at least one question.');
      return;
    }
    setQuestions((prev) => prev.filter((q) => q.localId !== localId));
  };

  const updateQuestion = (localId, field, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.localId === localId ? { ...q, [field]: value } : q))
    );
  };

  const validateForm = () => {
    if (!selectedSubjectId) {
      return 'Please select a subject.';
    }
    if (!quizTitle.trim()) {
      return 'Quiz title is required.';
    }
    if (!durationMinutes.trim()) {
      return 'Duration is required.';
    }
    const duration = parseInt(durationMinutes.trim(), 10);
    if (isNaN(duration) || duration < 1) {
      return 'Duration must be a positive number.';
    }
    if (questions.length === 0) {
      return 'Add at least one question.';
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const num = i + 1;
      if (!q.questionText.trim()) {
        return `Question ${num}: Question text is required.`;
      }
      if (!q.optionA.trim()) {
        return `Question ${num}: Option A is required.`;
      }
      if (!q.optionB.trim()) {
        return `Question ${num}: Option B is required.`;
      }
      if (!q.optionC.trim()) {
        return `Question ${num}: Option C is required.`;
      }
      if (!q.optionD.trim()) {
        return `Question ${num}: Option D is required.`;
      }
      if (!q.correctOption) {
        return `Question ${num}: Please select the correct answer.`;
      }
    }

    return null;
  };

  const handleCreateQuiz = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFeedback({ type: 'error', message: validationError });
      clearFeedback();
      return;
    }

    setSubmitting(true);
    try {
      const duration = parseInt(durationMinutes.trim(), 10);
      const formattedQuestions = questions.map((q) => ({
        qId: generateId(),
        questionText: q.questionText.trim(),
        optionA: q.optionA.trim(),
        optionB: q.optionB.trim(),
        optionC: q.optionC.trim(),
        optionD: q.optionD.trim(),
        correctOption: q.correctOption,
      }));

      await quizService.addQuiz(
        selectedSubjectId,
        quizTitle.trim(),
        duration,
        formattedQuestions
      );

      // Clear form
      setQuizTitle('');
      setDurationMinutes('');
      setQuestions([createEmptyQuestion()]);
      setSelectedSubjectId(null);
      setFeedback({ type: 'success', message: 'Quiz created successfully!' });
      clearFeedback();
    } catch (error) {
      console.error('Error creating quiz:', error);
      setFeedback({ type: 'error', message: 'Failed to create quiz. Please try again.' });
      clearFeedback();
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingSubjects) {
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
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="construct" size={26} color={COLORS.warning} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Quiz Builder</Text>
            <Text style={styles.headerSubtitle}>Create engaging quizzes</Text>
          </View>
        </View>

        {/* Feedback */}
        {feedback.message ? (
          <View
            style={[
              styles.feedbackContainer,
              feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError,
            ]}
          >
            <Ionicons
              name={feedback.type === 'success' ? 'checkmark-circle' : 'alert-circle'}
              size={18}
              color={feedback.type === 'success' ? COLORS.accent : COLORS.danger}
            />
            <Text
              style={[
                styles.feedbackText,
                { color: feedback.type === 'success' ? COLORS.accent : COLORS.danger },
              ]}
            >
              {feedback.message}
            </Text>
          </View>
        ) : null}

        {/* Quiz Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: COLORS.secondary + '20' }]}>
              <Ionicons name="settings-outline" size={18} color={COLORS.secondary} />
            </View>
            <Text style={styles.sectionTitle}>Quiz Details</Text>
          </View>

          {/* Subject Picker */}
          <Text style={styles.inputLabel}>Subject</Text>
          {subjects.length === 0 ? (
            <View style={styles.emptyChips}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.textMuted} />
              <Text style={styles.emptyChipsText}>
                No subjects available. Add subjects in Content Manager.
              </Text>
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

          <Text style={styles.inputLabel}>Quiz Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter quiz title"
            placeholderTextColor={COLORS.textMuted}
            value={quizTitle}
            onChangeText={setQuizTitle}
          />

          <Text style={styles.inputLabel}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 30"
            placeholderTextColor={COLORS.textMuted}
            value={durationMinutes}
            onChangeText={setDurationMinutes}
            keyboardType="numeric"
          />
        </View>

        {/* Questions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: COLORS.accent + '20' }]}>
              <Ionicons name="help-circle-outline" size={18} color={COLORS.accent} />
            </View>
            <Text style={styles.sectionTitle}>Questions</Text>
            <View style={styles.questionCountBadge}>
              <Text style={styles.questionCountText}>{questions.length}</Text>
            </View>
          </View>

          {questions.map((question, index) => (
            <View key={question.localId} style={styles.questionBlock}>
              {/* Question Header */}
              <View style={styles.questionHeader}>
                <View style={styles.questionNumberContainer}>
                  <Text style={styles.questionNumber}>Q{index + 1}</Text>
                </View>
                <Text style={styles.questionHeaderTitle}>Question {index + 1}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeQuestion(question.localId)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>

              {/* Question Text */}
              <TextInput
                style={[styles.input, styles.questionInput]}
                placeholder="Enter question text"
                placeholderTextColor={COLORS.textMuted}
                value={question.questionText}
                onChangeText={(val) => updateQuestion(question.localId, 'questionText', val)}
                multiline
              />

              {/* Options */}
              <View style={styles.optionsGrid}>
                {['A', 'B', 'C', 'D'].map((letter) => {
                  const fieldKey = `option${letter}`;
                  return (
                    <View key={letter} style={styles.optionRow}>
                      <View
                        style={[
                          styles.optionLabel,
                          question.correctOption === letter && styles.optionLabelCorrect,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionLabelText,
                            question.correctOption === letter && styles.optionLabelTextCorrect,
                          ]}
                        >
                          {letter}
                        </Text>
                      </View>
                      <TextInput
                        style={[styles.input, styles.optionInput]}
                        placeholder={`Option ${letter}`}
                        placeholderTextColor={COLORS.textMuted}
                        value={question[fieldKey]}
                        onChangeText={(val) => updateQuestion(question.localId, fieldKey, val)}
                      />
                    </View>
                  );
                })}
              </View>

              {/* Correct Answer Picker */}
              <Text style={styles.correctAnswerLabel}>Correct Answer</Text>
              <View style={styles.correctAnswerRow}>
                {['A', 'B', 'C', 'D'].map((letter) => (
                  <TouchableOpacity
                    key={letter}
                    style={[
                      styles.correctAnswerButton,
                      question.correctOption === letter && styles.correctAnswerSelected,
                    ]}
                    onPress={() => updateQuestion(question.localId, 'correctOption', letter)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.correctAnswerText,
                        question.correctOption === letter && styles.correctAnswerTextSelected,
                      ]}
                    >
                      {letter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Add Question Button */}
          <TouchableOpacity
            style={styles.addQuestionButton}
            onPress={addQuestion}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={22} color={COLORS.secondary} />
            <Text style={styles.addQuestionText}>Add Question</Text>
          </TouchableOpacity>
        </View>

        {/* Create Quiz Button */}
        <TouchableOpacity
          style={[styles.createButton, submitting && styles.buttonDisabled]}
          onPress={handleCreateQuiz}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.text} size="small" />
          ) : (
            <>
              <Ionicons name="rocket" size={20} color={COLORS.text} />
              <Text style={styles.createButtonText}>Create Quiz</Text>
            </>
          )}
        </TouchableOpacity>

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
    marginBottom: 24,
    gap: 14,
  },
  headerIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.warning + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.warning + '30',
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
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
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
  questionCountBadge: {
    backgroundColor: COLORS.accent + '25',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionCountText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accent,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 4,
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
    flex: 1,
  },
  questionBlock: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  questionNumberContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.secondary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  questionHeaderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.danger + '12',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.danger + '25',
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.danger,
  },
  questionInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  optionsGrid: {
    gap: 0,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionLabel: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  optionLabelCorrect: {
    backgroundColor: COLORS.accent + '25',
    borderColor: COLORS.accent,
  },
  optionLabelText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  optionLabelTextCorrect: {
    color: COLORS.accent,
  },
  optionInput: {
    flex: 1,
  },
  correctAnswerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  correctAnswerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  correctAnswerButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  correctAnswerSelected: {
    backgroundColor: COLORS.accent + '20',
    borderColor: COLORS.accent,
  },
  correctAnswerText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  correctAnswerTextSelected: {
    color: COLORS.accent,
  },
  addQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.secondary + '40',
    borderStyle: 'dashed',
    backgroundColor: COLORS.secondary + '08',
  },
  addQuestionText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  createButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  bottomSpacer: {
    height: 30,
  },
});

export default QuizBuilder;
