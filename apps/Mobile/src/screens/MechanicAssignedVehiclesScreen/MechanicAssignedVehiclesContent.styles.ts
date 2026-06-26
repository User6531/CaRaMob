import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  panel: {
    flex: 1,
    position: "relative",
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  scrollContent: {
    paddingTop: 16,
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
    marginBottom: 14,
    lineHeight: 20,
  },
  summaryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    backgroundColor: "rgba(74, 222, 158, 0.1)",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  summaryBadgeText: {
    color: theme.colors.accent.primary,
    fontSize: 13,
    fontWeight: "500",
  },
  listSection: {
    gap: 12,
  },
  emptyCard: {
    backgroundColor: "#1A1C1E",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    gap: 10,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyText: {
    color: "#8E8E93",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
