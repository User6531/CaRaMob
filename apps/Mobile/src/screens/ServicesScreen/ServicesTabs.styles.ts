import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#1A1C1E",
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  items: {
    flex: 1,
    flexDirection: "row",
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 10,
    backgroundColor: theme.colors.accent.dark,
  },
  tab: {
    flex: 1,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  tabLabel: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: "500",
    textAlign: "center",
  },
  tabLabelActive: {
    fontSize: 13,
    color: theme.colors.accent.primary,
    fontWeight: "600",
    textAlign: "center",
  },
});
