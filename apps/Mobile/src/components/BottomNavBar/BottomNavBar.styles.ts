import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#2A2D31",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  items: {
    flex: 1,
    flexDirection: "row",
    position: "relative",
    alignItems: "stretch",
  },
  activeIndicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 24,
    backgroundColor: theme.colors.accent.dark,
  },
  item: {
    flex: 1,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 24,
  },
  label: {
    fontSize: 8,
    color: theme.colors.text.secondary,
  },
  labelActive: {
    fontSize: 8,
    color: theme.colors.accent.primary,
    fontWeight: "600",
  },
});
