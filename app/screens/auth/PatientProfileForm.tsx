import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WellnessTheme } from '../../utils/wellnessTheme';

// Predefined Lists
const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 
  'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Bolivia', 'Bosnia', 
  'Brazil', 'Bulgaria', 'Cambodia', 'Cameroon', 'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 
  'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Ecuador', 'Egypt', 'Estonia', 'Ethiopia', 
  'Finland', 'France', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Hungary', 'Iceland', 'India', 
  'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kazakhstan', 
  'Kenya', 'Kuwait', 'Latvia', 'Lebanon', 'Libya', 'Lithuania', 'Luxembourg', 'Malaysia', 
  'Mali', 'Malta', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 
  'Oman', 'Pakistan', 'Palestine', 'Panama', 'Peru', 'Philippines', 'Poland', 'Portugal', 
  'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Senegal', 'Serbia', 'Singapore', 'Slovakia', 
  'Slovenia', 'Somalia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Sweden', 
  'Switzerland', 'Syria', 'Taiwan', 'Tanzania', 'Thailand', 'Tunisia', 'Turkey', 'UAE', 
  'Uganda', 'Ukraine', 'United Kingdom', 'United States', 'Uruguay', 'Venezuela', 'Vietnam', 
  'Yemen', 'Zimbabwe'
].sort();

const CHRONIC_DISEASES = [
  { id: 'diabetes', label: 'Diabetes', icon: 'water' },
  { id: 'hypertension', label: 'Hypertension', icon: 'pulse' },
  { id: 'heart', label: 'Heart Disease', icon: 'heart' },
  { id: 'stroke', label: 'Stroke History', icon: 'alert-circle' },
  { id: 'dementia', label: 'Dementia', icon: 'fitness' },
  { id: 'parkinsons', label: "Parkinson's", icon: 'body' },
  { id: 'arthritis', label: 'Arthritis', icon: 'hand-left' },
  { id: 'copd', label: 'COPD', icon: 'wind' },
];

const EDUCATION_LEVELS = [
  'No Formal Education',
  'Primary School',
  'High School',
  'Vocational/Technical',
  'University/Bachelor',
  'Master/PhD',
];

const LANGUAGES = [
  'Arabic', 'Bengali', 'Chinese', 'Dutch', 'English', 'French', 
  'German', 'Greek', 'Hebrew', 'Hindi', 'Italian', 'Japanese',
  'Korean', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 'Russian', 
  'Spanish', 'Swahili', 'Swedish', 'Tamil', 'Thai', 'Turkish', 
  'Urdu', 'Vietnamese'
].sort();

const OCCUPATIONS = [
  'Retired', 'Homemaker', 'Student', 'Teacher', 'Healthcare Worker',
  'Engineer', 'Business Owner', 'Farmer', 'Construction Worker',
  'Administrative', 'Sales/Service', 'Manufacturing',
  'Transportation', 'Professional', 'Other'
].sort();

interface Props {
  navigation: any;
  route: {
    params: {
      phoneNumber: string;
      biometricEnabled: boolean;
    };
  };
}

