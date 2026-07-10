import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getChaptersBySubject } from '../../services/chapterService';
import ChapterCard from '../../components/ChapterCard';
import { COLORS } from '../../theme/colors';
import { SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../../utils/constants';

export default function ChaptersScreen({ route, navigation }) {
  const { subjectId, subjectTitle } = route.params;
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: subjectTitle });
    
    const fetchChapters = async () => {
      try {
        const data = await getChaptersBySubject(subjectId);
        setChapters(data);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChapters();
  }, [subjectId, subjectTitle, navigation]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No chapters available for this subject yet.</Text>
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
        data={chapters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChapterCard
            title={item.title}
            order={item.order}
            hasContent={!!item.contentText}
            hasPdf={!!item.pdfUrl}
            onPress={() => navigation.navigate('NotesViewer', {
              title: item.title,
              contentText: item.contentText,
              pdfUrl: item.pdfUrl,
            })}
          />
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
      />
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('QuizList', { subjectId, subjectTitle })}
      >
        <Ionicons name="clipboard" size={24} color={COLORS.white} />
        <Text style={styles.fabText}>Take Quiz</Text>
      </TouchableOpacity>
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
    paddingBottom: 100, // Make room for FAB
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
  fab: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.md,
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.elevated,
  },
  fabText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
    marginLeft: SPACING.xs,
  }
});
