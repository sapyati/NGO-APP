/**
 * PUC Format 1.1 Form Default Values
 */

export const pucFormat11DefaultValues = {
  guidelines: {
    guidelinesAccepted: false,
  },
  personal: {
    Email: '',
    StudentName: '',
    ContactNumber: '',
    AlternateNumber: '',
    Gender: 0,
    DateOfBirth: '',
    Caste: 0,
    Place: 0,
  },
  address: {
    District: 0,
    OtherDistrict: '',
    Taluk: '',
    ResidentialAddress: '',
    PinCode: '',
  },
  family: {
    FatherOccupation: 0,
    MotherOccupation: 0,
    TotalFamilyMembers: 0,
    FamilyAnnualIncome: 0,
    ParentsBankBalance: 0,
  },
  academic: {
    SSLCPercentage: 0,
    CourseJoined: 0,
    CollegeName: '',
    CollegeType: 0,
    CollegeFees: 0,
    CollegeContactNumber: '',
    Achievement: '',
  },
  bank: {
    AccountHolderName: '',
    AccountNumber: '',
    IFSCCode: '',
    BankName: '',
    BranchName: '',
  },
  documents: {},
};
