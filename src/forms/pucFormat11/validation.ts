/**
 * PUC Format 1.1 Validation Schemas
 * Step-by-step Zod schemas matching the website form and VP_Format1_1PUCApiController.
 */

import { UploadedDocument } from '@/types/documents';
import { z } from 'zod';

export const pucFormat11GuidelinesSchema = z.object({
  guidelinesAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions to proceed',
  }),
});

export const pucFormat11PersonalDetailsSchema = z.object({
  Email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  StudentName: z
    .string()
    .min(1, { message: 'Student name is required' }),
  ContactNumber: z
    .string()
    .min(10, { message: 'Please enter a valid 10-digit WhatsApp number' })
    .max(10, { message: 'Please enter a valid 10-digit WhatsApp number' })
    .regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit WhatsApp number'),
  AlternateNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), {
      message: 'Please enter a valid 10-digit alternate number',
    }),
  Gender: z
    .number()
    .min(1, { message: 'Gender is required' }),
  DateOfBirth: z
    .string()
    .min(1, { message: 'Date of birth is required' })
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' })
    .refine((val) => new Date(val) <= new Date(), {
      message: 'Date cannot be in the future',
    }),
  Caste: z
    .number()
    .min(1, { message: 'Caste is required' }),
  Place: z
    .number()
    .min(1, { message: 'Area / Place type is required' }),
});

export const pucFormat11AddressDetailsSchema = z.object({
  District: z
    .number()
    .min(1, { message: 'District is required' }),
  OtherDistrict: z.string().optional(),
  Taluk: z
    .string()
    .min(1, { message: 'Taluk is required' }),
  ResidentialAddress: z
    .string()
    .min(5, { message: 'Detailed residential address is required' }),
  PinCode: z.string().optional(),
});

export const pucFormat11FamilyDetailsSchema = z.object({
  FatherOccupation: z
    .number()
    .min(1, { message: 'Father/Guardian occupation is required' }),
  MotherOccupation: z
    .number()
    .min(1, { message: 'Mother/Guardian occupation is required' }),
  TotalFamilyMembers: z
    .number({ message: 'Total number of family members is required' })
    .min(1, { message: 'Must be at least 1 member' }),
  FamilyAnnualIncome: z
    .number({ message: 'Family annual income is required' })
    .positive({ message: 'Income must be greater than 0' }),
  ParentsBankBalance: z
    .number({ message: 'Parents bank balance is required' })
    .min(0, { message: 'Bank balance must be at least 0' }),
});

export const pucFormat11AcademicDetailsSchema = z.object({
  SSLCPercentage: z
    .number({ message: 'SSLC percentage is required' })
    .min(1, { message: 'Percentage must be greater than 0' })
    .max(100, { message: 'Percentage cannot exceed 100' }),
  CourseJoined: z
    .number()
    .min(1, { message: 'Course joined is required' }),
  CollegeName: z
    .string()
    .min(1, { message: 'College name is required' }),
  CollegeType: z
    .number()
    .min(1, { message: 'College type is required' }),
  CollegeFees: z
    .number({ message: 'College fees is required' })
    .min(0, { message: 'Fees must be at least 0' }),
  CollegeContactNumber: z
    .string()
    .min(10, { message: 'Please enter a valid 10-digit college contact number' })
    .max(10, { message: 'Please enter a valid 10-digit college contact number' })
    .regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit college contact number'),
  Achievement: z.string().optional(),
});

export const pucFormat11BankDetailsSchema = z.object({
  AccountHolderName: z
    .string()
    .min(1, { message: 'Bank account holder name is required' }),
  AccountNumber: z
    .string()
    .min(1, { message: 'Bank account number is required' }),
  IFSCCode: z
    .string()
    .min(1, { message: 'IFSC code is required' })
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: 'Please enter a valid 11-character IFSC code (e.g. SBIN0001234)' }),
  BankName: z
    .string()
    .min(1, { message: 'Bank name is required' }),
  BranchName: z
    .string()
    .min(1, { message: 'Bank branch name is required' }),
});

export const pucFormat11DocumentDetailsSchema = z.object({
  StudentSelfie: z.custom<UploadedDocument>().optional(),
  SSLCMarksCard: z.custom<UploadedDocument>().optional(),
  FeeReceipts: z.custom<UploadedDocument>().optional(),
  BankPassbook: z.custom<UploadedDocument>().optional(),
  AadhaarCard: z.custom<UploadedDocument>().optional(),
});

export type PucFormat11Guidelines = z.infer<typeof pucFormat11GuidelinesSchema>;
export type PucFormat11PersonalDetails = z.infer<typeof pucFormat11PersonalDetailsSchema>;
export type PucFormat11AddressDetails = z.infer<typeof pucFormat11AddressDetailsSchema>;
export type PucFormat11FamilyDetails = z.infer<typeof pucFormat11FamilyDetailsSchema>;
export type PucFormat11AcademicDetails = z.infer<typeof pucFormat11AcademicDetailsSchema>;
export type PucFormat11BankDetails = z.infer<typeof pucFormat11BankDetailsSchema>;
export type PucFormat11DocumentDetails = z.infer<typeof pucFormat11DocumentDetailsSchema>;
