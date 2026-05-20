import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    color: "#8E8E93",
    fontSize: 14,
    marginBottom: 16,
  },
  formCard: {
    backgroundColor: "#1A1C1E",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  label: {
    color: "#8E8E93",
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#232527",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    color: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textarea: {
    minHeight: 92,
    textAlignVertical: "top",
  },
  hint: {
    color: "#8E8E93",
    fontSize: 12,
    marginTop: 4,
  },
  workItem: {
    backgroundColor: "#202224",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 10,
    marginBottom: 10,
  },
  workItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  workItemTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  removeWorkText: {
    color: "#F87171",
    fontSize: 12,
    fontWeight: "600",
  },
  removeWorkTextDisabled: {
    color: "#8E8E93",
  },
  workField: {
    marginBottom: 8,
  },
  addWorkButton: {
    alignSelf: "flex-start",
    backgroundColor: "#002B24",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addWorkButtonText: {
    color: "#4ade9e",
    fontSize: 13,
    fontWeight: "600",
  },
  actions: {
    marginTop: 18,
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
});
