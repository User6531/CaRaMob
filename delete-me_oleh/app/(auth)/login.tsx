import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login();
      // Navigation is handled automatically by the root layout
    } catch (error: unknown) {
      // User cancelled or error occurred
      if (
        error instanceof Error &&
        error.message &&
        error.message.includes("cancel")
      ) {
        // User cancelled, don't show error
        console.log("User cancelled login");
      } else {
        Alert.alert(
          "Login Failed",
          error instanceof Error
            ? error.message
            : "Failed to login. Please try again.",
          [{ text: "OK" }]
        );
        console.error("Login error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <View style={styles.content}>
        {/* Logo/App Icon */}
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text
          style={[styles.title, { color: Colors[colorScheme ?? "light"].text }]}
        >
          Welcome Back
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: Colors[colorScheme ?? "light"].text + "99" },
          ]}
        >
          Sign in to continue
        </Text>

        {/* Login Button */}
        <TouchableOpacity
          style={[
            styles.loginButton,
            { backgroundColor: Colors[colorScheme ?? "light"].tint },
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Sign in with Microsoft</Text>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <Text
          style={[
            styles.footer,
            { color: Colors[colorScheme ?? "light"].text + "80" },
          ]}
        >
          By signing in, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 48,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 48,
    textAlign: "center",
  },
  loginButton: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 16,
  },
});
