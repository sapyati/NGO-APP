import { Ionicons } from '@expo/vector-icons';

export type HomeFormType = 'professional' | 'puc' | 'semiProfessional' | 'newStudent';

export interface ScholarshipCardItem {
  id: string;
  title: string;
  formType: HomeFormType;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  description: string;
  benefits: string[];
}

export interface RenewalCardItem {
  id: string;
  title: string;
  route: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  description: string;
}

export interface HomeSection {
  id: string;
  title: string;
  subtitle: string;
  accent?: 'primary' | 'success';
  items: ScholarshipCardItem[] | RenewalCardItem[];
}

export const homeSections: HomeSection[] = [
  {
    id: 'new-scholarships',
    title: 'Apply for a New Scholarship',
    subtitle: 'Select your current education level',
    accent: 'primary',
    items: [
      {
        id: 'professional',
        title: 'Professional',
        formType: 'professional',
        icon: 'briefcase-outline',
        description: 'For Engineering and Medical students',
        benefits: ['Higher amounts', 'Merit-based', 'Course verification'],
      },
      {
        id: 'puc',
        title: 'PUC-I',
        formType: 'puc',
        icon: 'school-outline',
        description: 'For PUC-I Commerce and Diploma-I students',
        benefits: ['Foundation scholarship', 'Academic based', 'Stream benefits'],
      },
      {
        id: 'semi-professional',
        title: 'Semi Professional',
        formType: 'semiProfessional',
        icon: 'medkit-outline',
        description: 'For B.Sc Nursing, GNM-Nursing, Physiotherapy, B.Sc Agriculture, Veterinary Science & Horticulture',
        benefits: ['Nursing & Agriculture', 'Need-based', 'Document verification'],
      },

    ],
  },
];
