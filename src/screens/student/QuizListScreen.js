import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { getQuizzesBySubject } from '../../services/quizService';
import QuizCard from '../../components/QuizCard';
import { COLORS } from '../../theme/colors';
import { SPACING, FONTS } from '../../utils/constants';

export default function QuizListScreen({ route, navigation }) {
  const { subjectId, subjectTitle } = route.params;
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: `${subjectTitle} Quizzes` });
    
    const fetchQuizzes = async () => {
      try {
        const data = await getQuizzesBySubject(subjectId);
        setQuizzes(data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizzes();
  }, [subjectId, subjectTitle, navigation]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No quizzes available for this subject yet.</Text>
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
        data={quizzes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuizCard
            title={item.title}
            questionCount={item.questions ? item.questions.length : 0}
            duration={item.durationMinutes}
            onPress={() => navigation.navigate('Quiz', {
              quizId: item.id,
              title: item.title,
              durationMinutes: item.durationMinutes,
              questions: item.questions,
            })}
          />
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
      />
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
  listContent: {
    padding: SPACING.md,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.body,
    textAlign: 'center',
  },
});
