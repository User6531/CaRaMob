import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useMe } from "../../queries/userQueries";
import { useTheme } from "../../hooks/useTheme";
import { useStatusBar } from "../../hooks/useStatusBar";
import { usePullToRefresh } from "../../hooks/usePullToRefresh";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./ProfileScreen.styles";
import { ProfileScreenProps } from "../../navigation/types";
import { formatPhone, getProfileInitials } from "./profileUtils";

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  useStatusBar();
  const { logout } = useAuth();
  const { data: meData, isLoading, error, refetch } = useMe();
  const theme = useTheme();

  const refreshProfile = React.useCallback(async () => {
    await refetch();
  }, [refetch]);

  const { isRefreshing, onRefresh } = usePullToRefresh(refreshProfile);

  const handleEditProfile = () => {
    navigation.navigate("ProfileEdit");
  };

  const handleLogout = () => {
    Alert.alert("Вийти з акаунту?", "Ви впевнені, що хочете вийти?", [
      { text: "Скасувати", style: "cancel" },
      { text: "Вийти", style: "destructive", onPress: logout },
    ]);
  };

  if (isLoading) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.pageBackground,
          styles.loadingContainer,
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.accent.primary} />
        <Text style={globalStyles.loadingText}>Завантаження профілю...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.pageBackground,
          styles.errorContainer,
        ]}
      >
        <Feather name="alert-circle" size={32} color="#8E8E93" />
        <Text style={globalStyles.textPrimary}>Помилка завантаження профілю</Text>
        <Text style={globalStyles.textSecondary}>
          {error instanceof Error ? error.message : "Спробуйте ще раз"}
        </Text>
        <TouchableOpacity
          style={[globalStyles.buttonPrimary, styles.retryButton]}
          onPress={() => refetch()}
          activeOpacity={0.8}
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
    <ScrollView
      style={[globalStyles.container, globalStyles.pageBackground, styles.scroll]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.accent.primary}
          colors={[theme.colors.accent.primary]}
        />
      }
    >
      <Animated.View entering={FadeIn.duration(280)}>
        <Text style={styles.pageTitle}>Профіль</Text>
        <Text style={styles.pageSubtitle}>
          Керуйте акаунтом та особистими даними
        </Text>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(60)}>
        <View style={styles.heroCard}>
          <View style={styles.avatarRing}>
            {meData?.pictureUrl ? (
              <Image
                source={{ uri: meData.pictureUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>
                  {getProfileInitials(userName)}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.heroName}>{userName}</Text>

          <View
            style={[
              styles.statusChip,
              isRegistered
                ? styles.statusChipRegistered
                : styles.statusChipPending,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                isRegistered
                  ? styles.statusDotRegistered
                  : styles.statusDotPending,
              ]}
            />
            <Text
              style={[
                styles.statusChipText,
                isRegistered
                  ? styles.statusChipTextRegistered
                  : styles.statusChipTextPending,
              ]}
            >
              {isRegistered ? "Зареєстрований" : "Потрібне налаштування"}
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(120)}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Контакти</Text>

          <View style={styles.infoItem}>
            <View style={styles.infoIconWrap}>
              <Feather name="mail" size={16} color={theme.colors.accent.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userEmail}</Text>
            </View>
          </View>

          <View style={[styles.infoItem, styles.infoItemLast]}>
            <View style={styles.infoIconWrap}>
              <Feather name="phone" size={16} color={theme.colors.accent.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Телефон</Text>
              <Text style={styles.infoValue}>{userPhone}</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(180)}>
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
            activeOpacity={0.85}
          >
            <Feather name="edit-2" size={18} color={theme.colors.text.inverse} />
            <Text style={styles.editButtonText}>Редагувати профіль</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(240)}>
        <View style={styles.dangerSection}>
          <Text style={styles.dangerTitle}>Вихід з акаунту</Text>
          <Text style={styles.dangerText}>
            Ви вийдете з додатку на цьому пристрої. Дані автомобілів залишаться
            на сервері.
          </Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Feather name="log-out" size={16} color="#F85149" />
            <Text style={styles.logoutButtonText}>Вийти з акаунту</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
}
