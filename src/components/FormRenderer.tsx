import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, BackHandler, Text, View } from 'react-native';
import { getFormConfig } from '../forms/shared/registry';
import { getDraft } from '../services/draftStorage';
import { useFormEngineStore } from '../store/useFormEngineStore';

// Import shared/professional form section components
import ProfAcademicSection from '../screens/form-sections/professional/AcademicSection';
import ProfDocumentSection from '../screens/form-sections/professional/DocumentSection';
import ProfFamilySection from '../screens/form-sections/professional/FamilySection';
import GuidelinesSection from '../screens/form-sections/professional/GuidelinesSection';
import ProfPersonalSection from '../screens/form-sections/professional/PersonalSection';
import ReviewSection from '../screens/form-sections/professional/ReviewSection';
import SuccessSection from '../screens/form-sections/professional/SuccessSection';

// Import PUC-specific form section components
import PucAcademicSection from '../screens/form-sections/puc/AcademicSection';
import PucAddressSection from '../screens/form-sections/puc/AddressSection';
import PucBankSection from '../screens/form-sections/puc/BankSection';
import PucCategorySection from '../screens/form-sections/puc/CategorySection';
import PucContactSection from '../screens/form-sections/puc/ContactSection';
import PucDocumentSection from '../screens/form-sections/puc/DocumentSection';
import PucFamilySection from '../screens/form-sections/puc/FamilySection';
import PucGuidelinesSection from '../screens/form-sections/puc/GuidelinesSection';
import PucPersonalSection from '../screens/form-sections/puc/PersonalSection';

// Import Semi Professional-specific form section components
import SemiProfAcademicSection from '../screens/form-sections/semiProfessional/AcademicSection';
import SemiProfDocumentSection from '../screens/form-sections/semiProfessional/DocumentSection';
import SemiProfFamilySection from '../screens/form-sections/semiProfessional/FamilySection';
import SemiProfGuidelinesSection from '../screens/form-sections/semiProfessional/GuidelinesSection';
import SemiProfPersonalSection from '../screens/form-sections/semiProfessional/PersonalSection';
import SemiProfReviewSection from '../screens/form-sections/semiProfessional/ReviewSection';
import SemiProfSuccessSection from '../screens/form-sections/semiProfessional/SuccessSection';

// Import Payana-specific form section components
import PayanaAcademicSection from '../screens/form-sections/payana/AcademicSection';
import PayanaAddressSection from '../screens/form-sections/payana/AddressSection';
import PayanaBankSection from '../screens/form-sections/payana/BankSection';
import PayanaCategorySection from '../screens/form-sections/payana/CategorySection';
import PayanaContactSection from '../screens/form-sections/payana/ContactSection';
import PayanaDocumentSection from '../screens/form-sections/payana/DocumentSection';
import PayanaFamilySection from '../screens/form-sections/payana/FamilySection';
import PayanaGuidelinesSection from '../screens/form-sections/payana/GuidelinesSection';
import PayanaPersonalSection from '../screens/form-sections/payana/PersonalSection';

// Import New Student-specific form section components
import NsAcademicSection from '../screens/form-sections/newStudent/AcademicSection';
import NsAddressSection from '../screens/form-sections/newStudent/AddressSection';
import NsCategorySection from '../screens/form-sections/newStudent/CategorySection';
import NsContactSection from '../screens/form-sections/newStudent/ContactSection';
import NsDocumentSection from '../screens/form-sections/newStudent/DocumentSection';
import NsFamilySection from '../screens/form-sections/newStudent/FamilySection';
import NsGuidelinesSection from '../screens/form-sections/newStudent/GuidelinesSection';
import NsPersonalSection from '../screens/form-sections/newStudent/PersonalSection';

// Import PUC Format 1.1 form section components (after login)
import PucFormat11AcademicSection from '../screens/form-sections/pucFormat11/AcademicSection';
import PucFormat11AddressSection from '../screens/form-sections/pucFormat11/AddressSection';
import PucFormat11BankSection from '../screens/form-sections/pucFormat11/BankSection';
import PucFormat11DocumentSection from '../screens/form-sections/pucFormat11/DocumentSection';
import PucFormat11FamilySection from '../screens/form-sections/pucFormat11/FamilySection';
import PucFormat11GuidelinesSection from '../screens/form-sections/pucFormat11/GuidelinesSection';
import PucFormat11PersonalSection from '../screens/form-sections/pucFormat11/PersonalSection';
import PucFormat11ReviewSection from '../screens/form-sections/pucFormat11/ReviewSection';

interface FormRendererProps {
  navigation: any;
  route: {
    params?: {
      formType?: 'professional' | 'puc' | 'payana' | 'semiProfessional' | 'newStudent' | 'pucFormat11';
    };
  };
}

