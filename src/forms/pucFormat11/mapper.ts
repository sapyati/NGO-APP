/**
 * PUC Format 1.1 Form Mapper (After Login)
 * Converts Format 1.1 form state to the multipart contract:
 * POST /api/puc-format1-1/create
 */

import { appendFileToFormData } from '@/submission/attachFiles';
import dayjs from 'dayjs';

function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD');
}

function toString(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '';
  return String(value);
}

function appendIfPresent(
  fd: FormData,
  key: string,
  value: string | number | undefined | null
): void {
  if (value === undefined || value === null || value === '') return;
  fd.append(key, toString(value));
}

export function pucFormat11Mapper(formData: any): FormData {
  const fd = new FormData();

  const personal = formData.personal || {};
  const address = formData.address || {};
  const family = formData.family || {};
  const academic = formData.academic || {};
  const bank = formData.bank || {};
  const documents = formData.documents || {};

  // ── Personal & Contact ────────────────────────────────────────────────
  fd.append('StudentName', personal.StudentName || '');
  fd.append('Email', personal.Email || '');
  fd.append('ContactNumber', personal.ContactNumber || '');
  appendIfPresent(fd, 'AlternateNumber', personal.AlternateNumber);

  if (personal.DateOfBirth) {
    fd.append('DateOfBirth', formatDate(personal.DateOfBirth));
  }
  fd.append('Gender', toString(personal.Gender || 0));
  fd.append('Caste', toString(personal.Caste || 0));
  fd.append('Place', toString(personal.Place || 0));

  // ── Address ───────────────────────────────────────────────────────────
  fd.append('District', toString(address.District || 0));
  appendIfPresent(fd, 'OtherDistrict', address.OtherDistrict);
  fd.append('Taluk', address.Taluk || '');
  fd.append('ResidentialAddress', address.ResidentialAddress || '');
  appendIfPresent(fd, 'PinCode', address.PinCode);

  // ── Family ────────────────────────────────────────────────────────────
  fd.append('FatherOccupation', toString(family.FatherOccupation || 0));
  fd.append('MotherOccupation', toString(family.MotherOccupation || 0));
  fd.append('TotalFamilyMembers', toString(family.TotalFamilyMembers || 0));
  fd.append('FamilyAnnualIncome', toString(family.FamilyAnnualIncome || 0));
  fd.append('ParentsBankBalance', toString(family.ParentsBankBalance || 0));

  // ── Academic ──────────────────────────────────────────────────────────
  fd.append('SSLCPercentage', toString(academic.SSLCPercentage || 0));
  fd.append('CourseJoined', toString(academic.CourseJoined || 0));
  fd.append('CollegeName', academic.CollegeName || '');
  fd.append('CollegeType', toString(academic.CollegeType || 0));
  fd.append('CollegeFees', toString(academic.CollegeFees || 0));
  fd.append('CollegeContactNumber', academic.CollegeContactNumber || '');
  appendIfPresent(fd, 'Achievement', academic.Achievement);

  // ── Student Bank Details ──────────────────────────────────────────────
  fd.append('AccountHolderName', bank.AccountHolderName || '');
  fd.append('AccountNumber', bank.AccountNumber || '');
  fd.append('IFSCCode', bank.IFSCCode || '');
  fd.append('BankName', bank.BankName || '');
  fd.append('BranchName', bank.BranchName || '');

  // ── Mandatory 5 Document Uploads ──────────────────────────────────────
  const fileKeys = [
    'StudentSelfie',
    'SSLCMarksCard',
    'FeeReceipts',
    'BankPassbook',
    'AadhaarCard',
  ];

  for (const key of fileKeys) {
    const doc = documents[key];
    const file = doc && typeof doc === 'object' && 'file' in doc ? (doc as any).file : undefined;
    if (file) {
      appendFileToFormData(fd, key, file);
    } else {
      console.log(`[pucFormat11Mapper] Missing required file: ${key}`);
    }
  }

  return fd;
}
