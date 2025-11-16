import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useMe } from '../../queries/userQueries';
import { useAuth } from '../../context/AuthContext';
import { styles } from './UserCheckScreen.styles';
import { UserCheckScreenProps } from '../../navigation/types';

export default function UserCheckScreen({ navigation }: UserCheckScreenProps) {
  const { data: meData, isLoading, error } = useMe();
  const { logout } = useAuth();
  const [showSkipButton, setShowSkipButton] = useState(false);

  useEffect(() => {
    if (meData && !isLoading) {
      // Перевіряємо чи це перший вхід (UpdatedAt === null)
      if (meData.updatedAt === null) {
        // Перший вхід - переходимо на ProfileSetup
        navigation.replace('ProfileSetup');
      } else {
        // Користувач зареєстрований - переходимо на Home
        navigation.replace('Home');
      }
    }
  }, [meData, isLoading, navigation]);

  // Показуємо кнопку "Пропустити" після 3 секунд завантаження
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading && !error) {
        setShowSkipButton(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isLoading, error]);

  // Для розробки - автоматично пропускаємо перевірку якщо API недоступний
  useEffect(() => {
    if (error && error instanceof Error && error.message.includes('Expected JSON response')) {
      // Якщо API повертає HTML, автоматично пропускаємо перевірку
      console.log('API недоступний, автоматично переходимо на ProfileSetup');
      navigation.replace('ProfileSetup');
    }
  }, [error, navigation]);

  useEffect(() => {
    if (error && !isLoading) {
      console.error('Error checking user status:', error);
      
      // Визначаємо тип помилки
      let errorMessage = 'Не вдалося перевірити статус користувача.';
      let buttonText = 'Увійти знову';
      let shouldNavigateToProfileSetup = false;
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          // Користувач не знайдений - це нормально, переходимо на ProfileSetup
          shouldNavigateToProfileSetup = true;
        } else if (error.message.includes('401')) {
          errorMessage = 'Сесія закінчилася. Будь ласка, увійдіть знову.';
        } else if (error.message.includes('Expected JSON response') || error.message.includes('text/html')) {
          errorMessage = 'API сервер недоступний. Перевірте підключення до інтернету або спробуйте пізніше.';
          buttonText = 'Спробувати знову';
        } else if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
          errorMessage = 'Проблема з підключенням до інтернету. Перевірте ваше з\'єднання.';
          buttonText = 'Спробувати знову';
        }
      }
      
      // Якщо це 404, просто переходимо на ProfileSetup без показу Alert
      if (shouldNavigateToProfileSetup) {
        navigation.replace('ProfileSetup');
        return;
      }
      
      // Показуємо повідомлення користувачу
      Alert.alert(
        'Помилка',
        errorMessage,
        [
          {
            text: 'Скасувати',
            style: 'cancel',
            onPress: async () => {
              await logout();
            }
          },
          {
            text: buttonText,
            onPress: async () => {
              if (buttonText === 'Увійти знову') {
                await logout();
              } else {
                // Спробувати знову - просто закриваємо Alert, query автоматично повториться
                // React Query автоматично повторить запит через retry логіку
              }
            }
          }
        ]
      );
    }
  }, [error, isLoading, logout, navigation]);

  const handleSkip = () => {
    Alert.alert(
      'Пропустити перевірку',
      'Ви впевнені, що хочете пропустити перевірку профілю? Це може призвести до проблем з функціональністю додатку.',
      [
        {
          text: 'Скасувати',
          style: 'cancel'
        },
        {
          text: 'Пропустити',
          style: 'destructive',
          onPress: () => navigation.replace('ProfileSetup')
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Перевіряємо ваш профіль...</Text>
      
      {showSkipButton && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Пропустити перевірку</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
