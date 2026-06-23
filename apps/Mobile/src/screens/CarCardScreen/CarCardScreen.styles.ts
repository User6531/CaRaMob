import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  form: {
    flex: 1,
  },
  stepHeaderContainer: {
    marginBottom: 16,
  },
  stepHeaderTop: {
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
  },
  stepDots: {
    flexDirection: "row",
    gap: 8,
  },
  stepDot: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#30363D",
  },
  stepDotCompleted: {
    backgroundColor: "#2EA043",
  },
  stepDotActive: {
    backgroundColor: "#F2CC60",
  },
  stepCard: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 12,
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  imageContainer: {
    width: 200,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#30363D", // Using theme color directly
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  carImage: {
    width: 196,
    height: 116,
    borderRadius: 10,
  },
  placeholderImage: {
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 32,
    marginBottom: 8,
  },
  placeholderLabel: {
    fontSize: 14,
    color: "#8B949E", // Using theme color directly
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    // Additional input styles if needed
  },
  dateInputText: {
    paddingVertical: 12,
  },
  datePickerModalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  datePickerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  datePickerSheet: {
    backgroundColor: "#161B22",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#30363D",
  },
  datePickerDoneText: {
    color: "#4ade9e",
    fontWeight: "600",
  },
  vinDecodeContainer: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  vinDecodeInput: {
    flex: 1,
  },
  decodeButton: {
    minWidth: 120,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  decodeButtonDisabled: {
    opacity: 0.6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 40,
    gap: 12,
  },
  loadingIndicator: {
    marginTop: 8,
    alignItems: "center",
  },
});
