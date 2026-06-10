import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  pageTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  pageSubtitle: {
    color: "#8E8E93",
    fontSize: 14,
    marginBottom: 12,
  },
  topActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 14,
  },
  addButton: {
    backgroundColor: theme.colors.accent.dark,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: theme.colors.accent.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  visitCard: {
    backgroundColor: "#1A1C1E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  visitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 8,
  },
  visitTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  visitDate: {
    color: "#8E8E93",
    fontSize: 12,
  },
  visitDescription: {
    color: "#B0B0B0",
    fontSize: 14,
    marginBottom: 10,
  },
  worksTitle: {
    color: theme.colors.accent.primary,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  workRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    gap: 12,
  },
  workName: {
    color: "#FFFFFF",
    fontSize: 14,
    flex: 1,
  },
  workPrice: {
    color: "#8E8E93",
    fontSize: 13,
  },
  emptyCard: {
    backgroundColor: "#1A1C1E",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginTop: 16,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptyText: {
    color: "#8E8E93",
    fontSize: 14,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  retryButton: {
    marginTop: 16,
  },
});
