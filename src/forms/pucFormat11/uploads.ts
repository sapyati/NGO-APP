/**
 * PUC Format 1.1 Upload Rules
 * Configures the 5 mandatory files for Format 1.1 (after login):
 * 1. Student's Selfie
 * 2. SSLC Marks Card
 * 3. College Fee Receipt(s)
 * 4. Student's Bank Passbook (First Page)
 * 5. Aadhaar Card
 */

import { PUC_FORMAT11_FILE_KEYS } from './fileKeys';

export interface UploadRule {
  key: string;
  label: string;
  required: boolean;
  maxSize: number;
  acceptedTypes: string[];
  helperText?: string;
}

export const PUC_FORMAT11_UPLOAD_RULES: UploadRule[] = [
  {
    key: PUC_FORMAT11_FILE_KEYS.STUDENT_SELFIE,
    label: "Student's Selfie",
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    helperText: "Recent photograph/selfie of the student",
  },
  {
    key: PUC_FORMAT11_FILE_KEYS.SSLC_MARKS_CARD,
    label: 'SSLC Marks Card',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    helperText: 'Clear copy of 10th/SSLC marks card',
  },
  {
    key: PUC_FORMAT11_FILE_KEYS.FEE_RECEIPTS,
    label: 'College Fee Receipt(s)',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    helperText: 'Recent college admission fee receipt',
  },
  {
    key: PUC_FORMAT11_FILE_KEYS.BANK_PASSBOOK,
    label: "Student's Bank Passbook (First Page)",
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    helperText: 'First page showing account number, name, and IFSC',
  },
  {
    key: PUC_FORMAT11_FILE_KEYS.AADHAAR_CARD,
    label: 'Aadhaar Card',
    required: true,
    maxSize: 2 * 1024 * 1024,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    helperText: "Student's Aadhaar card copy",
  },
];
