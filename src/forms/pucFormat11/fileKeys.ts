/**
 * PUC Format 1.1 Form File Keys
 * The 5 mandatory documents required by VP_Format1_1PUCApiController
 */
export const PUC_FORMAT11_FILE_KEYS = {
  STUDENT_SELFIE: 'StudentSelfie',
  SSLC_MARKS_CARD: 'SSLCMarksCard',
  FEE_RECEIPTS: 'FeeReceipts',
  BANK_PASSBOOK: 'BankPassbook',
  AADHAAR_CARD: 'AadhaarCard',
} as const;

export type PucFormat11FileKey =
  typeof PUC_FORMAT11_FILE_KEYS[keyof typeof PUC_FORMAT11_FILE_KEYS];
