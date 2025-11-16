import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  form: {
    flex: 1,
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  imageContainer: {
    width: 200,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#30363D", // Using theme color directly
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  carImage: {
    width: 196,
    height: 116,
    borderRadius: 10,
  },
  placeholderImage: {
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 32,
    marginBottom: 8,
  },
  placeholderLabel: {
    fontSize: 14,
    color: "#8B949E", // Using theme color directly
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    // Additional input styles if needed
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40,
    gap: 8,
  },
});
