import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { getPucFormat11Dropdowns } from '@/api/pucFormat11Api';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import VPDatePickerField from '@/components/common/VPDatePickerField';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { pucFormat11PersonalDetailsSchema } from '@/forms/pucFormat11/validation';
import { useFormEngineStore } from '@/store/useFormEngineStore';

export default function PucFormat11PersonalSection({ navigation }: any) {
  const {
    updateSectionData,
    markStepComplete,
    updateValidationState,
    formData,
  } = useFormEngineStore();

  const [genderOptions, setGenderOptions] = useState<Option<number>[]>([]);
  const [casteOptions, setCasteOptions] = useState<Option<number>[]>([]);
  const [areaOptions, setAreaOptions] = useState<Option<number>[]>([]);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getPucFormat11Dropdowns();
      if (response.success && response.data) {
        setGenderOptions(
          response.data.genders?.map((g: any) => ({
            value: Number(g.value),
            label: g.label,
          })) || []
        );
        setCasteOptions(
          response.data.castes?.map((c: any) => ({
            value: Number(c.value),
            label: c.label,
          })) || []
        );
        const places =
          response.data.places?.map((p: any) => ({
            value: Number(p.value),
            label: p.label,
          })) || [];
        setAreaOptions(
          places.length > 0
            ? places
            : [
                { value: 1, label: 'Urban' },
                { value: 2, label: 'Rural' },
                { value: 3, label: 'Semi Urban' },
              ]
        );
      } else {
        setGenderOptions([
          { value: 1, label: 'Male' },
          { value: 2, label: 'Female' },
        ]);
        setCasteOptions([
          { value: 1, label: 'GM' },
          { value: 2, label: 'OBC' },
          { value: 3, label: 'SC' },
          { value: 4, label: 'ST' },
          { value: 5, label: 'Minority' },
        ]);
        setAreaOptions([
          { value: 1, label: 'Urban' },
          { value: 2, label: 'Rural' },
          { value: 3, label: 'Semi Urban' },
        ]);
      }
    }
    loadDropdowns();
  }, []);

  const personalData = (formData as any)?.personal || {};

  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      Email: personalData.Email || '',
      StudentName: personalData.StudentName || '',
      ContactNumber: personalData.ContactNumber || '',
      AlternateNumber: personalData.AlternateNumber || '',
      Gender: personalData.Gender || 0,
      DateOfBirth: personalData.DateOfBirth || '',
      Caste: personalData.Caste || 0,
      Place: personalData.Place || 0,
    },
    resolver: zodResolver(pucFormat11PersonalDetailsSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: any) => {
    updateSectionData('personal', data);
    updateValidationState('personal', { isValid: true, data });
    markStepComplete(1);
    navigation.navigate('address');
  };

  const onInvalid = () => {
    Alert.alert(
      'Missing Required Details',
      'Please fill all details marked with * before proceeding.'
    );
  };

  return (
    <FormScreenLayout
      title="Personal Information"
      step={1}
      totalSteps={8}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
    >
      <FormSectionHeader
        icon="person"
        title="Student Personal Details"
        subtitle="Basic student information and contact details"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="Email"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Email"
              value={value}
              onChangeText={onChange}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
              error={formState.errors.Email?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="StudentName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Student Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter student full name"
              error={formState.errors.StudentName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="ContactNumber"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Contact Number (WhatsApp)"
              value={value}
              onChangeText={onChange}
              placeholder="Enter 10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              error={formState.errors.ContactNumber?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="AlternateNumber"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Alternate Number"
              value={value}
              onChangeText={onChange}
              placeholder="Enter alternate 10-digit number"
              keyboardType="phone-pad"
              maxLength={10}
              error={formState.errors.AlternateNumber?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="Gender"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Gender"
              value={value}
              onChange={onChange}
              options={genderOptions}
              placeholder="Select Gender"
              error={formState.errors.Gender?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="DateOfBirth"
          render={({ field: { onChange, value } }) => (
            <VPDatePickerField
              label="Date of Birth"
              value={value}
              onChange={onChange}
              error={formState.errors.DateOfBirth?.message}
              maximumDate={new Date()}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="Caste"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Caste"
              value={value}
              onChange={onChange}
              options={casteOptions}
              placeholder="Select Caste"
              error={formState.errors.Caste?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="Place"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Place (Area Type)"
              value={value}
              onChange={onChange}
              options={areaOptions}
              placeholder="Select Area Type"
              error={formState.errors.Place?.message}
              required
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({});
