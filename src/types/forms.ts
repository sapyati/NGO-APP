// Centralized Form Type Definitions for VP Scholarship App
// This file provides type-safe interfaces using Zod-inferred types as single source of truth

import {
    payanaFormSchema,
} from '@/validation/payanaSchemas';
import {
    academicDetailsSchema,
    professionalDocumentDetailsSchema,
    professionalFormSchema,
} from '@/validation/professionalSchemas';
import {
    pucFormat11FormSchema,
} from '@/validation/pucFormat11Schemas';
import {
    semiProfessionalFormSchema,
} from '@/validation/semiProfessionalSchemas';
import {
    addressDetailsSchema,
    contactDetailsSchema,
    familyDetailsSchema,
    guidelinesSchema,
    personalDetailsSchema,
} from '@/validation/sharedSchemas';
import {
    newStudentFormSchema,
} from '@/validation/newStudentSchemas';
import { z } from 'zod';

// Type exports from Zod schemas (single source of truth)
export type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;
export type ContactDetailsFormValues = z.infer<typeof contactDetailsSchema>;
export type AddressDetailsFormValues = z.infer<typeof addressDetailsSchema>;
export type FamilyDetailsFormValues = z.infer<typeof familyDetailsSchema>;
export type GuidelinesFormValues = z.infer<typeof guidelinesSchema>;

export type AcademicDetailsFormValues = z.infer<typeof academicDetailsSchema>;
export type ProfessionalDocumentDetailsFormValues = z.infer<typeof professionalDocumentDetailsSchema>;
export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;

export type PucFormValues = z.infer<typeof pucFormat11FormSchema>;

export type PayanaFormValues = z.infer<typeof payanaFormSchema>;

export type SemiProfessionalFormValues = z.infer<typeof semiProfessionalFormSchema>;

export type NewStudentFormValues = z.infer<typeof newStudentFormSchema>;

// Union type for all form types
export type FormDataUnion = ProfessionalFormValues | PucFormValues | PayanaFormValues | SemiProfessionalFormValues | NewStudentFormValues;

// Form engine state interface (using Zod-inferred types)
export interface FormEngineState {
  currentFormType: 'professional' | 'puc' | 'payana' | 'semiProfessional' | 'newStudent' | 'pucFormat11' | null;
  currentStep: number;
  completedSteps: Record<number, boolean>;
  formData: FormDataUnion;
  validationState: Record<string, {
    isValid: boolean;
    errors?: Record<string, string>;
    data?: unknown;
  }>;
  uploadState: Record<string, {
    isUploading: boolean;
    uploaded: boolean;
    progress: number;
    error?: string;
  }>;
  submissionState: {
    isSubmitting: boolean;
    isSubmitted: boolean;
    error?: string;
    applicationId?: string;
  };
}

// Navigation props interface
export interface NavigationProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
  route: {
    params?: Record<string, unknown>;
  };
}

// Type guards for safe form operations
export const isProfessionalForm = (data: FormDataUnion): data is ProfessionalFormValues => {
  return data && 'personal' in data && 'family' in data && 'StudentName' in (data as any).personal && !('category' in data) && !('bank' in data);
};

export const isPUCForm = (data: FormDataUnion): data is PucFormValues => {
  return data && 'personal' in data && 'academic' in data && 'SSLCPercentage' in (data as any).academic && !('category' in data) && !('studentAchievements' in data) && !('agreement' in data);
};

export const isPayanaForm = (data: FormDataUnion): data is PayanaFormValues => {
  return data && 'bank' in data && 'category' in data && 'studentAchievements' in data;
};

export const isSemiProfessionalForm = (data: FormDataUnion): data is SemiProfessionalFormValues => {
  return data && 'personal' in data && 'family' in data && 'studentName' in (data as any).personal && !('category' in data) && !('bank' in data);
};

export const isNewStudentForm = (data: FormDataUnion): data is NewStudentFormValues => {
  return data && 'category' in data && !('bank' in data) && !('agreement' in data);
};
