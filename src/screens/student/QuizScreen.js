import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { submitScore } from '../../services/scoreService';
import OptionCard from '../../components/OptionCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { loadAndShowInterstitial } from '../../utils/adUtils';
import { COLORS } from '../../theme/colors';
import { SPACING, FONTS, BORDER_RADIUS } from '../../utils/constants';

export default function QuizScreen({ route, navigation }) {
  const { quizId, title, durationMinutes, questions = [] } = route.params;
  const { user } = useAuth();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  // Prevent back navigation
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
      title: 'Quiz in Progress',
    });

    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit? Your progress will be lost.', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => navigation.goBack() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  // Timer logic
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true); // Auto-submit when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleSelectOption = (qId, optionKey) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: optionKey
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async (auto = false) => {
    if (submitting) return;
    
    if (!auto && Object.keys(selectedAnswers).length < totalQuestions) {
      Alert.alert(
        'Incomplete',
        'You have not answered all questions. Are you sure you want to submit?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit', onPress: () => processSubmission() }
        ]
      );
    } else {
      processSubmission();
    }
  };

  const processSubmission = async () => {
    setSubmitting(true);
    clearInterval(timerRef.current);
    
    let score = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.qId] === q.correctOption) {
        score += 1;
      }
    });

    try {
      if (user) {
        await submitScore(user.uid, quizId, score, totalQuestions);
      }
      
      // Try to show ad, but continue if it fails
      try {
        await loadAndShowInterstitial();
      } catch (adError) {
        console.log('Ad failed to load/show, proceeding to results', adError);
      }
      
      navigation.replace('Results', {
        score,
        totalQuestions,
        quizTitle: title
      });
    } catch (error) {
      console.error('Error submitting score:', error);
      Alert.alert('Error', 'Failed to submit score. Please try again.');
      setSubmitting(false);
    }
  };

  if (!currentQuestion) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No questions found for this quiz.</Text>
        <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
          <Text style={styles.exitButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (submitting) {
    return <LoadingSpinner message="Submitting your answers..." />;
  }

  const isTimeRunningOut = timeRemaining < 60;

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.questionCounter}>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </Text>
        <Text style={[styles.timer, isTimeRunningOut && styles.timerDanger]}>
          {formatTime(timeRemaining)}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
        
        <View style={styles.optionsContainer}>
          {['A', 'B', 'C', 'D'].map(letter => {
            const optionKey = `option${letter}`;
            const isSelected = selectedAnswers[currentQuestion.qId] === letter;
            
            return (
              <OptionCard
                key={letter}
                label={letter}
                text={currentQuestion[optionKey]}
                selected={isSelected}
                onPress={() => handleSelectOption(currentQuestion.qId, letter)}
                showResult={false}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrev}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        
        {currentQuestionIndex === totalQuestions - 1 ? (
          <TouchableOpacity
            style={[styles.navButton, styles.submitButton]}
            onPress={() => handleSubmit()}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        )}
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
    padding: SPACING.xl,
  },
  errorText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.body,
    marginBottom: SPACING.md,
  },
  exitButton: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  exitButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  questionCounter: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.bold,
  },
  timer: {
    color: COLORS.white,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.bold,
  },
  timerDanger: {
    color: COLORS.danger,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: COLORS.surfaceLight,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.secondary,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  questionText: {
    fontSize: FONTS.sizes.h3,
    color: COLORS.white,
    fontWeight: FONTS.weights.medium,
    lineHeight: 28,
    marginBottom: SPACING.xl,
  },
  optionsContainer: {
    gap: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    justifyContent: 'space-between',
  },
  navButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
  },
  nextButton: {
    backgroundColor: COLORS.secondary,
  },
  nextButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
  },
  submitButton: {
    backgroundColor: COLORS.accent,
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
  }
});
