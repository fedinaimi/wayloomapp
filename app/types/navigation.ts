export type RootStackParamList = {
  // Auth Flow
  Welcome: undefined;
  PhoneVerification: { role: 'patient' | 'caregiver' };
  OTPVerification: { role: 'patient' | 'caregiver'; phoneNumber: string };
  PatientProfileForm: { phoneNumber: string; biometricEnabled: boolean };
  TestReadiness: { patientData: any };
  CognitiveTest: { patientData: any };
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
  MainTabs: { patientData?: any } | undefined;
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