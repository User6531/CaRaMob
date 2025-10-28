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
import { useMe } from '../../queries/userQueries';
import { useTheme } from '../../hooks/useTheme';
import { useStatusBar } from '../../hooks/useStatusBar';
import { globalStyles } from '../../styles/globalStyles';

interface ProfileScreenProps {
  navigation: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { logout } = useAuth();
  const { data: meData, isLoading, error } = useMe();
  const theme = useTheme();

  const handleEditProfile = () => {
    navigation.navigate('ProfileEdit');
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

  if (isLoading) {
    return (
      <View style={[globalStyles.container, globalStyles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.accent.primary} />
        <Text style={globalStyles.loadingText}>Завантаження профілю...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[globalStyles.container, globalStyles.loadingContainer]}>
        <Text style={globalStyles.errorText}>Помилка завантаження профілю</Text>
        <TouchableOpacity style={globalStyles.buttonPrimary} onPress={() => window.location?.reload?.()}>
          <Text style={globalStyles.buttonPrimaryText}>Спробувати знову</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const userName = meData?.userData?.name || 'Користувач';
  const userEmail = meData?.userData?.email || 'Не вказано';
  const isRegistered = meData?.isRegistered || false;

  return (
    <>
      {useStatusBar()}
      <ScrollView style={[globalStyles.container, globalStyles.pageBackground]}>
        <View style={styles.content}>
        {/* Profile Header */}
        <View style={[globalStyles.card, styles.header]}>
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>👤</Text>
          </View>
          <Text style={[globalStyles.textLarge, styles.name]}>{userName}</Text>
          <Text style={[globalStyles.textSecondary, styles.email]}>{userEmail}</Text>
        </View>

        {/* Profile Info */}
        <View style={[globalStyles.card, styles.infoSection]}>
          <Text style={[globalStyles.textPrimary, styles.sectionTitle]}>Інформація про профіль</Text>
          
          <View style={styles.infoRow}>
            <Text style={[globalStyles.textSecondary, styles.infoLabel]}>Статус:</Text>
            <Text style={[globalStyles.textPrimary, styles.infoValue, { 
              color: isRegistered ? theme.colors.accent.success : theme.colors.accent.warning 
            }]}>
              {isRegistered ? 'Зареєстрований' : 'Не зареєстрований'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[globalStyles.textSecondary, styles.infoLabel]}>Email:</Text>
            <Text style={[globalStyles.textPrimary, styles.infoValue]}>
              {userEmail}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[globalStyles.textSecondary, styles.infoLabel]}>ID користувача:</Text>
            <Text style={[globalStyles.textTertiary, styles.userIdText]}>
              {meData?.userData?.id ? meData.userData.id.substring(0, 8) + '...' : 'Не вказано'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={globalStyles.buttonPrimary} onPress={handleEditProfile}>
            <Text style={globalStyles.buttonPrimaryText}>✏️ Редагувати профіль</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={globalStyles.buttonDanger} onPress={handleLogout}>
            <Text style={globalStyles.buttonDangerText}>🚪 Вийти з акаунту</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#30363D', // Using theme color directly
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 40,
    color: '#8B949E', // Using theme color directly
  },
  name: {
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#21262D', // Using theme color directly
  },
  infoLabel: {
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    gap: 12,
  },
  userIdText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
});