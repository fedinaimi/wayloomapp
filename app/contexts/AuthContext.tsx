import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Simple storage simulation (in real app, use AsyncStorage)
const storage: { [key: string]: string } = {};

// Types
export interface User {
  id: string;
  role: 'patient' | 'caregiver';
  firstName: string;
  lastName?: string;
  phoneNumber: string;
  birthYear?: number; // For patients
  relationship?: string; // For caregivers
  biometricEnabled: boolean;
  createdAt: string;
}

export interface CaregiverLink {
  id: string;
  caregiverId: string;
  patientId: string;
  status: 'pending' | 'active' | 'revoked';
  relationship: string;
  createdAt: string;
  approvedAt?: string;
}

export interface AuthSession {
  deviceId: string;
  lastLogin: string;
  expiresAt: string;
  biometricEnabled: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: AuthSession | null;
  caregiverLinks: CaregiverLink[];
  pendingInvitations: any[];
}

// Actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; session: AuthSession } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_CAREGIVER_LINKS'; payload: CaregiverLink[] }
  | { type: 'ADD_PENDING_INVITATION'; payload: any }
  | { type: 'REMOVE_PENDING_INVITATION'; payload: string }
  | { type: 'UPDATE_SESSION'; payload: Partial<AuthSession> };

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  session: null,
  caregiverLinks: [],
  pendingInvitations: [],
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        session: action.payload.session,
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    
    case 'SET_CAREGIVER_LINKS':
      return { ...state, caregiverLinks: action.payload };
    
    case 'ADD_PENDING_INVITATION':
      return {
        ...state,
        pendingInvitations: [...state.pendingInvitations, action.payload],
      };
    
    case 'REMOVE_PENDING_INVITATION':
      return {
        ...state,
        pendingInvitations: state.pendingInvitations.filter(
          inv => inv.id !== action.payload
        ),
      };
    
    case 'UPDATE_SESSION':
      return {
        ...state,
        session: state.session ? { ...state.session, ...action.payload } : null,
      };
    
    default:
      return state;
  }
}

