import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ApplicationTitleBanner from '@/components/common/ApplicationTitleBanner';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { getFormLastDate } from '@/utils/applicationDeadline';
import { pucFormat11GuidelinesSchema } from '@/forms/pucFormat11/validation';
import { useFormEngineStore } from '@/store/useFormEngineStore';

interface GuidelinesFormData {
  guidelinesAccepted: boolean;
}

export default function PucFormat11GuidelinesSection({ navigation }: any) {
  const { markStepComplete, updateValidationState } = useFormEngineStore();
  const [lastDate, setLastDate] = useState<string>('20 Dec 2026');

  useEffect(() => {
    let mounted = true;
    getFormLastDate('Diploma').then((date) => {
      if (mounted && date) setLastDate(date);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const { control, handleSubmit, formState } = useForm<GuidelinesFormData>({
    defaultValues: {
      guidelinesAccepted: false,
    },
    resolver: zodResolver(pucFormat11GuidelinesSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: GuidelinesFormData) => {
    updateValidationState('guidelines', { isValid: true, data });
    markStepComplete(0);
    navigation.navigate('personal');
  };

  const isNextDisabled = !formState.isValid;

  return (
    <FormScreenLayout
      title="Format 1.1 Guidelines"
      step={0}
      totalSteps={8}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit)}
      nextDisabled={isNextDisabled}
      nextLabel="Accept & Continue"
    >
      <ApplicationTitleBanner />

      {/* Website Note Banner */}
      <View style={styles.topNoticeBanner}>
        <Ionicons name="information-circle-outline" size={20} color="#0284c7" style={{ marginRight: 8, marginTop: 2 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.noticeHeading}>Note</Text>
          <Text style={styles.topNoticeText}>• Read all the instructions carefully before filling out the form</Text>
          <Text style={styles.topNoticeText}>• Fill in the form with accurate and relevant information</Text>
          <Text style={styles.topNoticeText}>• Please use the same contact number that was provided in the Vidya Poshak financial assistance application.</Text>
        </View>
      </View>

      {/* Instructions / Document Checklist */}
      <FormSectionHeader
        icon="document-text"
        title="Instructions"
        subtitle="Keep the following documents and information ready before filling out the form:"
      />

      <FormCard>
        <View style={styles.documentItem}>
          <Text style={styles.bulletNumber}>1.</Text>
          <Text style={styles.documentTitle}>Student's Selfie</Text>
        </View>
        <View style={styles.documentItem}>
          <Text style={styles.bulletNumber}>2.</Text>
          <Text style={styles.documentTitle}>SSLC Marks Card</Text>
        </View>
        <View style={styles.documentItem}>
          <Text style={styles.bulletNumber}>3.</Text>
          <Text style={styles.documentTitle}>College Fee Receipt(s)</Text>
        </View>
        <View style={styles.documentItem}>
          <Text style={styles.bulletNumber}>4.</Text>
          <Text style={styles.documentTitle}>Student's Bank Passbook (First Page)</Text>
        </View>
        <View style={styles.documentItem}>
          <Text style={styles.bulletNumber}>5.</Text>
          <Text style={styles.documentTitle}>Aadhaar Card</Text>
        </View>
      </FormCard>

      {/* Deadline & Contact */}
      <FormCard>
        <View style={styles.guidelineItem}>
          <Ionicons name="calendar" size={20} color={colors.warning} style={styles.icon} />
          <Text style={styles.guidelineText}>
            <Text style={styles.bold}>Last date to apply: {lastDate}</Text>
          </Text>
        </View>
        <View style={styles.guidelineItem}>
          <Ionicons name="call" size={20} color={colors.primary} style={styles.icon} />
          <Text style={styles.guidelineText}>
            If any queries, contact: <Text style={styles.bold}>0836-2747357</Text>
          </Text>
        </View>
      </FormCard>

      {/* Terms Acceptance */}
      <FormSectionHeader
        icon="shield-checkmark"
        title="Terms & Conditions"
        subtitle="Accept the terms to proceed"
      />

      <FormCard>
        <Controller
          control={control}
          name="guidelinesAccepted"
          render={({ field: { onChange, value } }) => (
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => onChange(!value)}
              activeOpacity={0.7}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: value }}
              accessibilityLabel="I have read and agree to the Terms & Conditions"
            >
              <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                {value && <Ionicons name="checkmark" size={16} color={colors.card} />}
              </View>
              <Text style={styles.checkboxLabel}>
                I have read and agree to the Terms & Conditions.
                <Text style={styles.required}> *</Text>
              </Text>
            </TouchableOpacity>
          )}
        />
        {formState.errors.guidelinesAccepted && (
          <Text style={styles.errorText}>
            {formState.errors.guidelinesAccepted.message}
          </Text>
        )}
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  topNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  noticeHeading: {
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '700',
    color: '#0369a1',
    marginBottom: 4,
  },
  topNoticeText: {
    fontSize: platform.normalize.fontSize.body,
    color: '#0369a1',
    lineHeight: 20,
    marginBottom: 2,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  bulletNumber: {
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '700',
    color: colors.primary,
    width: 24,
  },
  documentTitle: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  icon: {
    marginRight: spacing.sm,
  },
  guidelineText: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.textPrimary,
    flex: 1,
  },
  bold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.textPrimary,
    flex: 1,
  },
  required: {
    color: colors.error,
  },
  errorText: {
    fontSize: platform.normalize.fontSize.small,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
