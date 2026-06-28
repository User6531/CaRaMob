import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1A1C1E",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardPressed: {
    borderColor: "rgba(74, 222, 158, 0.25)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#232527",
  },
  logoFallback: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: theme.colors.accent.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  logoFallbackText: {
    color: theme.colors.accent.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  statusOpen: {
    backgroundColor: "rgba(74, 222, 158, 0.12)",
  },
  statusClosed: {
    backgroundColor: "rgba(110, 118, 129, 0.2)",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotOpen: {
    backgroundColor: theme.colors.status.online,
  },
  statusDotClosed: {
    backgroundColor: theme.colors.status.offline,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusTextOpen: {
    color: theme.colors.accent.primary,
  },
  statusTextClosed: {
    color: "#8E8E93",
  },
  address: {
    color: "#8E8E93",
    fontSize: 13,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#B0B0B0",
    fontSize: 12,
  },
  metaAccent: {
    color: theme.colors.accent.primary,
    fontSize: 12,
    fontWeight: "500",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tagText: {
    color: "#B0B0B0",
    fontSize: 11,
    fontWeight: "500",
  },
  chevron: {
    position: "absolute",
    right: 14,
    top: "50%",
    marginTop: -8,
  },
});
