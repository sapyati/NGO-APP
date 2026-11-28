import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet } from 'react-native';

import { getPucFormat11Dropdowns } from '@/api/pucFormat11Api';
import DecimalInputField from '@/components/common/DecimalInputField';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { pucFormat11AcademicDetailsSchema } from '@/forms/pucFormat11/validation';
import { useFormEngineStore } from '@/store/useFormEngineStore';

export default function PucFormat11AcademicSection({ navigation }: any) {
  const {
    updateSectionData,
    markStepComplete,
    updateValidationState,
    formData,
  } = useFormEngineStore();

  const [courseOptions, setCourseOptions] = useState<Option<number>[]>([]);
  const [collegeTypeOptions, setCollegeTypeOptions] = useState<Option<number>[]>([]);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getPucFormat11Dropdowns();
      if (response.success && response.data) {
        setCourseOptions(
          response.data.courses?.map((c: any) => ({
            value: Number(c.value),
            label: c.label,
          })) || []
        );
        setCollegeTypeOptions(
          response.data.collegeTypes?.map((ct: any) => ({
            value: Number(ct.value),
            label: ct.label,
          })) || []
        );
      }
    }
    loadDropdowns();
  }, []);

  const academicData = (formData as any)?.academic || {};

  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      SSLCPercentage: academicData.SSLCPercentage || 0,
      CourseJoined: academicData.CourseJoined || 0,
      CollegeName: academicData.CollegeName || '',
      CollegeType: academicData.CollegeType || 0,
      CollegeFees: academicData.CollegeFees || 0,
      CollegeContactNumber: academicData.CollegeContactNumber || '',
      Achievement: academicData.Achievement || '',
    },
    resolver: zodResolver(pucFormat11AcademicDetailsSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: any) => {
    updateSectionData('academic', data);
    updateValidationState('academic', { isValid: true, data });
    markStepComplete(4);
    navigation.navigate('bank');
  };

  const onInvalid = () => {
    Alert.alert(
      'Missing Required Details',
      'Please fill all details marked with * before proceeding.'
    );
  };

  return (
    <FormScreenLayout
      title="Academic Information"
      step={4}
      totalSteps={8}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
    >
      <FormSectionHeader
        icon="school"
        title="Academic & College Details"
        subtitle="10th standard score and enrolled college information"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="SSLCPercentage"
          render={({ field: { onChange, value } }) => (
            <DecimalInputField
              label="Secured Percentage in SSLC"
              value={value}
              onChangeValue={(v) => onChange(v ?? 0)}
              placeholder="e.g. 85.5"
              error={formState.errors.SSLCPercentage?.message as string | undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="CourseJoined"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Course Joined"
              value={value}
              onChange={onChange}
              options={courseOptions}
              placeholder="Select Course"
              error={formState.errors.CourseJoined?.message as string | undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="CollegeName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="College Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter enrolled college name"
              error={formState.errors.CollegeName?.message as string | undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="CollegeType"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="College Type"
              value={value}
              onChange={onChange}
              options={collegeTypeOptions}
              placeholder="Select College Type"
              error={formState.errors.CollegeType?.message as string | undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="CollegeFees"
          render={({ field: { onChange, value } }) => (
            <DecimalInputField
              label="College Fees"
              value={value}
              onChangeValue={(v) => onChange(v ?? 0)}
              placeholder="Enter total college fees in ₹"
              error={formState.errors.CollegeFees?.message as string | undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="CollegeContactNumber"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="College Contact Number"
              value={value}
              onChangeText={onChange}
              placeholder="Enter 10-digit college contact number"
              keyboardType="phone-pad"
              maxLength={10}
              error={formState.errors.CollegeContactNumber?.message as string | undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="Achievement"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Achievement (If Any)"
              value={value}
              onChangeText={onChange}
              placeholder="Mention academic, sports, cultural or other achievements"
              multiline
              numberOfLines={3}
              error={formState.errors.Achievement?.message}
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({});
