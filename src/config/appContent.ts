export const APP_TITLES = {
  dashboard: 'Dashboard',
  applyScholarship: 'Apply Scholarship',
  renewalScholarship: 'Renewal Scholarship',
  houseVisit: 'House Visit',
  approvals: 'Approvals',
  notifications: 'Notifications',
  settings: 'Settings',
  privacyPolicy: 'Privacy Policy',
  termsAndConditions: 'Terms & Conditions',
  renewalPuc: 'Renewal PUC',
  renewalProfessional: 'Renewal Professional',
  renewalPayana: 'Renewal Payana',
  professionalApplication: 'Vidya Poshak Financial Assistance\nApplication form for Engineering and Medical students\n2026-2027',
  pucApplication: 'Vidya Poshak Financial Assistance Application\nfor PUC-I Commerce and Diploma-I Students\n2026-2027',
  semiProfessionalApplication: 'Vidya Poshak Financial Assistance Application form\nfor SemiProfessional (For B.ScNursing, GNM- Nursing, Physiotherapy,\nB.Sc- Agriculture, Veterinary Science & Horticulture)-2026-2027',
  pucFormat11Application: 'Format 1.1 - Student Information Sheet - 2026-2027',
  payanaApplication: 'Payana New Student Application',
  studentRegistration: 'Student Registration',
  newPayana: 'New Payana Application',
} as const;

export const DASHBOARD_MENU_SECTIONS = {
  scholarships: APP_TITLES.applyScholarship,
  renewals: APP_TITLES.renewalScholarship,
  approvals: APP_TITLES.approvals,
} as const;

export const DASHBOARD_MENU_ITEMS = {
  newPayana: {
    label: APP_TITLES.newPayana,
    route: '/form-engine?formType=payana',
  },
  renewalPuc: {
    label: APP_TITLES.renewalPuc,
    route: '/renewal-puc',
  },
  renewalProfessional: {
    label: APP_TITLES.renewalProfessional,
    route: '/renewal-professional',
  },
  renewalPayana: {
    label: APP_TITLES.renewalPayana,
    route: '/renewal-payana',
  },
} as const;
