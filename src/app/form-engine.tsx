import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import FormRenderer from '@/components/FormRenderer';

export default function FormEngineScreen() {
  const { formType } = useLocalSearchParams();

  return (
    <View style={{ flex: 1 }}>
      <FormRenderer 
        navigation={{}}
        route={{
          params: {
            formType: (formType as 'professional' | 'puc' | 'payana' | 'semiProfessional' | 'newStudent' | 'pucFormat11') || 'professional'
          }
        }}
      />
    </View>
  );
}
