import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
  },
  tabPanel: {
    flex: 1,
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 12,
    elevation: 16,
  },
  bottomAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#232527",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  bottomAvatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
