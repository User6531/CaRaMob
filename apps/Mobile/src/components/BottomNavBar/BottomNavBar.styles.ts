import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#212121",
    borderRadius: 50,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  items: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 24,
  },
  itemActive: {},
  label: {
    fontSize: 8,
    color: "#FFFFFF",
  },
  labelActive: {
    fontSize: 8,
    color: theme.colors.accent.primary,
    fontWeight: "600",
  },
});
