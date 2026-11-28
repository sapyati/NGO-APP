/**
 * PUC Format 1.1 Form Configuration (After Login)
 * Title: Format 1.1 - Student Information Sheet - 2026-2027
 */

import { APP_TITLES } from '@/config/appContent';
import { FormConfig, FormStep, StepConfig } from '../shared/types';

export const pucFormat11FormConfig: FormConfig = {
  type: 'pucFormat11',
  title: APP_TITLES.pucFormat11Application,
  description: 'PUC Format 1.1 Student Information Sheet',
  steps: [
    'guidelines',
    'personal',
    'address',
    'family',
    'academic',
    'bank',
    'documents',
    'review',
    'success',
  ],
  totalSteps: 8,
  validation: {
    guidelines: 'pucFormat11GuidelinesSchema',
    personal: 'pucFormat11PersonalDetailsSchema',
    address: 'pucFormat11AddressDetailsSchema',
    family: 'pucFormat11FamilyDetailsSchema',
    academic: 'pucFormat11AcademicDetailsSchema',
    bank: 'pucFormat11BankDetailsSchema',
    documents: 'pucFormat11DocumentDetailsSchema',
    review: null,
    success: null,
  },
};

export const pucFormat11StepConfigs: StepConfig[] = [
  {
    id: 'guidelines' as FormStep,
    title: 'Guidelines & Instructions',
    subtitle: 'Instructions and documents checklist',
    component: 'GuidelinesSection',
    validation: 'pucFormat11GuidelinesSchema',
    required: true,
    icon: 'document-text',
  },
  {
    id: 'personal' as FormStep,
    title: "Applicant's Information",
    subtitle: 'Basic student & contact details',
    component: 'PersonalSection',
    validation: 'pucFormat11PersonalDetailsSchema',
    required: true,
    icon: 'person',
  },
  {
    id: 'address' as FormStep,
    title: 'Address Details',
    subtitle: 'District, taluk & residential address',
    component: 'AddressSection',
    validation: 'pucFormat11AddressDetailsSchema',
    required: true,
    icon: 'location',
  },
  {
    id: 'family' as FormStep,
    title: 'Family Details',
    subtitle: 'Parents occupation, income & bank balance',
    component: 'FamilySection',
    validation: 'pucFormat11FamilyDetailsSchema',
    required: true,
    icon: 'people',
  },
  {
    id: 'academic' as FormStep,
    title: 'Academic Details',
    subtitle: 'SSLC score, course & college info',
    component: 'AcademicSection',
    validation: 'pucFormat11AcademicDetailsSchema',
    required: true,
    icon: 'school',
  },
  {
    id: 'bank' as FormStep,
    title: 'Student Bank Details',
    subtitle: 'Student savings bank account details',
    component: 'BankSection',
    validation: 'pucFormat11BankDetailsSchema',
    required: true,
    icon: 'card',
  },
  {
    id: 'documents' as FormStep,
    title: 'Required Documents',
    subtitle: 'Upload the 5 mandatory certificates',
    component: 'DocumentSection',
    validation: 'pucFormat11DocumentDetailsSchema',
    required: true,
    icon: 'attach',
  },
  {
    id: 'review' as FormStep,
    title: 'Review & Submit',
    subtitle: 'Confirm all details before submission',
    component: 'ReviewSection',
    validation: '',
    required: true,
    icon: 'checkmark-done',
  },
];
