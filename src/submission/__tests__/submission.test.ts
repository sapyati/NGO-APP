/**
 * Form Submission Unit Tests
 * Tests the payload preparation and submission flow
 */

import { PayanaFormValues, PucFormValues } from '@/types/forms';
import { SemiProfessionalFormValues } from '@/validation/semiProfessionalSchemas';
import { preparePayload } from '../preparePayload';
import { submitApplication } from '../submit';
import { validatePayload } from '../validatePayload';

// Mock the API modules
jest.mock('@/api/professionalApi');
jest.mock('@/api/pucApi');
jest.mock('@/api/semiProfessionalApi');
jest.mock('@/api/payanaApi');

import { createPayanaStudent } from '@/api/payanaApi';
import { createPUCStudent } from '@/api/pucApi';

function formDataKeys(payload: FormData): string[] {
  const anyFd = payload as any;
  if (typeof anyFd.keys === 'function') {
    return Array.from(anyFd.keys() as Iterable<string>);
  }
  if (typeof anyFd.getParts === 'function') {
    return anyFd.getParts().map((p: any) => p.fieldName as string);
  }
  return [];
}

function buildValidPayana(overrides: Partial<PayanaFormValues> = {}): PayanaFormValues {
  return {
    personal: {
      studentName: 'Test Student',
      genderID: 1,
      casteCategoryID: 1,
      dateOfBirth: '2000-01-01',
    },
    contact: {
      email: 'test@test.com',
      contactNumber: '9876543210',
      alternateNumber: '9876543211',
    },
    address: {
      residentialAddress: 'Test Address',
      currentAddress: 'Test Address',
      taluka: 'Test Taluka',
      districtID: 1,
      otherDistrict: '',
      pincode: '560001',
      placeID: 2,
    },
    family: {
      fatherName: 'Test Father',
      motherName: 'Test Mother',
      fatherOccupationID: 1,
      motherOccupationID: 2,
      familyMembers: 4,
      familyIncome: '50000',
      parentBank: '10000',
    },
    category: {
      casteCategoryID: 1,
      houseTypeID: 1,
    },
    academic: {
      courseID: 1,
      collegeName: 'Test College',
      collegeTypeID: 1,
      collegeCNumber: '',
      courseSA: 'Test',
      courseStream: '',
      annualFees: '100000',
      totalExpenses: '150000',
      reference: 'Test Referrer',
      studentAchievements: 'District topper',
      securedPercentage: '85',
    },
    bank: {
      accountHolderName: 'Test Student',
      bankAccountNo: '1234567890',
      ifscCode: 'TEST0001',
      bankName: 'Test Bank',
      branchName: 'Test Branch',
    },
    documents: {
      houseVisitLink: 'https://maps.google.com/test',
    },
    agreement: {
      isAgreed: true,
    },
    ...overrides,
  };
}

function buildValidSemiProfessional(): SemiProfessionalFormValues {
  return {
    personal: {
      email: 'test@test.com',
      studentName: 'Test Student',
      dateOfBirth: '2000-01-01',
      contactNumber: '9876543210',
      alternateNumber: '9876543211',
      genderID: 1,
      casteCategoryID: 1,
      areaTypeID: 1,
      districtID: 1,
      otherDistrict: '',
      residentialAddress: 'Test Address',
      googleMapLink: 'https://maps.google.com/test',
    },
    family: {
      fatherName: 'Test Father',
      motherName: 'Test Mother',
      fatherOccupationID: 1,
      motherOccupationID: 2,
      familyMembers: 4,
      houseTypeID: 1,
      familyIncome: 50000,
    },
    academic: {
      puPercentage: 85,
      cetRank: 1234,
      ptRank: 5678,
      semiProfessionalCourseID: 3,
      courseApplying: 'B.Sc Nursing',
      courseStream: 'Nursing',
    },
    documents: {},
  };
}

