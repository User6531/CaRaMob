import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useMe, useUpdateUserProfile } from '../../queries/userQueries';
import { styles } from './ProfileEditScreen.styles';

interface ProfileEditScreenProps {
  navigation: any;
}

export default function ProfileEditScreen({ navigation }: ProfileEditScreenProps) {
  const { data: meData, isLoading: isLoadingMe } = useMe();
  const updateUserMutation = useUpdateUserProfile();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Завантажуємо дані користувача
  useEffect(() => {
    if (meData) {
      setName(meData.name || '');
      setEmail(meData.email || '');
      setIsLoading(false);
    } else if (!isLoadingMe) {
      setIsLoading(false);
    }
  }, [meData, isLoadingMe]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Помилка', 'Будь ласка, введіть ваше ім\'я');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Помилка', 'Будь ласка, введіть вашу пошту');
      return;
    }

    try {
      const result = await updateUserMutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
      });
      
      console.log('Update result:', result);
      
      Alert.alert(
        'Успішно!',
        'Профіль успішно оновлено',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error updating user profile:', error);
      
      let errorMessage = 'Не вдалося оновити профіль. Спробуйте ще раз.';
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = 'Сесія закінчилася. Будь ласка, увійдіть знову.';
        } else if (error.message.includes('400')) {
          errorMessage = 'Невірні дані. Перевірте правильність введених даних.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Користувач не знайдений.';
        } else if (error.message.includes('409')) {
          errorMessage = 'Користувач з такою поштою вже існує.';
        } else if (error.message.includes('JSON Parse error')) {
          errorMessage = 'Сервер повернув неочікувану відповідь. Спробуйте ще раз.';
        } else {
          errorMessage = `Помилка: ${error.message}`;
        }
      }
      
      Alert.alert('Помилка', errorMessage);
    }
  };

  const handleCancel = () => {
    const hasChanges = name !== (meData?.name || '') || email !== (meData?.email || '');
    
    if (hasChanges) {
      Alert.alert(
        'Скасувати зміни?',
        'Ви вже внесли зміни. Ви впевнені, що хочете скасувати?',
        [
          {
            text: 'Продовжити редагування',
            style: 'cancel'
          },
          {
            text: 'Скасувати',
            style: 'destructive',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  if (isLoading || isLoadingMe) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Завантаження профілю...</Text>
      </View>
    );
  }

  if (!meData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>Не вдалося завантажити дані профілю</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Повернутися</Text>
        </TouchableOpacity>
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
          <Text style={styles.title}>Редагування профілю</Text>
          <Text style={styles.subtitle}>Оновіть інформацію про себе</Text>
        </View>

        <View style={styles.form}>
          {/* Name Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ім&apos;я *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Введіть ваше ім&apos;я"
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
              placeholder="Введіть вашу пошту"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Скасувати</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.saveButton, updateUserMutation.isPending && styles.saveButtonDisabled]} 
              onPress={handleSave}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Зберегти</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
