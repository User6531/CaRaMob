import { Redirect } from "expo-router";

// This is the initial route - redirect to auth/login by default
// The actual navigation logic is handled in _layout.tsx based on auth state
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
