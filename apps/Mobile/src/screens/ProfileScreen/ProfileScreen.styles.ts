import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  content: {
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#30363D", // Using theme color directly
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 40,
    color: "#8B949E", // Using theme color directly
  },
  name: {
    marginBottom: 4,
    textAlign: "center",
  },
  email: {
    textAlign: "center",
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#21262D", // Using theme color directly
  },
  infoLabel: {
    fontWeight: "500",
  },
  infoValue: {
    flex: 1,
    textAlign: "right",
  },
  buttonContainer: {
    gap: 12,
  },
  userIdText: {
    fontFamily: "monospace",
    fontSize: 12,
  },
});
