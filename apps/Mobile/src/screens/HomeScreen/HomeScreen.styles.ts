import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
  },
  tabPanel: {
    flex: 1,
  },
  tabPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  tabPlaceholderTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  tabPlaceholderText: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
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
  errorStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorMessage: {
    marginBottom: 12,
  },
  retryButtonMargin: {
    marginTop: 16,
  },
});
