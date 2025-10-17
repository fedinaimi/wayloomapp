export type RootStackParamList = {
  // New Auth Flow
  Welcome: undefined;
  PhoneVerification: { role: 'patient' | 'caregiver' };
  OTPVerification: { role: 'patient' | 'caregiver'; phoneNumber: string };
  PatientBasics: { phoneNumber: string; biometricEnabled: boolean };
  CaregiverBasics: { phoneNumber: string; biometricEnabled: boolean };
  PatientConnect: { 
    caregiverData: {
      firstName: string;
      lastName: string;
      relationship: string;
      phoneNumber: string;
      biometricEnabled: boolean;
    };
  };
  
  // Original Auth screens (keeping for compatibility)
  SignIn: undefined;
  Consent: undefined;
  
  // Dashboard screens
  CaregiverDashboard: { 
    caregiverData: {
      firstName: string;
      lastName: string;
      relationship: string;
      phoneNumber: string;
      biometricEnabled: boolean;
    };
    pendingPatients?: any[];
  };
  
  // Main app navigation
  MainTabs: undefined;
  CaregiverTabs: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Exercises: undefined;
  Results: undefined;
  Safety: undefined;
  Settings: undefined;
};

export type CaregiverTabParamList = {
  CaregiverHome: undefined;
  CaregiverPatients: undefined;
  CaregiverAlerts: undefined;
  CaregiverReminders: undefined;
  CaregiverSafeZone: undefined;
  CaregiverSettings: undefined;
};