import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import { useStatusBar } from "../../hooks/useStatusBar";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./LoginScreen.styles";

export default function LoginScreen() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login();
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("cancel")) {
        // user cancelled
      } else {
        Alert.alert(
          "Login Failed",
          error instanceof Error
            ? error.message
            : "Failed to login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {useStatusBar()}
      <View
        style={[
          globalStyles.container,
          globalStyles.pageBackground,
          styles.container,
        ]}
      >
        <Image
          source={require("../../../assets/images/icon.png")}
          style={styles.logo}
        />
        <Text style={[globalStyles.textLarge, styles.title]}>
          Ласкаво просимо!
        </Text>
        <Text style={[globalStyles.textSecondary, styles.subtitle]}>
          Увійдіть у свій акаунт
        </Text>

        <TouchableOpacity
          style={[globalStyles.buttonPrimary, styles.loginButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={globalStyles.buttonPrimaryText}>
            {loading ? "Вхід..." : "Увійти через Microsoft"}
          </Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator
            size="large"
            color={theme.colors.accent.primary}
            style={styles.loadingIndicator}
          />
        )}
      </View>
    </>
  );
}
