import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1A1C1E",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.accent.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContent: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  vehicleTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  plateBadge: {
    color: theme.colors.accent.primary,
    fontSize: 11,
    fontWeight: "700",
    backgroundColor: theme.colors.accent.dark,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  metaText: {
    color: "#8E8E93",
    fontSize: 12,
  },
  clientText: {
    color: "#B0B0B0",
    fontSize: 12,
  },
  problemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  problemContent: {
    flex: 1,
    gap: 2,
  },
  problemLabel: {
    color: "#8E8E93",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  problemText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "500",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    maxWidth: "62%",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    flexShrink: 1,
  },
  acceptedText: {
    color: "#8E8E93",
    fontSize: 11,
    flexShrink: 0,
  },
  progressSection: {
    gap: 6,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    color: "#8E8E93",
    fontSize: 11,
  },
  progressPercent: {
    color: theme.colors.accent.primary,
    fontSize: 11,
    fontWeight: "600",
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: theme.colors.accent.primary,
  },
});
