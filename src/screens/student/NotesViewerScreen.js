import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdBanner from '../../components/AdBanner';
import { COLORS } from '../../theme/colors';
import { SPACING, FONTS, BORDER_RADIUS } from '../../utils/constants';

export default function NotesViewerScreen({ route, navigation }) {
  const { title, contentText, pdfUrl } = route.params;

  useEffect(() => {
    navigation.setOptions({ title });
  }, [title, navigation]);

  const openPdf = async () => {
    if (pdfUrl) {
      try {
        const supported = await Linking.canOpenURL(pdfUrl);
        if (supported) {
          await Linking.openURL(pdfUrl);
        }
      } catch (err) {
        console.error('Error opening PDF:', err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{title}</Text>
        
        {contentText ? (
          <Text style={styles.content}>{contentText}</Text>
        ) : null}

        {pdfUrl ? (
          <View style={styles.pdfContainer}>
            <Ionicons name="document-text" size={48} color={COLORS.secondary} />
            <Text style={styles.pdfText}>This chapter includes a PDF document.</Text>
            <TouchableOpacity style={styles.pdfButton} onPress={openPdf}>
              <Text style={styles.pdfButtonText}>Open PDF in Browser</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  content: {
    fontSize: FONTS.sizes.body,
    lineHeight: 26,
    color: COLORS.text,
  },
  pdfContainer: {
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  pdfText: {
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  pdfButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  pdfButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
  }
});