// Context
interface AuthContextType {
  state: AuthState;
  login: (phoneNumber: string, otpCode: string, role: 'patient' | 'caregiver') => Promise<boolean>;
  logout: () => Promise<void>;
  createPatientAccount: (data: {
    firstName: string;
    birthYear: number;
    phoneNumber: string;
    biometricEnabled: boolean;
  }) => Promise<User>;
  createCaregiverAccount: (data: {
    firstName: string;
    lastName: string;
    relationship: string;
    phoneNumber: string;
    biometricEnabled: boolean;
  }) => Promise<User>;
  sendOTP: (phoneNumber: string) => Promise<boolean>;
  verifyOTP: (phoneNumber: string, code: string) => Promise<boolean>;
  invitePatient: (caregiverId: string, patientPhone: string) => Promise<boolean>;
  approveCaregiverRequest: (linkId: string) => Promise<boolean>;
  revokeCaregiverAccess: (linkId: string) => Promise<boolean>;
  checkSession: () => Promise<boolean>;
  enableBiometric: () => Promise<boolean>;
  disableBiometric: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  USER: '@wayloom_user',
  SESSION: '@wayloom_session',
  CAREGIVER_LINKS: '@wayloom_caregiver_links',
};

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on app start
  useEffect(() => {
    checkSession();
  }, []);

  // Storage helpers (simplified for demo)
  const storeData = async (key: string, value: any) => {
    try {
      storage[key] = JSON.stringify(value);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  const getData = async (key: string) => {
    try {
      const value = storage[key];
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting data:', error);
      return null;
    }
  };

  const clearData = async (key: string) => {
    try {
      delete storage[key];
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  // Auth functions
  const checkSession = async (): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const [user, session] = await Promise.all([
        getData(STORAGE_KEYS.USER),
        getData(STORAGE_KEYS.SESSION),
      ]);

      if (user && session) {
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        
        if (now < expiresAt) {
          // Session is valid
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { user, session } 
          });
          
          // Load caregiver links if user is a caregiver
          if (user.role === 'caregiver') {
            const links = await getData(STORAGE_KEYS.CAREGIVER_LINKS) || [];
            dispatch({ type: 'SET_CAREGIVER_LINKS', payload: links });
          }
          
          return true;
        } else {
          // Session expired
          await logout();
          return false;
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
        return false;
      }
    } catch (error) {
      console.error('Error checking session:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  const sendOTP = async (phoneNumber: string): Promise<boolean> => {
    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would call your auth service
      console.log(`Sending OTP to ${phoneNumber}`);
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  };

  const verifyOTP = async (phoneNumber: string, code: string): Promise<boolean> => {
    try {
      // Simulate API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would verify the code with your auth service
      console.log(`Verifying OTP ${code} for ${phoneNumber}`);
      return code === '123456' || code.length === 6; // Mock verification
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return false;
    }
  };

  const createPatientAccount = async (data: {
    firstName: string;
    birthYear: number;
    phoneNumber: string;
    biometricEnabled: boolean;
  }): Promise<User> => {
    try {
      // Simulate API call to create patient account
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user: User = {
        id: `patient_${Date.now()}`,
        role: 'patient',
        firstName: data.firstName,
        phoneNumber: data.phoneNumber,
        birthYear: data.birthYear,
        biometricEnabled: data.biometricEnabled,
        createdAt: new Date().toISOString(),
      };

      const session: AuthSession = {
        deviceId: `device_${Date.now()}`,
        lastLogin: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        biometricEnabled: data.biometricEnabled,
      };

      // Store data
      await storeData(STORAGE_KEYS.USER, user);
      await storeData(STORAGE_KEYS.SESSION, session);

      // Update state
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, session } });

      return user;
    } catch (error) {
      console.error('Error creating patient account:', error);
      throw error;
    }
  };

  const createCaregiverAccount = async (data: {
    firstName: string;
    lastName: string;
    relationship: string;
    phoneNumber: string;
    biometricEnabled: boolean;
  }): Promise<User> => {
    try {
      // Simulate API call to create caregiver account
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user: User = {
        id: `caregiver_${Date.now()}`,
        role: 'caregiver',
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        relationship: data.relationship,
        biometricEnabled: data.biometricEnabled,
        createdAt: new Date().toISOString(),
      };

      const session: AuthSession = {
        deviceId: `device_${Date.now()}`,
        lastLogin: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        biometricEnabled: data.biometricEnabled,
      };

      // Store data
      await storeData(STORAGE_KEYS.USER, user);
      await storeData(STORAGE_KEYS.SESSION, session);

      // Update state
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, session } });

      return user;
    } catch (error) {
      console.error('Error creating caregiver account:', error);
      throw error;
    }
  };

  const login = async (phoneNumber: string, otpCode: string, role: 'patient' | 'caregiver'): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Verify OTP
      const isValidOTP = await verifyOTP(phoneNumber, otpCode);
      if (!isValidOTP) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return false;
      }

      // Simulate finding existing user or prompting for account creation
      // In a real app, this would check if the phone number has an existing account
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error) {
      console.error('Error logging in:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Clear stored data
      await Promise.all([
        clearData(STORAGE_KEYS.USER),
        clearData(STORAGE_KEYS.SESSION),
        clearData(STORAGE_KEYS.CAREGIVER_LINKS),
      ]);

      // Update state
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const invitePatient = async (caregiverId: string, patientPhone: string): Promise<boolean> => {
    try {
      // Simulate API call to send invitation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`Caregiver ${caregiverId} inviting patient ${patientPhone}`);
      return true;
    } catch (error) {
      console.error('Error inviting patient:', error);
      return false;
    }
  };

  const approveCaregiverRequest = async (linkId: string): Promise<boolean> => {
    try {
      // Simulate API call to approve caregiver
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Approving caregiver request ${linkId}`);
      return true;
    } catch (error) {
      console.error('Error approving caregiver:', error);
      return false;
    }
  };

  const revokeCaregiverAccess = async (linkId: string): Promise<boolean> => {
    try {
      // Simulate API call to revoke access
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Revoking caregiver access ${linkId}`);
      return true;
    } catch (error) {
      console.error('Error revoking caregiver access:', error);
      return false;
    }
  };

  const enableBiometric = async (): Promise<boolean> => {
    try {
      // In a real app, this would enable biometric authentication
      const updatedSession = { ...state.session, biometricEnabled: true };
      await storeData(STORAGE_KEYS.SESSION, updatedSession);
      dispatch({ type: 'UPDATE_SESSION', payload: { biometricEnabled: true } });
      return true;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      return false;
    }
  };

  const disableBiometric = async (): Promise<boolean> => {
    try {
      // In a real app, this would disable biometric authentication
      const updatedSession = { ...state.session, biometricEnabled: false };
      await storeData(STORAGE_KEYS.SESSION, updatedSession);
      dispatch({ type: 'UPDATE_SESSION', payload: { biometricEnabled: false } });
      return true;
    } catch (error) {
      console.error('Error disabling biometric:', error);
      return false;
    }
  };

  const contextValue: AuthContextType = {
    state,
    login,
    logout,
    createPatientAccount,
    createCaregiverAccount,
    sendOTP,
    verifyOTP,
    invitePatient,
    approveCaregiverRequest,
    revokeCaregiverAccess,
    checkSession,
    enableBiometric,
    disableBiometric,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}