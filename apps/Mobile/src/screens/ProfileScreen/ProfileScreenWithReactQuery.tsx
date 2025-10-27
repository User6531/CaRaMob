import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useMe, useUpdateUser } from '../../queries/userQueries';

interface ProfileScreenProps {
  navigation: any;
}

export default function ProfileScreenWithReactQuery({ navigation }: ProfileScreenProps) {
  const { logout } = useAuth();
  
  // Використання React Query hooks
  const { data: user, isLoading, error, refetch } = useMe();
  const updateUserMutation = useUpdateUser();

  const handleEditProfile = () => {
    navigation.navigate('ProfileSetup');
  };

  const handleLogout = () => {
    Alert.alert(
      'Вийти з акаунту?',
      'Ви впевнені, що хочете вийти?',
      [
        {
          text: 'Скасувати',
          style: 'cancel'
        },
        {
          text: 'Вийти',
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  const handleUpdateName = () => {
    if (user) {
      updateUserMutation.mutate({
        id: user.id,
        data: { name: 'Оновлене ім\'я' }
      });
    }
  };

  // Показуємо індикатор завантаження
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Завантаження профілю...</Text>
      </View>
    );
  }

  // Показуємо помилку
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Помилка завантаження профілю</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Спробувати знову</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>👤</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Користувач'}</Text>
          <Text style={styles.email}>{user?.email || 'Профіль користувача'}</Text>
        </View>

        {/* Profile Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleEditProfile}
          >
            <Text style={styles.actionButtonText}>Редагувати профіль</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.updateButton]} 
            onPress={handleUpdateName}
            disabled={updateUserMutation.isPending}
          >
            <Text style={styles.actionButtonText}>
              {updateUserMutation.isPending ? 'Оновлення...' : 'Оновити ім\'я'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton]} 
            onPress={handleLogout}
          >
            <Text style={[styles.actionButtonText, styles.logoutButtonText]}>
              Вийти
            </Text>
          </TouchableOpacity>
        </View>

        {/* Debug Info */}
        <View style={styles.debugInfo}>
          <Text style={styles.debugTitle}>Debug Info (React Query):</Text>
          <Text style={styles.debugText}>isLoading: {isLoading ? 'true' : 'false'}</Text>
          <Text style={styles.debugText}>isError: {error ? 'true' : 'false'}</Text>
          <Text style={styles.debugText}>isUpdating: {updateUserMutation.isPending ? 'true' : 'false'}</Text>
          <Text style={styles.debugText}>User ID: {user?.id || 'N/A'}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  placeholderText: {
    fontSize: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  actions: {
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#28a745',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButtonText: {
    color: 'white',
  },
  debugInfo: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});
