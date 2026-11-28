import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet } from 'react-native';

import { getPucFormat11Dropdowns } from '@/api/pucFormat11Api';
import DecimalInputField from '@/components/common/DecimalInputField';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { pucFormat11FamilyDetailsSchema } from '@/forms/pucFormat11/validation';
import { useFormEngineStore } from '@/store/useFormEngineStore';

export default function PucFormat11FamilySection({ navigation }: any) {
  const {
    updateSectionData,
    markStepComplete,
    updateValidationState,
    formData,
  } = useFormEngineStore();

  const [fatherOccOptions, setFatherOccOptions] = useState<Option<number>[]>([]);
  const [motherOccOptions, setMotherOccOptions] = useState<Option<number>[]>([]);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getPucFormat11Dropdowns();
      if (response.success && response.data) {
        setFatherOccOptions(
          response.data.fatherOcc?.map((f: any) => ({
            value: Number(f.value),
            label: f.label,
          })) || []
        );
        setMotherOccOptions(
          response.data.motherOcc?.map((m: any) => ({
            value: Number(m.value),
            label: m.label,
          })) || []
        );
      }
    }
    loadDropdowns();
  }, []);

  const familyData = (formData as any)?.family || {};

  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      FatherOccupation: familyData.FatherOccupation || 0,
      MotherOccupation: familyData.MotherOccupation || 0,
      TotalFamilyMembers: familyData.TotalFamilyMembers || 0,
      FamilyAnnualIncome: familyData.FamilyAnnualIncome || 0,
      ParentsBankBalance: familyData.ParentsBankBalance || 0,
    },
    resolver: zodResolver(pucFormat11FamilyDetailsSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: any) => {
    updateSectionData('family', data);
    updateValidationState('family', { isValid: true, data });
    markStepComplete(3);
    navigation.navigate('academic');
  };

  const onInvalid = () => {
    Alert.alert(
      'Missing Required Details',
      'Please fill all details marked with * before proceeding.'
    );
  };

  return (
    <FormScreenLayout
      title="Family Information"
      step={3}
      totalSteps={8}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
    >
      <FormSectionHeader
        icon="people"
        title="Family & Economic Background"
        subtitle="Occupation, income and family members details"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="FatherOccupation"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Father/Guardian Occupation"
              value={value}
              onChange={onChange}
              options={fatherOccOptions}
              placeholder="Select Father's Occupation"
              error={formState.errors.FatherOccupation?.message as string | undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="MotherOccupation"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="Mother/Guardian Occupation"
              value={value}
              onChange={onChange}
              options={motherOccOptions}
              placeholder="Select Mother's Occupation"
              error={formState.errors.MotherOccupation?.message as string | undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="TotalFamilyMembers"
          render={({ field: { onChange, value } }) => (
            <DecimalInputField
              label="Total Number of Family Members"
              value={value}
              onChangeValue={(v) => onChange(v ?? 0)}
              placeholder="Enter total family members"
              error={formState.errors.TotalFamilyMembers?.message as string | undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="FamilyAnnualIncome"
          render={({ field: { onChange, value } }) => (
            <DecimalInputField
              label="Family Annual Income (All Sources)"
              value={value}
              onChangeValue={(v) => onChange(v ?? 0)}
              placeholder="Enter annual income in ₹"
              error={formState.errors.FamilyAnnualIncome?.message as string | undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="ParentsBankBalance"
          render={({ field: { onChange, value } }) => (
            <DecimalInputField
              label="Parents' Bank Balance (Max. Updated Entry)"
              value={value}
              onChangeValue={(v) => onChange(v ?? 0)}
              placeholder="Enter balance in ₹"
              error={formState.errors.ParentsBankBalance?.message as string | undefined}
              helperText="Current bank balance of parents/guardian"
              required
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({});
