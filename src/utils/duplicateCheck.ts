import { Alert } from 'react-native';

import { checkDuplicate } from '@/api/applicationStatusApi';
import { FormType } from '@/forms/shared/types';

const PROGRAM_LABELS: Record<FormType, string> = {
  professional: 'Professional',
  puc: 'PUC',
  pucFormat11: 'PUC Format 1.1',
  payana: 'Payana',
  semiProfessional: 'SemiProfessional',
  newStudent: 'Student',
};

export function getContactNumber(
  formType: FormType,
  formData: any,
): string | null {
  if (formType === 'pucFormat11') {
    return formData?.personal?.ContactNumber ?? null;
  }
  if (formType === 'semiProfessional') {
    return formData?.personal?.contactNumber ?? null;
  }
  // professional/payana use camelCase; puc uses PascalCase
  return (
    formData?.contact?.contactNumber ??
    formData?.contact?.ContactNumber ??
    null
  );
}

/**
 * Warns the user when a record already exists for this contact number.
 * Resolves true when it's OK to proceed (no duplicate, user confirms, or the
 * check could not be performed).
 */
export function confirmNoDuplicate(
  formType: FormType,
  contactNumber: string | null,
): Promise<boolean> {
  return new Promise(async (resolve) => {
    const digits = (contactNumber ?? '').replace(/\D/g, '');
    if (digits.length < 10) {
      resolve(true);
      return;
    }

    let exists = false;
    try {
      const result = await checkDuplicate(
        digits,
        PROGRAM_LABELS[formType],
      );
      exists = result.exists;
    } catch {
      // Duplicate check is advisory — never block a submission on it.
      resolve(true);
      return;
    }

    if (!exists) {
      resolve(true);
      return;
    }

    Alert.alert(
      'Possible Duplicate',
      'An application already exists for this mobile number. Submitting again may create a duplicate record.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve(false),
        },
        {
          text: 'Submit Anyway',
          onPress: () => resolve(true),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