function buildValidPucFormat11(overrides: Partial<PucFormValues> = {}): PucFormValues {
  return {
    personal: {
      StudentName: 'Test Student',
      DateOfBirth: '2005-06-15',
      Gender: 1,
      Caste: 2,
      Place: 3,
      ContactNumber: '9876543210',
      AlternateNumber: '9876543211',
      Email: 'test@test.com',
      ResidentialAddress: 'Test Residential Address',
      District: 1,
      OtherDistrict: '',
      Taluk: 'Test Taluk',
      PinCode: '560001',
    },
    contact: {
      Email: 'test@test.com',
      ContactNumber: '9876543210',
      AlternateNumber: '',
    },
    address: {
      District: 1,
      OtherDistrict: '',
      Taluk: 'Test Taluk',
      ResidentialAddress: 'Test Residential Address',
    },
    family: {
      FatherName: 'Test Father',
      MotherName: 'Test Mother',
      FatherOccupation: 1,
      MotherOccupation: 2,
      TotalFamilyMembers: 4,
      FamilyAnnualIncome: 50000,
      HouseTypeID: 1,
      ReferenceSourceID: 1,
    },
    academic: {
      SSLCPercentage: 85,
      CourseJoined: 1,
      CollegeName: 'Test College',
      CollegeType: 1,
      CollegeFees: 25000,
    },
    documents: {},
    ...overrides,
  };
}

