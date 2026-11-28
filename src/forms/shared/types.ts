export type FormType = 'professional' | 'puc' | 'payana' | 'semiProfessional' | 'newStudent' | 'pucFormat11';

export type FormStep = 
  | 'guidelines'
  | 'personal'
  | 'contact'
  | 'address'
  | 'family'
  | 'category'
  | 'academic'
  | 'bank'
  | 'documents'
  | 'review'
  | 'success';

export interface FormConfig {
  type: FormType;
  title: string;
  description: string;
  steps: FormStep[];
  totalSteps: number;
  validation: Record<string, any>;
}

export interface StepConfig {
  id: FormStep;
  title: string;
  subtitle?: string;
  component: string;
  validation: string;
  required: boolean;
  icon?: string;
}

export interface FormSectionData {
  personal: Record<string, any>;
  contact: Record<string, any>;
  address: Record<string, any>;
  family: Record<string, any>;
  category: Record<string, any>;
  academic: Record<string, any>;
  bank: Record<string, any>;
  documents: Record<string, any>;
}

export interface FormState {
  currentFormType: FormType | null;
  currentStep: number;
  completedSteps: Record<number, boolean>;
  formData: FormSectionData;
  validationState: Record<string, any>;
  uploadState: Record<string, any>;
  submissionState: {
    loading: boolean;
    error: string | null;
    success: boolean;
    applicationId?: string;
  };
}
