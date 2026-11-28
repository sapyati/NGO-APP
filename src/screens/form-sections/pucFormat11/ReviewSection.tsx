import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getPucFormat11Dropdowns } from '@/api/pucFormat11Api';
import { NormalizedDropdownOption } from '@/api/transformers/normalizeDropdowns';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { preparePayload, submitApplication } from '@/submission';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { confirmNoDuplicate, getContactNumber } from '@/utils/duplicateCheck';
import { useFormEngineStore } from '@/store/useFormEngineStore';

const labelFor = (options: NormalizedDropdownOption[] | undefined, value: number | undefined | null): string => {
  if (value === undefined || value === null || value === 0) return 'N/A';
  const found = options?.find((o) => Number(o.value) === Number(value));
  return found ? found.label : `ID ${value}`;
};

export default function PucFormat11ReviewSection({ navigation }: any) {
  const {
    formData,
    markStepComplete,
    updateValidationState,
    submissionState,
    setSubmissionLoading,
    setSubmissionSuccess,
    setSubmissionError,
  } = useFormEngineStore();

  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const submitLock = useRef(false);

  const [dropdowns, setDropdowns] = useState<{
    genders: NormalizedDropdownOption[];
    castes: NormalizedDropdownOption[];
    areas: NormalizedDropdownOption[];
    districts: NormalizedDropdownOption[];
    courses: NormalizedDropdownOption[];
    collegeTypes: NormalizedDropdownOption[];
    fatherOccupations: NormalizedDropdownOption[];
    motherOccupations: NormalizedDropdownOption[];
  }>({
    genders: [],
    castes: [],
    areas: [],
    districts: [],
    courses: [],
    collegeTypes: [],
    fatherOccupations: [],
    motherOccupations: [],
  });

  useEffect(() => {
    let mounted = true;
    async function loadDropdowns() {
      const response = await getPucFormat11Dropdowns();
      if (mounted && response.success && response.data) {
        setDropdowns({
          genders: response.data.genders ?? [],
          castes: response.data.castes ?? [],
          areas: response.data.places ?? [],
          districts: response.data.districts ?? [],
          courses: response.data.courses ?? [],
          collegeTypes: response.data.collegeTypes ?? [],
          fatherOccupations: response.data.fatherOcc ?? [],
          motherOccupations: response.data.motherOcc ?? [],
        });
      }
    }
    loadDropdowns();
    return () => {
      mounted = false;
    };
  }, []);

  const personal = (formData as any)?.personal || {};
  const address = (formData as any)?.address || {};
  const family = (formData as any)?.family || {};
  const academic = (formData as any)?.academic || {};
  const bank = (formData as any)?.bank || {};
  const documents = (formData as any)?.documents || {};

  const canSubmit = declarationAccepted;

  const onSubmit = async () => {
    if (submitLock.current) return;
    submitLock.current = true;

    updateValidationState('review', { isValid: true, data: { declarationAccepted } });
    setSubmissionLoading(true);

    try {
      const proceed = await confirmNoDuplicate(
        'pucFormat11',
        getContactNumber('pucFormat11', formData) || personal.ContactNumber
      );
      if (!proceed) {
        setSubmissionLoading(false);
        submitLock.current = false;
        return;
      }

      const payload = preparePayload('pucFormat11', formData);
      const response = await submitApplication('pucFormat11', payload);

      if (!response.success) {
        throw new Error(response.error || response.message);
      }

      setSubmissionSuccess(true, response.data?.applicationId || undefined);
      markStepComplete(7);
      navigation.navigate('success');
    } catch (error: any) {
      setSubmissionLoading(false);
      setSubmissionError(error?.message || 'Failed to submit application. Please try again.');
      submitLock.current = false;
    }
  };

  const renderField = (label: string, value: string | number | undefined | null) => (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value !== undefined && value !== null && value !== '' ? String(value) : '—'}</Text>
    </View>
  );

  return (
    <FormScreenLayout
      title="Review Application"
      step={7}
      totalSteps={8}
      onBack={navigation.goBack}
      onNext={onSubmit}
      nextDisabled={!canSubmit || submissionState.isSubmitting}
      nextLabel={submissionState.isSubmitting ? 'Submitting...' : 'Submit Application'}
    >
      <FormSectionHeader
        icon="checkmark-done-circle"
        title="Application Summary"
        subtitle="Please verify all details before submitting"
      />

      {/* Submission Error Banner */}
      {submissionState.error && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={20} color={colors.error} style={{ marginRight: 8 }} />
          <Text style={styles.errorBannerText}>{submissionState.error}</Text>
        </View>
      )}

      {/* Personal Info */}
      <FormCard>
        <Text style={styles.cardHeader}>Personal & Contact Details</Text>
        {renderField('Email', personal.Email)}
        {renderField('Student Name', personal.StudentName)}
        {renderField('WhatsApp Number', personal.ContactNumber)}
        {renderField('Alternate Number', personal.AlternateNumber)}
        {renderField('Gender', labelFor(dropdowns.genders, personal.Gender))}
        {renderField('Date of Birth', personal.DateOfBirth)}
        {renderField('Caste', labelFor(dropdowns.castes, personal.Caste))}
        {renderField('Place (Area)', labelFor(dropdowns.areas, personal.Place))}
      </FormCard>

      {/* Address */}
      <FormCard>
        <Text style={styles.cardHeader}>Address Details</Text>
        {renderField('District', labelFor(dropdowns.districts, address.District))}
        {address.OtherDistrict ? renderField('Other District', address.OtherDistrict) : null}
        {renderField('Taluk', address.Taluk)}
        {renderField('Residential Address', address.ResidentialAddress)}
        {renderField('Pin Code', address.PinCode)}
      </FormCard>

      {/* Family */}
      <FormCard>
        <Text style={styles.cardHeader}>Family & Financial Details</Text>
        {renderField("Father's Occupation", labelFor(dropdowns.fatherOccupations, family.FatherOccupation))}
        {renderField("Mother's Occupation", labelFor(dropdowns.motherOccupations, family.MotherOccupation))}
        {renderField('Total Family Members', family.TotalFamilyMembers)}
        {renderField('Family Annual Income', family.FamilyAnnualIncome ? `₹${family.FamilyAnnualIncome}` : '—')}
        {renderField("Parents' Bank Balance", family.ParentsBankBalance !== undefined ? `₹${family.ParentsBankBalance}` : '—')}
      </FormCard>

      {/* Academic */}
      <FormCard>
        <Text style={styles.cardHeader}>Academic Details</Text>
        {renderField('SSLC Percentage', academic.SSLCPercentage ? `${academic.SSLCPercentage}%` : '—')}
        {renderField('Course Joined', labelFor(dropdowns.courses, academic.CourseJoined))}
        {renderField('College Name', academic.CollegeName)}
        {renderField('College Type', labelFor(dropdowns.collegeTypes, academic.CollegeType))}
        {renderField('College Fees', academic.CollegeFees ? `₹${academic.CollegeFees}` : '—')}
        {renderField('College Contact Number', academic.CollegeContactNumber)}
        {academic.Achievement ? renderField('Achievement', academic.Achievement) : null}
      </FormCard>

      {/* Bank */}
      <FormCard>
        <Text style={styles.cardHeader}>Student Bank Details</Text>
        {renderField('Account Holder Name', bank.AccountHolderName)}
        {renderField('Account Number', bank.AccountNumber)}
        {renderField('IFSC Code', bank.IFSCCode)}
        {renderField('Bank Name', bank.BankName)}
        {renderField('Branch Name', bank.BranchName)}
      </FormCard>

      {/* Documents */}
      <FormCard>
        <Text style={styles.cardHeader}>Uploaded Documents</Text>
        {renderField("Student's Selfie", documents.StudentSelfie?.name || 'Attached')}
        {renderField('SSLC Marks Card', documents.SSLCMarksCard?.name || 'Attached')}
        {renderField('College Fee Receipt(s)', documents.FeeReceipts?.name || 'Attached')}
        {renderField("Student's Bank Passbook", documents.BankPassbook?.name || 'Attached')}
        {renderField('Aadhaar Card', documents.AadhaarCard?.name || 'Attached')}
      </FormCard>

      {/* Declaration */}
      <FormCard>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setDeclarationAccepted(!declarationAccepted)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, declarationAccepted && styles.checkboxChecked]}>
            {declarationAccepted && <Ionicons name="checkmark" size={16} color={colors.card} />}
          </View>
          <Text style={styles.checkboxLabel}>
            I have read and agree to the Terms & Conditions. All information provided is true and accurate.
            <Text style={styles.required}> *</Text>
          </Text>
        </TouchableOpacity>
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    fontSize: platform.normalize.fontSize.h3,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xs,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
  },
  fieldLabel: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.textSecondary,
    flex: 1,
  },
  fieldValue: {
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorBannerText: {
    fontSize: platform.normalize.fontSize.body,
    color: colors.error,
    flex: 1,
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
});
