import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FileUploadField from '@/components/form/FileUploadField';
import UploadSizeNotice from '@/components/form/UploadSizeNotice';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { pickDocument } from '@/utils/filePicker';
import { getTotalUploadSizeBytes } from '@/utils/uploadSize';
import { useFormEngineStore } from '@/store/useFormEngineStore';

const PUC_FORMAT11_DOC_KEYS = [
  'StudentSelfie',
  'SSLCMarksCard',
  'FeeReceipts',
  'BankPassbook',
  'AadhaarCard',
] as const;

const DOC_LABELS: Record<string, { title: string; subtitle: string; icon: string }> = {
  StudentSelfie: {
    title: "Student's Selfie",
    subtitle: 'Upload student recent photograph/selfie',
    icon: 'person',
  },
  SSLCMarksCard: {
    title: 'SSLC Marks Card',
    subtitle: 'Upload 10th / SSLC marks card copy',
    icon: 'school',
  },
  FeeReceipts: {
    title: 'College Fee Receipt(s)',
    subtitle: 'Upload college fee payment receipt(s)',
    icon: 'receipt',
  },
  BankPassbook: {
    title: "Student's Bank Passbook (First Page)",
    subtitle: 'Upload bank passbook page with account & IFSC details',
    icon: 'card',
  },
  AadhaarCard: {
    title: 'Aadhaar Card',
    subtitle: "Upload student's Aadhaar card copy",
    icon: 'document-text',
  },
};

const IMAGE_DOC_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export default function PucFormat11DocumentSection({ navigation }: any) {
  const {
    updateSectionData,
    markStepComplete,
    updateValidationState,
    formData,
    uploadState,
    updateUploadState,
  } = useFormEngineStore();

  const documentData = (formData as any)?.documents ?? {};

  const handleFileUpload = async (documentKey: string) => {
    updateUploadState(documentKey, { isUploading: true, error: undefined, progress: 0 });

    const file = await pickDocument(IMAGE_DOC_TYPES);

    if (!file) {
      updateUploadState(documentKey, { isUploading: false });
      return;
    }

    if (file.size && file.size > 2 * 1024 * 1024) {
      updateUploadState(documentKey, {
        isUploading: false,
        error: 'File size exceeds 2MB limit.',
      });
      return;
    }

    const updatedDocuments = {
      ...documentData,
      [documentKey]: {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      },
    };

    updateSectionData('documents', updatedDocuments);
    updateUploadState(documentKey, { isUploading: false, uploaded: true, error: undefined });
  };

  const handleFileRemove = (documentKey: string) => {
    const updatedDocuments = { ...documentData };
    delete updatedDocuments[documentKey];
    updateSectionData('documents', updatedDocuments);
    updateUploadState(documentKey, { uploaded: false, error: undefined });
  };

  const onSubmit = () => {
    const missingDocs = PUC_FORMAT11_DOC_KEYS.filter((key) => !documentData[key]?.file);

    if (missingDocs.length > 0) {
      const missingNames = missingDocs.map((k) => DOC_LABELS[k]?.title || k).join('\n• ');
      Alert.alert(
        'Missing Mandatory Documents',
        `Please upload the following required documents before proceeding:\n\n• ${missingNames}`
      );
      return;
    }

    updateValidationState('documents', { isValid: true, data: documentData });
    markStepComplete(6);
    navigation.navigate('review');
  };

  const uploadedFiles = Object.values(documentData).map((d: any) => d?.file).filter(Boolean);
  const totalSizeBytes = getTotalUploadSizeBytes(documentData);

  return (
    <FormScreenLayout
      title="Upload Documents"
      step={6}
      totalSteps={8}
      onBack={navigation.goBack}
      onNext={onSubmit}
      nextLabel="Review Application"
    >
      <FormSectionHeader
        icon="attach"
        title="Upload Required Documents"
        subtitle="All 5 documents are mandatory"
        showRequired
      />

      <UploadSizeNotice
        totalBytes={totalSizeBytes}
      />

      {/* Website Note Card */}
      <View style={styles.topNoticeBanner}>
        <Text style={styles.noticeHeading}>Note:</Text>
        <Text style={styles.topNoticeText}>
          1. Take photo in your mobile and upload (Only Images/photos are allowed)
        </Text>
        <Text style={styles.topNoticeText}>
          2. All uploaded documents will be verified during the house visit.
        </Text>
      </View>

      <FormCard>
        {PUC_FORMAT11_DOC_KEYS.map((documentKey) => {
          const docInfo = DOC_LABELS[documentKey];
          const docState = uploadState[documentKey] || { isUploading: false, uploaded: false };
          const existingDoc = documentData[documentKey];

          return (
            <FileUploadField
              key={documentKey}
              title={docInfo.title}
              subtitle={docInfo.subtitle}
              file={existingDoc?.file}
              meta={docState}
              onUpload={() => handleFileUpload(documentKey)}
              onDelete={() => handleFileRemove(documentKey)}
            />
          );
        })}
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  topNoticeBanner: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  noticeHeading: {
    fontSize: platform.normalize.fontSize.body,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 4,
  },
  topNoticeText: {
    fontSize: platform.normalize.fontSize.body,
    color: '#92400e',
    lineHeight: 20,
    marginBottom: 2,
  },
});