// Component maps per form type
const professionalComponentMap: Record<string, React.ComponentType<any>> = {
  guidelines: GuidelinesSection,
  personal: ProfPersonalSection,
  family: ProfFamilySection,
  academic: ProfAcademicSection,
  documents: ProfDocumentSection,
  review: ReviewSection,
  success: SuccessSection,
};

const pucComponentMap: Record<string, React.ComponentType<any>> = {
  guidelines: PucGuidelinesSection,
  personal: PucPersonalSection,
  family: PucFamilySection,
  academic: PucAcademicSection,
  documents: PucDocumentSection,
  review: ReviewSection,
  success: SuccessSection,
};

const semiProfessionalComponentMap: Record<string, React.ComponentType<any>> = {
  guidelines: SemiProfGuidelinesSection,
  personal: SemiProfPersonalSection,
  family: SemiProfFamilySection,
  academic: SemiProfAcademicSection,
  documents: SemiProfDocumentSection,
  review: SemiProfReviewSection,
  success: SemiProfSuccessSection,
};

const payanaComponentMap: Record<string, React.ComponentType<any>> = {
  guidelines: PayanaGuidelinesSection,
  personal: PayanaPersonalSection,
  contact: PayanaContactSection,
  address: PayanaAddressSection,
  family: PayanaFamilySection,
  category: PayanaCategorySection,
  academic: PayanaAcademicSection,
  bank: PayanaBankSection,
  documents: PayanaDocumentSection,
  review: ReviewSection,
  success: SuccessSection,
};

const newStudentComponentMap: Record<string, React.ComponentType<any>> = {
  guidelines: NsGuidelinesSection,
  personal: NsPersonalSection,
  contact: NsContactSection,
  address: NsAddressSection,
  family: NsFamilySection,
  category: NsCategorySection,
  academic: NsAcademicSection,
  documents: NsDocumentSection,
  review: ReviewSection,
  success: SuccessSection,
};

const pucFormat11ComponentMap: Record<string, React.ComponentType<any>> = {
  guidelines: PucFormat11GuidelinesSection,
  personal: PucFormat11PersonalSection,
  address: PucFormat11AddressSection,
  family: PucFormat11FamilySection,
  academic: PucFormat11AcademicSection,
  bank: PucFormat11BankSection,
  documents: PucFormat11DocumentSection,
  review: PucFormat11ReviewSection,
  success: SuccessSection,
};

export default function FormRenderer({ navigation, route }: FormRendererProps) {
  const router = useRouter();
  // All hooks must run unconditionally (rules-of-hooks): never add hook calls
  // below the early returns in this component.
  const { currentStep, setCurrentStep, initializeForm, restoreDraft } = useFormEngineStore();
  const { formType = 'professional' } = route.params || {};

  // Initialize form — restore a saved offline draft when one exists.
  React.useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const draft = await getDraft(formType);
        if (cancelled) return;
        initializeForm(formType);
        if (draft) {
          restoreDraft(draft);
        }
      } catch (error) {
        console.error('Failed to initialize form:', error);
      }
    }
    init();
    return () => { cancelled = true; };
  }, [formType, initializeForm, restoreDraft]);

  // Android hardware back: step back inside the form; at the first
  // step, confirm before discarding entered data.
  React.useEffect(() => {
    const onBackPress = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
        return true;
      }
      Alert.alert(
        'Discard application?',
        'Going back will lose the details you have entered in this form.',
        [
          { text: 'Keep Editing', style: 'cancel', onPress: () => {} },
          { text: 'Discard', style: 'destructive', onPress: () => router.replace('/form-selection') },
        ]
      );
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [currentStep, setCurrentStep, router]);

  let config;
  try {
    config = getFormConfig(formType);
  } catch (error) {
    console.error('Failed to get form config:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
          Form configuration not found. Please try again.
        </Text>
      </View>
    );
  }

  const currentStepId = config.steps[currentStep];

  // Select the correct component map based on form type
  const getActiveComponentMap = () => {
    if (formType === 'puc') return pucComponentMap;
    if (formType === 'pucFormat11') return pucFormat11ComponentMap;
    if (formType === 'payana') return payanaComponentMap;
    if (formType === 'semiProfessional') return semiProfessionalComponentMap;
    if (formType === 'newStudent') return newStudentComponentMap;
    return professionalComponentMap;
  };
  
  const activeComponentMap = getActiveComponentMap();
  const ComponentToRender = activeComponentMap[currentStepId] || null;

  if (!ComponentToRender) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Step {currentStepId} - Component coming soon</Text>
      </View>
    );
  }

  // Step-based section navigation. At the first step, Back exits to the
  // scholarship selection screen instead of doing nothing.
  const sectionNavigation = {
    goBack: () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      } else {
        router.replace('/form-selection');
      }
    },
    navigate: (stepName: string) => {
      const stepIndex = config.steps.indexOf(stepName as any);
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex);
      }
    }
  };

  return <ComponentToRender navigation={sectionNavigation} />;
}
