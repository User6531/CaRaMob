import React, { useState, useEffect } from "react";
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
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useUpdateUserProfile } from "../../queries/userQueries";
import { styles } from "./ProfileSetupScreen.styles";
import { ProfileSetupScreenProps } from "../../navigation/types";

export default function ProfileSetupScreen({
  navigation,
}: ProfileSetupScreenProps) {
  const { meData } = useAuth();
  const updateUserMutation = useUpdateUserProfile();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    // Завантажуємо дані з meData якщо вони є
    if (meData) {
      setName(meData.name || "");
      setEmail(meData.email || "");
    }
    setIsLoadingProfile(false);
  }, [meData]);

  const handleCancel = () => {
    const hasData = name.trim() || email.trim();

    if (hasData) {
      Alert.alert(
        "Скасувати створення профілю?",
        "Ви вже ввели деякі дані. Ви впевнені, що хочете скасувати?",
        [
          {
            text: "Продовжити редагування",
            style: "cancel",
          },
          {
            text: "Скасувати",
            style: "destructive",
            onPress: () => navigation.navigate("Home"),
          },
        ]
      );
    } else {
      navigation.navigate("Home");
    }
  };

  const handleContinue = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Будь ласка, введи своє імʼя");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Error", "Будь ласка, введи свою пошту");
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
      });

      // Після успішного оновлення профілю переходимо на Home
      navigation.replace("Home");
    } catch (error) {
      console.error("Error updating user profile:", error);

      let errorMessage = "Не вдалося оновити профіль. Спробуйте ще раз.";

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage = "Сесія закінчилася. Будь ласка, увійдіть знову.";
        } else if (error.message.includes("400")) {
          errorMessage = "Невірні дані. Перевірте правильність введених даних.";
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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Давай знайомитись</Text>
          <Text style={styles.subtitle}>Додай інформацію про себе</Text>
        </View>

        <View style={styles.form}>
          {/* Name Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Імʼя *</Text>
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
              style={[
                styles.continueButton,
                updateUserMutation.isPending && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.continueButtonText}>Далі</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
