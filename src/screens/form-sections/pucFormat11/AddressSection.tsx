import ModalSelectField, { Option } from '@/components/common/ModalSelectField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet } from 'react-native';

import { getPucFormat11Dropdowns } from '@/api/pucFormat11Api';
import FormCard from '@/components/common/FormCard';
import FormSectionHeader from '@/components/common/FormSectionHeader';
import VPInputField from '@/components/common/VPInputField';
import FormScreenLayout from '@/components/layout/FormScreenLayout';
import { pucFormat11AddressDetailsSchema } from '@/forms/pucFormat11/validation';
import { useFormEngineStore } from '@/store/useFormEngineStore';

export default function PucFormat11AddressSection({ navigation }: any) {
  const {
    updateSectionData,
    markStepComplete,
    updateValidationState,
    formData,
  } = useFormEngineStore();

  const [districtOptions, setDistrictOptions] = useState<Option<number>[]>([]);

  useEffect(() => {
    async function loadDropdowns() {
      const response = await getPucFormat11Dropdowns();
      if (response.success && response.data) {
        setDistrictOptions(
          response.data.districts?.map((d: any) => ({
            value: Number(d.value),
            label: d.label,
          })) || []
        );
      }
    }
    loadDropdowns();
  }, []);

  const addressData = (formData as any)?.address || {};

  const { control, handleSubmit, formState, watch } = useForm({
    defaultValues: {
      District: addressData.District || 0,
      OtherDistrict: addressData.OtherDistrict || '',
      Taluk: addressData.Taluk || '',
      ResidentialAddress: addressData.ResidentialAddress || '',
      PinCode: addressData.PinCode || '',
    },
    resolver: zodResolver(pucFormat11AddressDetailsSchema),
    mode: 'onChange',
  });

  const selectedDistrict = watch('District');

  const onSubmit = (data: any) => {
    updateSectionData('address', data);
    updateValidationState('address', { isValid: true, data });
    markStepComplete(2);
    navigation.navigate('family');
  };

  const onInvalid = () => {
    Alert.alert(
      'Missing Required Details',
      'Please fill all details marked with * before proceeding.'
    );
  };

  return (
    <FormScreenLayout
      title="Address Information"
      step={2}
      totalSteps={8}
      onBack={navigation.goBack}
      onNext={handleSubmit(onSubmit, onInvalid)}
    >
      <FormSectionHeader
        icon="location"
        title="Residential Address"
        subtitle="Current residential address and location details"
        showRequired
      />

      <FormCard>
        <Controller
          control={control}
          name="District"
          render={({ field: { onChange, value } }) => (
            <ModalSelectField
              label="District"
              value={value}
              onChange={onChange}
              options={districtOptions}
              placeholder="Select District"
              error={formState.errors.District?.message as string | undefined}
              required
            />
          )}
        />

        {selectedDistrict === 11 && (
          <Controller
            control={control}
            name="OtherDistrict"
            render={({ field: { onChange, value } }) => (
              <VPInputField
                label="Other District Name"
                value={value}
                onChangeText={onChange}
                placeholder="Enter district name"
                error={formState.errors.OtherDistrict?.message}
                required
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="Taluk"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Taluk"
              value={value}
              onChangeText={onChange}
              placeholder="Enter taluk name"
              error={formState.errors.Taluk?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="ResidentialAddress"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Residential Address"
              value={value}
              onChangeText={onChange}
              placeholder="Enter complete residential address"
              helperText="(It should include your father name, house No., Street name, Village/City name, Land mark near your house, Post, Taluk, district, Pin code)"
              multiline
              numberOfLines={4}
              error={formState.errors.ResidentialAddress?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="PinCode"
          render={({ field: { onChange, value } }) => (
            <VPInputField
              label="Pin Code"
              value={value}
              onChangeText={onChange}
              placeholder="Enter 6-digit pin code"
              keyboardType="number-pad"
              maxLength={6}
              error={formState.errors.PinCode?.message}
            />
          )}
        />
      </FormCard>
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({});