describe('Form Submission', () => {
  describe('preparePayload', () => {
    it('should emit Payana multipart fields and files with contract names', () => {
      const mockFormData = buildValidPayana({
        documents: {
          latestMarksCard: {
            file: { uri: 'file://test1.jpg', name: 'marksheet.jpg', type: 'image/jpeg' },
            uploadedAt: new Date().toISOString(),
          },
          studentPassbookFP: {
            file: { uri: 'file://test2.jpg', name: 'passbook.jpg', type: 'image/jpeg' },
            uploadedAt: new Date().toISOString(),
          },
          studentPhoto: {
            file: { uri: 'file://test3.jpg', name: 'photo.jpg', type: 'image/jpeg' },
            uploadedAt: new Date().toISOString(),
          },
          dwellingUnit: {
            file: { uri: 'file://test4.jpg', name: 'house.jpg', type: 'image/jpeg' },
            uploadedAt: new Date().toISOString(),
          },
          aadhaarCard: {
            file: { uri: 'file://test5.jpg', name: 'aadhaar.jpg', type: 'image/jpeg' },
            uploadedAt: new Date().toISOString(),
          },
          houseVisitLink: 'https://maps.google.com/test',
        },
      });

      const payload = preparePayload('payana', mockFormData);
      expect(payload).toBeInstanceOf(FormData);

      const keys = formDataKeys(payload);

      // Required text fields
      expect(keys).toContain('StudentName');
      expect(keys).toContain('ContactNumber');
      expect(keys).toContain('Email');

      // Contract field names (not the old JSON names)
      expect(keys).toContain('AreaTypeID');
      expect(keys).not.toContain('PlaceID');
      expect(keys).toContain('RAddress');
      expect(keys).toContain('CAddress');
      expect(keys).toContain('StudentAchivements');
      expect(keys).toContain('securedPercentage');
      expect(keys).toContain('bankaccountno');
      expect(keys).toContain('ifsccode');

      // Files use exact contract multipart names
      expect(keys).toContain('latestmarkscard');
      expect(keys).toContain('studentpassbookFP');
      expect(keys).toContain('StudentPhoto');
      expect(keys).toContain('dwellingunit');
      expect(keys).toContain('adharcard');
    });

    it('should log missing files for Payana', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

      preparePayload('payana', buildValidPayana({ documents: { houseVisitLink: 'https://maps.google.com/test' } }));

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing file: latestMarksCard')
      );

      consoleSpy.mockRestore();
    });

    it('should emit SemiProfessional multipart fields with contract names', () => {
      const payload = preparePayload('semiProfessional', buildValidSemiProfessional());
      const keys = formDataKeys(payload);

      // Contract fields must be present (aligned with web form)
      expect(keys).toContain('Email');
      expect(keys).toContain('StudentName');
      expect(keys).toContain('DOB');
      expect(keys).toContain('ContactNumber');
      expect(keys).toContain('GenderID');
      expect(keys).toContain('CasteCategoryID');
      expect(keys).toContain('AreaTypeID');
      expect(keys).toContain('DistrictID');
      expect(keys).toContain('OtherDistrict');
      expect(keys).toContain('ResidentialAddress');
      expect(keys).toContain('GoogleMapLink');
      expect(keys).toContain('FatherName');
      expect(keys).toContain('MotherName');
      expect(keys).toContain('FatherOccupationID');
      expect(keys).toContain('MotherOccupationID');
      expect(keys).toContain('FamilyMembers');
      expect(keys).toContain('HouseTypeID');
      expect(keys).toContain('FamilyIncome');
      expect(keys).toContain('PUPercentage');
      expect(keys).toContain('CETRank');
      expect(keys).toContain('PTRank');
      expect(keys).toContain('NEETRank');
      expect(keys).toContain('CourseApplying');
      expect(keys).toContain('CourseStream');

      // Backend SQL required fields must be present
      expect(keys).toContain('DateOfBirth');
      expect(keys).toContain('Address');
      expect(keys).toContain('PlaceID');
      expect(keys).toContain('AnnualIncome');
      expect(keys).toContain('SemiProfessionalCourseID');
      expect(keys).toContain('CollegeName');
      expect(keys).toContain('CollegeTypeID');
      expect(keys).toContain('CollegeFees');
      expect(keys).toContain('HouseVisitLink');
      expect(keys).not.toContain('StudentSelfie');
      expect(keys).not.toContain('CETRankSheet');
      expect(keys).not.toContain('PTRankSheet');
      expect(keys).not.toContain('DwellingUnitPhoto');
      expect(keys).not.toContain('MarksSheet12');
      expect(keys).not.toContain('HouseVideo');
      expect(keys).not.toContain('ElectricityBill');
      expect(keys).not.toContain('RationCard');
    });

    it('should emit SemiProfessional document file keys when documents are provided', () => {
      const data = buildValidSemiProfessional();
      data.documents = {
        studentSelfie: {
          file: { uri: 'file://selfie.jpg', name: 'selfie.jpg', type: 'image/jpeg' },
          uploadedAt: new Date().toISOString(),
        },
        cetRankSheet: {
          file: { uri: 'file://cet.pdf', name: 'cet.pdf', type: 'application/pdf' },
          uploadedAt: new Date().toISOString(),
        },
        ptRankSheet: {
          file: { uri: 'file://pt.pdf', name: 'pt.pdf', type: 'application/pdf' },
          uploadedAt: new Date().toISOString(),
        },
        dwellingUnitPhoto: {
          file: { uri: 'file://house.jpg', name: 'house.jpg', type: 'image/jpeg' },
          uploadedAt: new Date().toISOString(),
        },
        marksSheet12: {
          file: { uri: 'file://marks.jpg', name: 'marks.jpg', type: 'image/jpeg' },
          uploadedAt: new Date().toISOString(),
        },
        houseVideo: {
          file: { uri: 'file://video.mp4', name: 'video.mp4', type: 'video/mp4' },
          uploadedAt: new Date().toISOString(),
        },
        electricityBill: {
          file: { uri: 'file://bill.jpg', name: 'bill.jpg', type: 'image/jpeg' },
          uploadedAt: new Date().toISOString(),
        },
        incomeCertificate: {
          file: { uri: 'file://income.jpg', name: 'income.jpg', type: 'image/jpeg' },
          uploadedAt: new Date().toISOString(),
        },
        rationCard: {
          file: { uri: 'file://ration.jpg', name: 'ration.jpg', type: 'image/jpeg' },
          uploadedAt: new Date().toISOString(),
        },
      };
      const payload = preparePayload('semiProfessional', data);
      const keys = formDataKeys(payload);

      expect(keys).toContain('StudentSelfie');
      expect(keys).toContain('CETRankSheet');
      expect(keys).toContain('PTRankSheet');
      expect(keys).toContain('DwellingUnitPhoto');
      expect(keys).toContain('MarksSheet12');
      expect(keys).toContain('HouseVideo');
      expect(keys).toContain('ElectricityBill');
      expect(keys).toContain('IncomeCertificate');
      expect(keys).toContain('RationCard');
    });

    it('should emit PUC Format 1.1 multipart fields with contract names', () => {
      const mockFormData = buildValidPucFormat11({
        documents: {
          StudentSelfie: {
            file: { uri: 'file://selfie.jpg', name: 'selfie.jpg', type: 'image/jpeg' },
            uploadedAt: new Date().toISOString(),
          },
          SSLCMarksCard: {
            file: { uri: 'file://sslc.jpg', name: 'sslc.jpg', type: 'image/jpeg' },
            uploadedAt: new Date().toISOString(),
          },
          ElectricityBill: {
            file: { uri: 'file://bill.pdf', name: 'bill.pdf', type: 'application/pdf' },
            uploadedAt: new Date().toISOString(),
          },
          RationCard: {
            file: { uri: 'file://ration.jpg', name: 'ration.jpg', type: 'image/jpeg' },
            uploadedAt: new Date().toISOString(),
          },
        },
      });

      const payload = preparePayload('puc', mockFormData);
      expect(payload).toBeInstanceOf(FormData);

      const keys = formDataKeys(payload);

      // Personal fields (contract names, not old names)
      expect(keys).toContain('StudentName');
      expect(keys).toContain('DateOfBirth');
      expect(keys).toContain('Gender');
      expect(keys).toContain('Caste');
      expect(keys).toContain('Place');

      // Contact fields
      expect(keys).toContain('Email');
      expect(keys).toContain('ContactNumber');

      // Address fields (both Format 1.1 and New_Students names for API compatibility)
      expect(keys).toContain('District');
      expect(keys).toContain('Taluk');
      expect(keys).toContain('ResidentialAddress');
      expect(keys).toContain('DistrictID');
      expect(keys).toContain('Taluka');
      expect(keys).toContain('Address');

      // Family fields (both Format 1.1 and New_Students names for API compatibility)
      expect(keys).toContain('FatherOccupation');
      expect(keys).toContain('MotherOccupation');
      expect(keys).toContain('TotalFamilyMembers');
      expect(keys).toContain('FamilyAnnualIncome');
      expect(keys).toContain('FatherOccupationID');
      expect(keys).toContain('MotherOccupationID');
      expect(keys).toContain('FamilyMembers');
      expect(keys).toContain('FamilyIncome');

      // Academic fields (both Format 1.1 and New_Students names for API compatibility)
      expect(keys).toContain('SSLCPercentage');
      expect(keys).toContain('CourseJoined');
      expect(keys).toContain('CollegeType');
      expect(keys).toContain('CollegeFees');
      expect(keys).toContain('CourseID');
      expect(keys).toContain('CollegeTypeID');
      expect(keys).toContain('ExpectedFees');
      expect(keys).toContain('SecuredPercentage');
      expect(keys).not.toContain('CollegeContactNumber');
      expect(keys).not.toContain('Achievement');

      // Bank fields (removed from PUC)
      expect(keys).not.toContain('ParentsBankBalance');
      expect(keys).not.toContain('AccountHolderName');
      expect(keys).not.toContain('AccountNumber');
      expect(keys).not.toContain('IFSCCode');
      expect(keys).not.toContain('BankName');
      expect(keys).not.toContain('BranchName');

      // File fields (both Format 1.1 and New_Students names)
      expect(keys).toContain('StudentSelfie');
      expect(keys).toContain('StudentPhoto');
      expect(keys).toContain('SSLCMarksCard');

      // Removed file fields should NOT be present
      expect(keys).not.toContain('FeeReceipts');
      expect(keys).not.toContain('BankPassbook');
      expect(keys).not.toContain('AadhaarCard');
    });

    it('should log missing files for PUC Format 1.1', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

      preparePayload('puc', buildValidPucFormat11({ documents: {} }));

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing required file: StudentSelfie')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing required file: SSLCMarksCard')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing required file: ElectricityBill')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing required file: RationCard')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing required file: IncomeCertificate')
      );

      consoleSpy.mockRestore();
    });

    it('should emit PUC Format 1.1 multipart fields for internal form', () => {
      const mockFormData = {
        personal: {
          StudentName: 'Deepa C',
          Email: 'deepa@example.com',
          ContactNumber: '9876543210',
          AlternateNumber: '9876543211',
          Gender: 2,
          DateOfBirth: '2008-05-15',
          Caste: 2,
          Place: 1,
        },
        address: {
          District: 1,
          Taluk: 'Dharwad',
          ResidentialAddress: 'Line 1, Dharwad',
          PinCode: '580001',
        },
        family: {
          FatherOccupation: 4,
          MotherOccupation: 3,
          TotalFamilyMembers: 4,
          FamilyAnnualIncome: 120000,
          ParentsBankBalance: 25000,
        },
        academic: {
          SSLCPercentage: 88.5,
          CourseJoined: 2,
          CollegeName: 'Govt PU College',
          CollegeType: 1,
          CollegeFees: 5000,
          CollegeContactNumber: '9876543212',
          Achievement: 'Sports champion',
        },
        bank: {
          AccountHolderName: 'Deepa C',
          AccountNumber: '123456789012',
          IFSCCode: 'SBIN0001234',
          BankName: 'State Bank of India',
          BranchName: 'Dharwad Main',
        },
        documents: {
          StudentSelfie: { file: { uri: 'file://selfie.jpg', name: 'selfie.jpg', type: 'image/jpeg' } },
          SSLCMarksCard: { file: { uri: 'file://sslc.jpg', name: 'sslc.jpg', type: 'image/jpeg' } },
          FeeReceipts: { file: { uri: 'file://fees.jpg', name: 'fees.jpg', type: 'image/jpeg' } },
          BankPassbook: { file: { uri: 'file://passbook.jpg', name: 'passbook.jpg', type: 'image/jpeg' } },
          AadhaarCard: { file: { uri: 'file://aadhaar.jpg', name: 'aadhaar.jpg', type: 'image/jpeg' } },
        },
      };

      const payload = preparePayload('pucFormat11', mockFormData);
      expect(payload).toBeInstanceOf(FormData);

      const keys = formDataKeys(payload);
      expect(keys).toContain('StudentName');
      expect(keys).toContain('Email');
      expect(keys).toContain('ContactNumber');
      expect(keys).toContain('Gender');
      expect(keys).toContain('Caste');
      expect(keys).toContain('Place');
      expect(keys).toContain('District');
      expect(keys).toContain('Taluk');
      expect(keys).toContain('ResidentialAddress');
      expect(keys).toContain('FatherOccupation');
      expect(keys).toContain('MotherOccupation');
      expect(keys).toContain('TotalFamilyMembers');
      expect(keys).toContain('FamilyAnnualIncome');
      expect(keys).toContain('ParentsBankBalance');
      expect(keys).toContain('SSLCPercentage');
      expect(keys).toContain('CourseJoined');
      expect(keys).toContain('CollegeName');
      expect(keys).toContain('CollegeType');
      expect(keys).toContain('CollegeFees');
      expect(keys).toContain('CollegeContactNumber');
      expect(keys).toContain('Achievement');
      expect(keys).toContain('AccountHolderName');
      expect(keys).toContain('AccountNumber');
      expect(keys).toContain('IFSCCode');
      expect(keys).toContain('BankName');
      expect(keys).toContain('BranchName');
      expect(keys).toContain('StudentSelfie');
      expect(keys).toContain('SSLCMarksCard');
      expect(keys).toContain('FeeReceipts');
      expect(keys).toContain('BankPassbook');
      expect(keys).toContain('AadhaarCard');
    });
  });

  describe('validatePayload', () => {
    it('should validate Payana schema successfully', () => {
      const result = validatePayload('payana', buildValidPayana());

      expect(result.success).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should fail Payana validation with missing required fields', () => {
      const invalidPayana = {
        personal: {},
        contact: {},
        address: {},
        family: {},
        category: {},
        academic: {},
        bank: {},
        documents: {},
        agreement: {},
      } as any;

      const result = validatePayload('payana', invalidPayana);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
    });

    it('should validate SemiProfessional schema', () => {
      const result = validatePayload('semiProfessional', buildValidSemiProfessional());

      expect(result.success).toBe(true);
    });

    it('should fail SemiProfessional validation without required occupation IDs', () => {
      const base = buildValidSemiProfessional();
      const invalidSemiPro: SemiProfessionalFormValues = {
        ...base,
        family: { ...base.family, fatherOccupationID: 0, motherOccupationID: 0 },
      };

      const result = validatePayload('semiProfessional', invalidSemiPro);

      expect(result.success).toBe(false);
    });

    it('should validate PUC Format 1.1 schema successfully', () => {
      const result = validatePayload('puc', buildValidPucFormat11());

      expect(result.success).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should fail PUC validation with missing required fields', () => {
      const invalidPuc = {
        personal: {},
        contact: {},
        address: {},
        family: {},
        academic: {},
        bank: {},
        documents: {},
      } as any;

      const result = validatePayload('puc', invalidPuc);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
    });

    it('should fail PUC validation with zero Gender or Caste', () => {
      const base = buildValidPucFormat11();
      const invalidPuc: PucFormValues = {
        ...base,
        personal: { ...base.personal, Gender: 0, Caste: 0 },
      };

      const result = validatePayload('puc', invalidPuc);

      expect(result.success).toBe(false);
    });
  });

  describe('submitApplication', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should route payana form to createPayanaStudent', async () => {
      const mockPayload = new FormData();
      (createPayanaStudent as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Payana student created successfully',
      });

      const result = await submitApplication('payana', mockPayload);

      expect(createPayanaStudent).toHaveBeenCalledWith(mockPayload);
      expect(result.success).toBe(true);
    });

    it('should route puc form to createPUCStudent', async () => {
      const mockPayload = new FormData();
      (createPUCStudent as jest.Mock).mockResolvedValue({
        success: true,
        message: 'PUC student created successfully',
      });

      const result = await submitApplication('puc', mockPayload);

      expect(createPUCStudent).toHaveBeenCalledWith(mockPayload);
      expect(result.success).toBe(true);
    });

    it('should return error for unsupported form type', async () => {
      const mockPayload = new FormData();
      
      const result = await submitApplication('unknown' as any, mockPayload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Unsupported form type');
      }
    });

    it('should handle API errors gracefully', async () => {
      const mockPayload = new FormData();
      (createPayanaStudent as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(submitApplication('payana', mockPayload)).rejects.toThrow('Network error');

      // Verify the thrown error carries a submissionId for UI correlation.
      try {
        await submitApplication('payana', mockPayload);
      } catch (error: any) {
        expect(error.submissionId).toBeDefined();
        expect(error.submissionId).toMatch(/^sub_[0-9a-f]{8}$/);
      }
    });

    it('should normalize areas into places for PUC dropdowns', () => {
      const { normalizePUCDropdowns } = require('@/api/transformers/normalizeDropdowns');
      const apiResponse = {
        success: true,
        areas: [
          { Disabled: false, Group: null, Selected: false, Text: 'Urban', Value: '1' },
          { Disabled: false, Group: null, Selected: false, Text: 'Rural', Value: '2' },
          { Disabled: false, Group: null, Selected: false, Text: 'Semi-Urban', Value: '3' },
        ],
      };
      const normalized = normalizePUCDropdowns(apiResponse);
      expect(normalized.places).toBeDefined();
      expect(normalized.places).toHaveLength(3);
      expect(normalized.places![0]).toEqual({ value: '1', label: 'Urban' });
      expect(normalized.places![1]).toEqual({ value: '2', label: 'Rural' });
      expect(normalized.places![2]).toEqual({ value: '3', label: 'Semi-Urban' });
    });

    it('should allow Expo convertFormDataAsync to process attached files without throwing Unsupported FormDataPart implementation', async () => {
      const { convertFormDataAsync } = require('expo/src/winter/fetch/convertFormData');
      const mockFormData = buildValidPucFormat11({
        documents: {
          StudentSelfie: {
            file: { uri: 'file://selfie.jpg', name: 'selfie.jpg', type: 'image/jpeg' },
            uploadedAt: new Date().toISOString(),
          },
          SSLCMarksCard: {
            file: { uri: 'file://sslc.jpg', name: 'sslc.jpg', type: 'image/jpeg' },
            uploadedAt: new Date().toISOString(),
          },
          ElectricityBill: {
            file: { uri: 'file://bill.pdf', name: 'bill.pdf', type: 'application/pdf' },
            uploadedAt: new Date().toISOString(),
          },
          RationCard: {
            file: { uri: 'file://ration.jpg', name: 'ration.jpg', type: 'image/jpeg' },
            uploadedAt: new Date().toISOString(),
          },
        },
      });

      const payload = preparePayload('puc', mockFormData);
      await expect(convertFormDataAsync(payload)).resolves.toHaveProperty('boundary');
    });
  });
});
