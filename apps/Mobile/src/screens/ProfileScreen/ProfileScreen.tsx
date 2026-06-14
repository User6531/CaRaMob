import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useMe } from "../../queries/userQueries";
import { useTheme } from "../../hooks/useTheme";
import { useStatusBar } from "../../hooks/useStatusBar";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./ProfileScreen.styles";
import { ProfileScreenProps } from "../../navigation/types";

const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) return "Не вказано";

  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("380") && digits.length === 12) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }

  return phone.startsWith("+") ? phone : `+${digits}`;
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { logout } = useAuth();
  const { data: meData, isLoading, error, refetch } = useMe();
  const theme = useTheme();

  const handleEditProfile = () => {
    navigation.navigate("ProfileEdit");
  };

  const handleLogout = () => {
    Alert.alert("Вийти з акаунту?", "Ви впевнені, що хочете вийти?", [
      {
        text: "Скасувати",
        style: "cancel",
      },
      {
        text: "Вийти",
        style: "destructive",
        onPress: logout,
      },
    ]);
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
        <TouchableOpacity
          style={globalStyles.buttonPrimary}
          onPress={() => refetch()}
        >
          <Text style={globalStyles.buttonPrimaryText}>Спробувати знову</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const userName = meData?.name || "Користувач";
  const userEmail = meData?.email || "Не вказано";
  const userPhone = formatPhone(meData?.phone);
  const isRegistered = meData?.updatedAt !== null;

  return (
    <>
      {useStatusBar()}
      <ScrollView style={[globalStyles.container, globalStyles.pageBackground]}>
        <View style={styles.content}>
          <View style={[globalStyles.card, styles.header]}>
            {meData?.pictureUrl ? (
              <Image
                source={{ uri: meData.pictureUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>👤</Text>
              </View>
            )}
            <Text style={[globalStyles.textLarge, styles.name]}>
              {userName}
            </Text>
            <Text style={[globalStyles.textSecondary, styles.email]}>
              {userEmail}
            </Text>
            <Text style={[globalStyles.textSecondary, styles.phone]}>
              {userPhone}
            </Text>
          </View>

          <View style={[globalStyles.card, styles.infoSection]}>
            <Text style={[globalStyles.textPrimary, styles.sectionTitle]}>
              Інформація про профіль
            </Text>

            <View style={styles.infoRow}>
              <Text style={[globalStyles.textSecondary, styles.infoLabel]}>
                Статус:
              </Text>
              <Text
                style={[
                  globalStyles.textPrimary,
                  styles.infoValue,
                  {
                    color: isRegistered
                      ? theme.colors.accent.success
                      : theme.colors.accent.warning,
                  },
                ]}
              >
                {isRegistered ? "Зареєстрований" : "Не зареєстрований"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[globalStyles.textSecondary, styles.infoLabel]}>
                Телефон:
              </Text>
              <Text style={[globalStyles.textPrimary, styles.infoValue]}>
                {userPhone}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[globalStyles.textSecondary, styles.infoLabel]}>
                Email:
              </Text>
              <Text style={[globalStyles.textPrimary, styles.infoValue]}>
                {userEmail}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={globalStyles.buttonPrimary}
              onPress={handleEditProfile}
            >
              <Text style={globalStyles.buttonPrimaryText}>
                ✏️ Редагувати профіль
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={globalStyles.buttonDanger}
              onPress={handleLogout}
            >
              <Text style={globalStyles.buttonDangerText}>
                🚪 Вийти з акаунту
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
