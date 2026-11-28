import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet } from 'react-native';

import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { pucFormat11BankDetailsSchema } from '@/forms/pucFormat11/validation';
import { useFormEngineStore } from '@/store/useFormEngineStore';

export default function PucFormat11BankSection({ navigation }: any) {
  const {
    updateSectionData,
    markStepComplete,
    updateValidationState,
    formData,
  } = useFormEngineStore();

  const bankData = (formData as any)?.bank || {};

  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      AccountHolderName: bankData.AccountHolderName || '',
      AccountNumber: bankData.AccountNumber || '',
      IFSCCode: bankData.IFSCCode || '',
      BankName: bankData.BankName || '',
      BranchName: bankData.BranchName || '',
    },
    resolver: zodResolver(pucFormat11BankDetailsSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: any) => {
    updateSectionData('bank', data);
    updateValidationState('bank', { isValid: true, data });
    markStepComplete(5);
    navigation.navigate('documents');
  };

  const onInvalid = () => {
    Alert.alert(
      'Missing Required Details',
      'Please fill all details marked with * before proceeding.'
    );
  };

  return (
    <FormScreenLayout
      title="Student Bank Details"
      step={5}
      totalSteps={8}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
    >
      <FormSectionHeader
        icon="card"
        title="Student Savings Bank Account"
        subtitle="Bank account details of the student for scholarship transfer"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="AccountHolderName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Bank Account Holder Name (As per Passbook)"
              value={value}
              onChangeText={onChange}
              placeholder="Enter student name exactly as in passbook"
              error={formState.errors.AccountHolderName?.message as string | undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="AccountNumber"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Bank Account Number"
              value={value}
              onChangeText={onChange}
              placeholder="Enter bank account number"
              keyboardType="number-pad"
              error={formState.errors.AccountNumber?.message as string | undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="IFSCCode"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="IFSC Code"
              value={value}
              onChangeText={(text) => onChange(text.toUpperCase())}
              placeholder="e.g. SBIN0001234"
              autoCapitalize="characters"
              maxLength={11}
              error={formState.errors.IFSCCode?.message as string | undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="BankName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Bank Name"
              value={value}
              onChangeText={onChange}
              placeholder="e.g. State Bank of India"
              error={formState.errors.BankName?.message as string | undefined}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="BranchName"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Bank Branch Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter branch name"
              error={formState.errors.BranchName?.message as string | undefined}
              required
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({});
