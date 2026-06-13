import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    marginVertical: 20,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 32,
    textAlign: "center",
  },
  logo: {
    width: 120,
    height: 160,
    marginBottom: 24,
  },
  loginButton: {
    width: "100%",
    marginBottom: 16,
    backgroundColor: "#0088CC",
  },
  loginButtonText: {
    color: "#FFFFFF",
  },
  loadingIndicator: {
    marginTop: 16,
  },
});