export default function PatientProfileForm({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { phoneNumber, biometricEnabled } = route.params;
  const scrollRef = useRef<ScrollView>(null);

  // Expanded sections state
  const [expandedSections, setExpandedSections] = useState<string[]>(['personal']);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [chronicDiseases, setChronicDiseases] = useState<string[]>([]);
  const [medications, setMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [visionProblems, setVisionProblems] = useState<'none' | 'mild' | 'moderate' | 'severe' | ''>('');
  const [hearingProblems, setHearingProblems] = useState<'none' | 'mild' | 'moderate' | 'severe' | ''>('');
  const [sleepQuality, setSleepQuality] = useState<'good' | 'fair' | 'poor' | ''>('');
  const [alcoholConsumption, setAlcoholConsumption] = useState<'never' | 'rarely' | 'sometimes' | 'regularly' | ''>('');
  const [smokingStatus, setSmokingStatus] = useState<'never' | 'former' | 'current' | ''>('');
  const [educationLevel, setEducationLevel] = useState('');
  const [languagesSpoken, setLanguagesSpoken] = useState<string[]>([]);
  const [occupation, setOccupation] = useState('');
  const [livingArrangement, setLivingArrangement] = useState<'alone' | 'spouse' | 'children' | 'family' | 'facility' | ''>('');
  const [numberOfChildren, setNumberOfChildren] = useState('');
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'married' | 'divorced' | 'widowed' | ''>('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('');

  // Modal states
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showDiseasesPicker, setShowDiseasesPicker] = useState(false);
  const [showEducationPicker, setShowEducationPicker] = useState(false);
  const [showOccupationPicker, setShowOccupationPicker] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear - 13;

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isSectionComplete = (sectionId: string): boolean => {
    switch (sectionId) {
      case 'personal':
        return firstName.length >= 2 && lastName.length >= 2 && birthYear.length === 4 && gender.length > 0;
      case 'location':
        return country.length > 0 && city.length >= 2;
      case 'health':
        return true; // Optional section
      case 'health_status':
        return visionProblems.length > 0 && hearingProblems.length > 0;
      case 'lifestyle':
        return sleepQuality.length > 0 && alcoholConsumption.length > 0 && smokingStatus.length > 0;
      case 'education':
        return educationLevel.length > 0 && occupation.length > 0;
      case 'family':
        return livingArrangement.length > 0 && maritalStatus.length > 0;
      case 'emergency':
        return emergencyName.length >= 2 && emergencyPhone.length >= 7 && emergencyRelationship.length >= 2;
      default:
        return false;
    }
  };

  const toggleDisease = (diseaseId: string) => {
    setChronicDiseases((prev) =>
      prev.includes(diseaseId) ? prev.filter((d) => d !== diseaseId) : [...prev, diseaseId]
    );
  };

  const toggleLanguage = (lang: string) => {
    setLanguagesSpoken((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const getCompletionPercentage = (): number => {
    const sections = ['personal', 'location', 'health', 'health_status', 'lifestyle', 'education', 'family', 'emergency'];
    const completed = sections.filter(isSectionComplete).length;
    return Math.round((completed / sections.length) * 100);
  };

  const handleSubmit = async () => {
    const requiredSections = ['personal', 'location', 'health_status', 'lifestyle', 'education', 'family', 'emergency'];
    const incomplete = requiredSections.filter(s => !isSectionComplete(s));

    if (incomplete.length > 0) {
      Alert.alert('Incomplete Form', 'Please fill all required sections before submitting.');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const patientData = {
        firstName,
        lastName,
        birthYear: parseInt(birthYear),
        gender,
        country,
        city,
        chronicDiseases,
        medications,
        allergies,
        visionProblems,
        hearingProblems,
        sleepQuality,
        alcoholConsumption,
        smokingStatus,
        educationLevel,
        languagesSpoken,
        occupation,
        livingArrangement,
        numberOfChildren: parseInt(numberOfChildren) || 0,
        maritalStatus,
        emergencyContactName: emergencyName,
        emergencyContactPhone: emergencyPhone,
        emergencyContactRelationship: emergencyRelationship,
        phoneNumber,
        biometricEnabled,
        registeredAt: new Date().toISOString(),
      };

      navigation.navigate('TestReadiness', { patientData });
    } catch (error) {
      Alert.alert('Error', 'Failed to submit form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredItems = (items: string[], search: string) => {
    if (!search) return items;
    return items.filter((item) => item.toLowerCase().includes(search.toLowerCase()));
  };

  const renderSectionHeader = (
    id: string,
    title: string,
    icon: string,
    required: boolean = true
  ) => {
    const isExpanded = expandedSections.includes(id);
    const isComplete = isSectionComplete(id);

    return (
      <TouchableOpacity
        style={[
          styles.sectionHeader,
          isExpanded && styles.sectionHeaderExpanded,
          isComplete && styles.sectionHeaderComplete,
        ]}
        onPress={() => toggleSection(id)}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeaderLeft}>
          <View style={[styles.iconContainer, isComplete && styles.iconContainerComplete]}>
            <Ionicons
              name={isComplete ? 'checkmark' : (icon as any)}
              size={20}
              color={isComplete ? WellnessTheme.colors.success : WellnessTheme.colors.primary}
            />
          </View>
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>
              {title}
              {required && <Text style={styles.requiredStar}> *</Text>}
            </Text>
            {isComplete && (
              <Text style={styles.completedText}>Completed</Text>
            )}
          </View>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={WellnessTheme.colors.textSecondary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={WellnessTheme.colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Complete Your Profile</Text>
            <Text style={styles.headerSubtitle}>{getCompletionPercentage()}% Complete</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${getCompletionPercentage()}%` }]} />
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom, 20) + 80 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Personal Information */}
          {renderSectionHeader('personal', 'Personal Information', 'person')}
          {expandedSections.includes('personal') && (
            <View style={styles.sectionContent}>
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Ahmed"
                    placeholderTextColor={WellnessTheme.colors.textLight}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Khan"
                    placeholderTextColor={WellnessTheme.colors.textLight}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Birth Year</Text>
                <TextInput
                  style={styles.input}
                  value={birthYear}
                  onChangeText={(text) => setBirthYear(text.replace(/\D/g, '').slice(0, 4))}
                  placeholder="1960"
                  placeholderTextColor={WellnessTheme.colors.textLight}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.chipGroup}>
                  {(['male', 'female', 'other'] as const).map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.chip, gender === g && styles.chipActive]}
                      onPress={() => setGender(g)}
                    >
                      <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Location */}
          {renderSectionHeader('location', 'Location', 'location')}
          {expandedSections.includes('location') && (
            <View style={styles.sectionContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Country</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowCountryPicker(true)}
                >
                  <Text style={[styles.pickerText, !country && styles.placeholderText]}>
                    {country || 'Select Country'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={WellnessTheme.colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Cairo"
                  placeholderTextColor={WellnessTheme.colors.textLight}
                />
              </View>
            </View>
          )}

          {/* Health Information */}
          {renderSectionHeader('health', 'Health Information', 'medical', false)}
          {expandedSections.includes('health') && (
            <View style={styles.sectionContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Chronic Diseases (Optional)</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowDiseasesPicker(true)}
                >
                  <Text style={[styles.pickerText, chronicDiseases.length === 0 && styles.placeholderText]}>
                    {chronicDiseases.length > 0 ? `${chronicDiseases.length} selected` : 'Select Diseases'}
                  </Text>
                  <Ionicons name="add-circle-outline" size={20} color={WellnessTheme.colors.primary} />
                </TouchableOpacity>
                {chronicDiseases.length > 0 && (
                  <View style={styles.tagContainer}>
                    {chronicDiseases.map((diseaseId) => {
                      const disease = CHRONIC_DISEASES.find((d) => d.id === diseaseId);
                      return (
                        <View key={diseaseId} style={styles.tag}>
                          <Text style={styles.tagText}>{disease?.label}</Text>
                          <TouchableOpacity onPress={() => toggleDisease(diseaseId)}>
                            <Ionicons name="close-circle" size={16} color={WellnessTheme.colors.error} />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Medications (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={medications}
                  onChangeText={setMedications}
                  placeholder="List your current medications"
                  placeholderTextColor={WellnessTheme.colors.textLight}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Allergies (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={allergies}
                  onChangeText={setAllergies}
                  placeholder="Penicillin, Peanuts"
                  placeholderTextColor={WellnessTheme.colors.textLight}
                />
              </View>
            </View>
          )}

          {/* Health Status */}
          {renderSectionHeader('health_status', 'Health Status', 'eye')}
          {expandedSections.includes('health_status') && (
            <View style={styles.sectionContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vision</Text>
                <View style={styles.chipGroup}>
                  {(['none', 'mild', 'moderate', 'severe'] as const).map((v) => (
                    <TouchableOpacity
                      key={v}
                      style={[styles.chip, visionProblems === v && styles.chipActive]}
                      onPress={() => setVisionProblems(v)}
                    >
                      <Text style={[styles.chipText, visionProblems === v && styles.chipTextActive]}>
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Hearing</Text>
                <View style={styles.chipGroup}>
                  {(['none', 'mild', 'moderate', 'severe'] as const).map((h) => (
                    <TouchableOpacity
                      key={h}
                      style={[styles.chip, hearingProblems === h && styles.chipActive]}
                      onPress={() => setHearingProblems(h)}
                    >
                      <Text style={[styles.chipText, hearingProblems === h && styles.chipTextActive]}>
                        {h.charAt(0).toUpperCase() + h.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Lifestyle */}
          {renderSectionHeader('lifestyle', 'Lifestyle', 'moon')}
          {expandedSections.includes('lifestyle') && (
            <View style={styles.sectionContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sleep Quality</Text>
                <View style={styles.chipGroup}>
                  {(['good', 'fair', 'poor'] as const).map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.chip, sleepQuality === s && styles.chipActive]}
                      onPress={() => setSleepQuality(s)}
                    >
                      <Text style={[styles.chipText, sleepQuality === s && styles.chipTextActive]}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Alcohol Consumption</Text>
                <View style={styles.chipGroup}>
                  {(['never', 'rarely', 'sometimes', 'regularly'] as const).map((a) => (
                    <TouchableOpacity
                      key={a}
                      style={[styles.chip, alcoholConsumption === a && styles.chipActive]}
                      onPress={() => setAlcoholConsumption(a)}
                    >
                      <Text style={[styles.chipText, alcoholConsumption === a && styles.chipTextActive]}>
                        {a.charAt(0).toUpperCase() + a.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Smoking Status</Text>
                <View style={styles.chipGroup}>
                  {(['never', 'former', 'current'] as const).map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.chip, smokingStatus === s && styles.chipActive]}
                      onPress={() => setSmokingStatus(s)}
                    >
                      <Text style={[styles.chipText, smokingStatus === s && styles.chipTextActive]}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Education & Work */}
          {renderSectionHeader('education', 'Education & Work', 'book')}
          {expandedSections.includes('education') && (
            <View style={styles.sectionContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Education Level</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowEducationPicker(true)}
                >
                  <Text style={[styles.pickerText, !educationLevel && styles.placeholderText]}>
                    {educationLevel || 'Select Education'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={WellnessTheme.colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Languages (Optional)</Text>
                <Text style={styles.hint}>Select all languages you speak</Text>
                <View style={styles.languageGrid}>
                  {LANGUAGES.map((lang) => (
                    <TouchableOpacity
                      key={lang}
                      style={[
                        styles.languageChip,
                        languagesSpoken.includes(lang) && styles.languageChipActive
                      ]}
                      onPress={() => toggleLanguage(lang)}
                    >
                      <Text style={[
                        styles.languageChipText,
                        languagesSpoken.includes(lang) && styles.languageChipTextActive
                      ]}>
                        {lang}
                      </Text>
                      {languagesSpoken.includes(lang) && (
                        <Ionicons name="checkmark-circle" size={16} color="white" style={{ marginLeft: 4 }} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Occupation</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowOccupationPicker(true)}
                >
                  <Text style={[styles.pickerText, !occupation && styles.placeholderText]}>
                    {occupation || 'Select Occupation'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={WellnessTheme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Family & Living */}
          {renderSectionHeader('family', 'Family & Living', 'home')}
          {expandedSections.includes('family') && (
            <View style={styles.sectionContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Living Arrangement</Text>
                <View style={styles.chipGroup}>
                  {(['alone', 'spouse', 'children', 'family', 'facility'] as const).map((l) => (
                    <TouchableOpacity
                      key={l}
                      style={[styles.chip, livingArrangement === l && styles.chipActive]}
                      onPress={() => setLivingArrangement(l)}
                    >
                      <Text style={[styles.chipText, livingArrangement === l && styles.chipTextActive]}>
                        {l.charAt(0).toUpperCase() + l.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Marital Status</Text>
                <View style={styles.chipGroup}>
                  {(['single', 'married', 'divorced', 'widowed'] as const).map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.chip, maritalStatus === m && styles.chipActive]}
                      onPress={() => setMaritalStatus(m)}
                    >
                      <Text style={[styles.chipText, maritalStatus === m && styles.chipTextActive]}>
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Number of Children</Text>
                <TextInput
                  style={styles.input}
                  value={numberOfChildren}
                  onChangeText={setNumberOfChildren}
                  placeholder="0"
                  placeholderTextColor={WellnessTheme.colors.textLight}
                  keyboardType="number-pad"
                />
              </View>
            </View>
          )}

          {/* Emergency Contact */}
          {renderSectionHeader('emergency', 'Emergency Contact', 'call')}
          {expandedSections.includes('emergency') && (
            <View style={styles.sectionContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contact Name</Text>
                <TextInput
                  style={styles.input}
                  value={emergencyName}
                  onChangeText={setEmergencyName}
                  placeholder="John Doe"
                  placeholderTextColor={WellnessTheme.colors.textLight}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contact Phone</Text>
                <TextInput
                  style={styles.input}
                  value={emergencyPhone}
                  onChangeText={setEmergencyPhone}
                  placeholder="+1-555-0123"
                  placeholderTextColor={WellnessTheme.colors.textLight}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Relationship</Text>
                <TextInput
                  style={styles.input}
                  value={emergencyRelationship}
                  onChangeText={setEmergencyRelationship}
                  placeholder="Son"
                  placeholderTextColor={WellnessTheme.colors.textLight}
                />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Fixed Submit Button */}
        <View style={[styles.submitContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <TouchableOpacity
            style={[styles.submitButton, getCompletionPercentage() < 100 && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading || getCompletionPercentage() < 100}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Complete Profile</Text>
                <Ionicons name="checkmark-circle" size={24} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Modals */}
      {/* Country Picker */}
      <Modal visible={showCountryPicker} animationType="slide" transparent>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
              <Ionicons name="close" size={24} color={WellnessTheme.colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Country</Text>
            <View style={{ width: 24 }} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search countries..."
            placeholderTextColor={WellnessTheme.colors.textLight}
            value={searchText}
            onChangeText={setSearchText}
          />
          <FlatList
            data={getFilteredItems(COUNTRIES, searchText)}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                  setCountry(item);
                  setShowCountryPicker(false);
                  setSearchText('');
                }}
              >
                <Text style={styles.listItemText}>{item}</Text>
                {item === country && <Ionicons name="checkmark" size={20} color={WellnessTheme.colors.primary} />}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>

      {/* Disease Picker */}
      <Modal visible={showDiseasesPicker} animationType="slide" transparent>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowDiseasesPicker(false)}>
              <Ionicons name="close" size={24} color={WellnessTheme.colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Chronic Diseases</Text>
            <View style={{ width: 24 }} />
          </View>
          <FlatList
            data={CHRONIC_DISEASES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => toggleDisease(item.id)}
              >
                <View style={styles.diseaseItem}>
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={chronicDiseases.includes(item.id) ? WellnessTheme.colors.primary : WellnessTheme.colors.textSecondary}
                    style={{ marginRight: 12 }}
                  />
                  <Text style={styles.listItemText}>{item.label}</Text>
                </View>
                {chronicDiseases.includes(item.id) && (
                  <Ionicons name="checkmark-circle" size={20} color={WellnessTheme.colors.primary} />
                )}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>

      {/* Education Picker */}
      <Modal visible={showEducationPicker} animationType="slide" transparent>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEducationPicker(false)}>
              <Ionicons name="close" size={24} color={WellnessTheme.colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Education Level</Text>
            <View style={{ width: 24 }} />
          </View>
          <FlatList
            data={EDUCATION_LEVELS}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                  setEducationLevel(item);
                  setShowEducationPicker(false);
                }}
              >
                <Text style={styles.listItemText}>{item}</Text>
                {item === educationLevel && <Ionicons name="checkmark" size={20} color={WellnessTheme.colors.primary} />}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>

      {/* Occupation Picker */}
      <Modal visible={showOccupationPicker} animationType="slide" transparent>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowOccupationPicker(false)}>
              <Ionicons name="close" size={24} color={WellnessTheme.colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Occupation</Text>
            <View style={{ width: 24 }} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search occupations..."
            placeholderTextColor={WellnessTheme.colors.textLight}
            value={searchText}
            onChangeText={setSearchText}
          />
          <FlatList
            data={getFilteredItems(OCCUPATIONS, searchText)}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                  setOccupation(item);
                  setShowOccupationPicker(false);
                  setSearchText('');
                }}
              >
                <Text style={styles.listItemText}>{item}</Text>
                {item === occupation && <Ionicons name="checkmark" size={20} color={WellnessTheme.colors.primary} />}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.md,
    backgroundColor: WellnessTheme.colors.cardBackground,
    ...WellnessTheme.shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WellnessTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: WellnessTheme.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: WellnessTheme.colors.primary,
    marginTop: 2,
  },
  progressBarContainer: {
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.md,
    backgroundColor: WellnessTheme.colors.cardBackground,
  },
  progressBar: {
    height: 6,
    backgroundColor: WellnessTheme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: WellnessTheme.colors.primary,
    borderRadius: 3,
  },
  content: {
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingTop: WellnessTheme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.md,
    ...WellnessTheme.shadows.md,
  },
  sectionHeaderExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  sectionHeaderComplete: {
    borderLeftWidth: 4,
    borderLeftColor: WellnessTheme.colors.success,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDD6FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WellnessTheme.spacing.md,
  },
  iconContainerComplete: {
    backgroundColor: '#D1FAE5',
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: WellnessTheme.colors.textPrimary,
  },
  requiredStar: {
    color: WellnessTheme.colors.error,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: WellnessTheme.colors.success,
    marginTop: 2,
  },
  sectionContent: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: WellnessTheme.colors.border,
    borderBottomLeftRadius: WellnessTheme.borderRadius.lg,
    borderBottomRightRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    marginTop: -WellnessTheme.spacing.md,
    marginBottom: WellnessTheme.spacing.md,
    ...WellnessTheme.shadows.md,
  },
  row: {
    flexDirection: 'row',
  },
  inputGroup: {
    marginBottom: WellnessTheme.spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  input: {
    backgroundColor: WellnessTheme.colors.background,
    borderRadius: WellnessTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.md,
    fontSize: 14,
    color: WellnessTheme.colors.textPrimary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: WellnessTheme.spacing.sm,
  },
  chip: {
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    borderRadius: WellnessTheme.borderRadius.full,
    borderWidth: 1.5,
    borderColor: WellnessTheme.colors.border,
    backgroundColor: WellnessTheme.colors.background,
  },
  chipActive: {
    backgroundColor: WellnessTheme.colors.primary,
    borderColor: WellnessTheme.colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
  },
  chipTextActive: {
    color: 'white',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WellnessTheme.colors.background,
    borderRadius: WellnessTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.md,
  },
  pickerText: {
    fontSize: 14,
    color: WellnessTheme.colors.textPrimary,
  },
  placeholderText: {
    color: WellnessTheme.colors.textLight,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: WellnessTheme.spacing.sm,
    marginTop: WellnessTheme.spacing.md,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDD6FE',
    borderRadius: WellnessTheme.borderRadius.md,
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    gap: WellnessTheme.spacing.sm,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: WellnessTheme.colors.primary,
  },
  hint: {
    fontSize: 12,
    fontWeight: '500',
    color: WellnessTheme.colors.textSecondary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: WellnessTheme.spacing.sm,
    marginTop: WellnessTheme.spacing.sm,
  },
  languageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    borderRadius: WellnessTheme.borderRadius.full,
    borderWidth: 1.5,
    borderColor: WellnessTheme.colors.border,
    backgroundColor: WellnessTheme.colors.background,
  },
  languageChipActive: {
    backgroundColor: WellnessTheme.colors.primary,
    borderColor: WellnessTheme.colors.primary,
  },
  languageChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
  },
  languageChipTextActive: {
    color: 'white',
  },
  submitContainer: {
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingTop: WellnessTheme.spacing.md,
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: WellnessTheme.colors.border,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WellnessTheme.colors.primary,
    borderRadius: WellnessTheme.borderRadius.lg,
    paddingVertical: WellnessTheme.spacing.lg,
    gap: WellnessTheme.spacing.sm,
    ...WellnessTheme.shadows.md,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: WellnessTheme.colors.border,
    backgroundColor: WellnessTheme.colors.cardBackground,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: WellnessTheme.colors.textPrimary,
  },
  searchInput: {
    marginHorizontal: WellnessTheme.spacing.lg,
    marginVertical: WellnessTheme.spacing.md,
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.md,
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    fontSize: 14,
    color: WellnessTheme.colors.textPrimary,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: WellnessTheme.colors.border,
  },
  listItemText: {
    fontSize: 14,
    color: WellnessTheme.colors.textPrimary,
  },
  diseaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
