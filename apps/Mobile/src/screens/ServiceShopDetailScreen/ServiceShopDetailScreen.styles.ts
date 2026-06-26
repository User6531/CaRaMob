import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  coverWrapper: {
    position: "relative",
    height: 200,
    backgroundColor: "#1A1C1E",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(18, 18, 18, 0.55)",
  },
  coverFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.accent.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  coverFallbackText: {
    color: theme.colors.accent.primary,
    fontSize: 48,
    fontWeight: "700",
  },
  logoWrapper: {
    position: "absolute",
    bottom: -36,
    left: 20,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: theme.colors.background.primary,
    overflow: "hidden",
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 13,
    backgroundColor: "#232527",
  },
  logoFallback: {
    width: 72,
    height: 72,
    borderRadius: 13,
    backgroundColor: theme.colors.accent.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  logoFallbackText: {
    color: theme.colors.accent.primary,
    fontSize: 22,
    fontWeight: "700",
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 4,
  },
  statusOpen: {
    backgroundColor: "rgba(74, 222, 158, 0.12)",
  },
  statusClosed: {
    backgroundColor: "rgba(110, 118, 129, 0.2)",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusDotOpen: {
    backgroundColor: theme.colors.status.online,
  },
  statusDotClosed: {
    backgroundColor: theme.colors.status.offline,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusTextOpen: {
    color: theme.colors.accent.primary,
  },
  statusTextClosed: {
    color: "#8E8E93",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  ratingText: {
    color: "#B0B0B0",
    fontSize: 14,
  },
  section: {
    backgroundColor: "#1A1C1E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  sectionTitle: {
    color: theme.colors.accent.primary,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
  },
  infoRowFirst: {
    borderTopWidth: 0,
    paddingTop: 0,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    color: "#8E8E93",
    fontSize: 12,
  },
  infoValue: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 21,
  },
  infoLink: {
    color: theme.colors.accent.primary,
    fontSize: 15,
    lineHeight: 21,
  },
  description: {
    color: "#B0B0B0",
    fontSize: 14,
    lineHeight: 21,
  },
  tagsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "rgba(74, 222, 158, 0.1)",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(74, 222, 158, 0.15)",
  },
  tagText: {
    color: theme.colors.accent.primary,
    fontSize: 13,
    fontWeight: "500",
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
  },
  hoursRowFirst: {
    borderTopWidth: 0,
  },
  hoursLabel: {
    color: "#8E8E93",
    fontSize: 14,
  },
  hoursValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  socialRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  socialButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.accent.dark,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  actionButtonText: {
    color: theme.colors.accent.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
});
