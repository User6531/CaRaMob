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
import { useStatusBar } from "../../hooks/useStatusBar";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./LoginScreen.styles";

export default function LoginScreen() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
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
          source={require("../../../assets/images/iconLogin.png")}
          style={styles.logo}
        />

        <Text style={[globalStyles.textLarge, styles.title]}>
          Привіт, готові рухатись?
        </Text>
        <Text style={[globalStyles.textSecondary, styles.subtitle]}>
          Мершій за кермо
        </Text>

        <TouchableOpacity
          style={[globalStyles.buttonPrimary, styles.loginButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text
            style={[globalStyles.buttonPrimaryText, styles.loginButtonText]}
          >
            {loading ? "Вхід..." : "Увійти через Telegram"}
          </Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#0088CC"
            style={styles.loadingIndicator}
          />
        )}
      </View>
    </>
  );
}
