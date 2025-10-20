import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login();
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('cancel')) {
        // user cancelled
      } else {
        Alert.alert('Login Failed', error instanceof Error ? error.message : 'Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome Back</Text>
      <Button title={loading ? 'Signing in...' : 'Sign in with Microsoft'} onPress={handleLogin} disabled={loading} />
      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  title: { fontSize: 22, marginVertical: 20 },
  logo: { width: 120, height: 120, marginBottom: 24 },
});