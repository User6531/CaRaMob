import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';

interface ProfileSetupScreenProps {
  navigation: any;
}

export default function ProfileSetupScreen({ navigation }: ProfileSetupScreenProps) {
  const { getUserProfile } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        console.log('🚀 ProfileSetupScreen: Starting to load user profile...');
        setIsLoadingProfile(true);
        const profile = await getUserProfile();
        console.log('📋 ProfileSetupScreen: Profile received:', profile);
        
        if (profile) {
          const fullName = profile.displayName || `${profile.givenName} ${profile.surname}`.trim() || '';
          const email = profile.mail || profile.userPrincipalName || '';
          const phone = profile.mobilePhone || '';
          
          console.log('📝 Setting form data:', { fullName, email, phone });
          
          setName(fullName);
          setEmail(email);
          setPhone(phone);
          
          if (profile.photo) {
            console.log('📸 Setting profile photo from Microsoft');
            setProfileImage(profile.photo);
          } else {
            console.log('📸 No photo available from Microsoft');
          }
        } else {
          console.log('❌ No profile data received');
        }
      } catch (error) {
        console.error('❌ ProfileSetupScreen: Error loading user profile:', error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [getUserProfile]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleContinue = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Будь ласка, введи своє імʼя');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Будь ласка, введи свою пошту');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Error', 'Будь ласка, введи свій телефон');
      return;
    }

    // TODO: Save profile data to backend
    console.log('Profile data:', { name, email, phone, profileImage });
    
    // Navigate to HomeScreen
    navigation.navigate('Home');
  };

  if (isLoadingProfile) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Завантаження твого профілю...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Давай знайомитись</Text>
          <Text style={styles.subtitle}>Додай інформацію про себе</Text>
        </View>

        <View style={styles.form}>
          {/* Profile Image */}
          <View style={styles.imageSection}>
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>📷</Text>
                  <Text style={styles.placeholderLabel}>Фото</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Name Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Імʼя *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
            />
          </View>

          {/* Email Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Пошта *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Телефон *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Далі</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 116,
    height: 116,
    borderRadius: 58,
  },
  placeholderImage: {
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    marginBottom: 8,
  },
  placeholderLabel: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
