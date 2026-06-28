import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { FormScreen } from "../../components/FormScreen";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useTheme } from "../../hooks/useTheme";
import { useMe, useUpdateUserProfile } from "../../queries/userQueries";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./ProfileEditScreen.styles";
import { ProfileEditScreenProps } from "../../navigation/types";
import { formatPhone } from "../ProfileScreen/profileUtils";

export default function ProfileEditScreen({
  navigation,
}: ProfileEditScreenProps) {
  useStatusBar();
  const theme = useTheme();
  const { data: meData, isLoading: isLoadingMe } = useMe();
  const updateUserMutation = useUpdateUserProfile();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (meData) {
      setName(meData.name || "");
      setEmail(meData.email || "");
      setIsLoading(false);
    } else if (!isLoadingMe) {
      setIsLoading(false);
    }
  }, [meData, isLoadingMe]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Помилка", "Будь ласка, введіть ваше ім'я");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Помилка", "Будь ласка, введіть вашу пошту");
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
      });

      Alert.alert("Успішно!", "Профіль успішно оновлено", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      let errorMessage = "Не вдалося оновити профіль. Спробуйте ще раз.";

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage = "Сесія закінчилася. Будь ласка, увійдіть знову.";
        } else if (error.message.includes("400")) {
          errorMessage = "Невірні дані. Перевірте правильність введених даних.";
        } else if (error.message.includes("404")) {
          errorMessage = "Користувач не знайдений.";
        } else if (error.message.includes("409")) {
          errorMessage = "Користувач з такою поштою вже існує.";
        } else if (error.message.includes("JSON Parse error")) {
          errorMessage =
            "Сервер повернув неочікувану відповідь. Спробуйте ще раз.";
        } else {
          errorMessage = `Помилка: ${error.message}`;
        }
      }

      Alert.alert("Помилка", errorMessage);
    }
  };

  const handleCancel = () => {
    const hasChanges =
      name !== (meData?.name || "") || email !== (meData?.email || "");

    if (hasChanges) {
      Alert.alert(
        "Скасувати зміни?",
        "Ви вже внесли зміни. Ви впевнені, що хочете скасувати?",
        [
          { text: "Продовжити редагування", style: "cancel" },
          {
            text: "Скасувати",
            style: "destructive",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  if (isLoading || isLoadingMe) {
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

  if (!meData) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.pageBackground,
          styles.errorContainer,
        ]}
      >
        <Feather name="alert-circle" size={32} color="#8E8E93" />
        <Text style={globalStyles.textPrimary}>
          Не вдалося завантажити дані профілю
        </Text>
        <TouchableOpacity
          style={[globalStyles.buttonPrimary, styles.retryButton]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={globalStyles.buttonPrimaryText}>Повернутися</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isSaving = updateUserMutation.isPending;

  return (
    <FormScreen
      style={[globalStyles.container, globalStyles.pageBackground]}
      contentContainerStyle={styles.contentContainer}
    >
      <Animated.View entering={FadeIn.duration(280)}>
        <Text style={styles.pageTitle}>Редагування</Text>
        <Text style={styles.pageSubtitle}>
          Оновіть ім&apos;я та контактну пошту
        </Text>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(60)}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Особисті дані</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Ім&apos;я *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Введіть ваше ім'я"
              placeholderTextColor="#8E8E93"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Пошта *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              placeholderTextColor="#8E8E93"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Телефон</Text>
            <TextInput
              style={[styles.input, styles.inputReadOnly]}
              value={formatPhone(meData.phone)}
              editable={false}
            />
            <Text style={styles.hint}>
              Номер телефону прив&apos;язаний до акаунту і не редагується тут
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(120)}>
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={theme.colors.text.inverse} />
            ) : (
              <Feather name="check" size={18} color={theme.colors.text.inverse} />
            )}
            <Text style={styles.saveButtonText}>
              {isSaving ? "Збереження..." : "Зберегти зміни"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            <Feather name="x" size={18} color={theme.colors.accent.primary} />
            <Text style={styles.cancelButtonText}>Скасувати</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </FormScreen>
  );
}
