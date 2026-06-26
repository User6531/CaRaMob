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
    marginBottom: 16,
  },
  tabsWrapper: {
    marginBottom: 18,
  },
  listSection: {
    gap: 12,
  },
  emptyCard: {
    backgroundColor: "#1A1C1E",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginTop: 8,
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
    lineHeight: 20,
  },
  regionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(74, 222, 158, 0.1)",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  regionBadgeText: {
    color: theme.colors.accent.primary,
    fontSize: 13,
    fontWeight: "500",
  },
});
