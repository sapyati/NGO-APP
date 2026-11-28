import { FormConfig, FormType } from './types';
import { professionalFormConfig } from '../professional/config';
import { pucFormConfig } from '../puc/config';
import { payanaFormConfig } from '../payana/config';
import { semiProfessionalFormConfig } from '../semiProfessional/config';
import { newStudentFormConfig } from '../newStudent/config';
import { pucFormat11FormConfig } from '../pucFormat11/config';

export const formConfigs: Record<FormType, FormConfig> = {
  professional: professionalFormConfig,
  puc: pucFormConfig,
  payana: payanaFormConfig,
  semiProfessional: semiProfessionalFormConfig,
  newStudent: newStudentFormConfig,
  pucFormat11: pucFormat11FormConfig,
};

export function getFormConfig(type: FormType): FormConfig {
  const config = formConfigs[type];
  if (!config) {
    throw new Error(`Form config not found for type: ${type}`);
  }
  return config;
}

export function getAllFormTypes(): FormType[] {
  return Object.keys(formConfigs) as FormType[];
}
