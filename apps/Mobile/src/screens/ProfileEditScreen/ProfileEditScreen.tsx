import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useMe, useUpdateUserProfile } from '../../queries/userQueries';

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
    if (meData && meData.userData) {
      setName(meData.userData.name || '');
      setEmail(meData.userData.email || '');
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

    if (!meData?.userData?.id) {
      Alert.alert('Помилка', 'Не вдалося отримати ID користувача');
      return;
    }

    try {
      const result = await updateUserMutation.mutateAsync({
        id: meData.userData.id,
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
    const hasChanges = name !== (meData?.userData?.name || '');
    
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

  if (!meData?.userData) {
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
            <Text style={styles.label}>Ім'я *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Введіть ваше ім'я"
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
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
