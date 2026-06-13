import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../styles/theme";

const { width } = Dimensions.get("window");
const cardWidth = width - 48; // Full width minus padding

export const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  tabPanel: {
    flex: 1,
    position: "relative",
  },
  tabPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingTop: 16,
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
  subtitle: {
    textAlign: "center",
  },
  carsSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  carsList: {
    paddingBottom: 20,
  },
  carCardWrapper: {
    marginBottom: 16,
  },
  carCard: {
    width: cardWidth,
    backgroundColor: "#1A1C1E",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative",
  },
  carCardContent: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  carImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  carImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 24,
  },
  carInfo: {
    flex: 1,
  },
  carBrand: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  carModel: {
    fontSize: 16,
    color: "#B0B0B0",
    marginBottom: 4,
  },
  carYear: {
    fontSize: 14,
    color: "#B0B0B0",
    marginBottom: 4,
  },
  carPlate: {
    fontSize: 14,
    color: theme.colors.accent.primary,
    fontWeight: "600",
  },
  editButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.accent.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  editButtonText: {
    fontSize: 14,
    color: theme.colors.text.inverse,
  },
  emptyCard: {
    width: cardWidth,
    backgroundColor: "#1A1C1E",
    borderRadius: 12, // Using theme color directly
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.84,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyCardContent: {
    alignItems: "center",
  },
  plusIcon: {
    fontSize: 48,
    color: theme.colors.accent.primary,
    marginBottom: 12,
  },
  emptyCardText: {
    fontSize: 16,
    color: "#B0B0B0",
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#B0B0B0",
    textAlign: "center",
  },
  // Загальний контейнер контенту (відступи з боків як на макеті)
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  // Hero car card (photo + name) — всередині contentContainer
  heroCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "visible",
    backgroundColor: "#1A1C1E",
    zIndex: 40,
  },
  heroSelectBackdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 30,
  },
  heroMedia: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1A1C1E",
  },
  heroImage: {
    width: "100%",
    height: 220,
    backgroundColor: "#121212",
  },
  heroPlaceholder: {
    width: "100%",
    height: 220,
    backgroundColor: "#1A1C1E",
    justifyContent: "center",
    alignItems: "center",
  },
  heroPlaceholderText: {
    fontSize: 48,
    marginBottom: 8,
  },
  heroPlaceholderIcon: {
    marginBottom: 8,
  },
  heroPlaceholderLabel: {
    fontSize: 16,
    color: "#ffffff",
  },
  heroOverlay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderBottomEndRadius: 12,
    borderBottomLeftRadius: 12,
  },
  heroSelectContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    borderBottomEndRadius: 12,
    borderBottomLeftRadius: 12,
  },
  heroTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  heroBrand: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  heroModel: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  heroChevron: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  heroSelectMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "100%",
    marginTop: 12,
    backgroundColor: "#232527",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    paddingVertical: 6,
    borderRadius: 14,
    overflow: "hidden",
    elevation: 6,
  },
  heroSelectItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  heroSelectItemText: {
    fontSize: 14,
    color: "#B0B0B0",
    fontWeight: "500",
  },
  heroSelectItemTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  heroSelectItemPlate: {
    marginTop: 2,
    fontSize: 12,
    color: "#8E8E93",
  },
  heroAddVehicleItem: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  heroAddVehicleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#33AD78",
  },
  // Information block
  infoBlock: {
    backgroundColor: "#1A1C1E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  infoBlockHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoBlockTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  infoEditBtn: {
    padding: 4,
  },
  infoEditIcon: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  infoGrid: {
    flexDirection: "row",
    gap: 24,
  },
  infoCol: {
    flex: 1,
  },
  infoRow: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 6,
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  vinRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  copyBtn: {
    padding: 4,
  },
  copyIcon: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  licensePlateBox: {
    alignSelf: "flex-end",
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#0057B7",
  },
  licensePlateText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#121212",
    letterSpacing: 1,
  },
  // Service history block
  serviceBlock: {
    backgroundColor: "#1A1C1E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  serviceBlockHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  serviceBlockTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  serviceMoreBtn: {
    backgroundColor: theme.colors.accent.dark,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  serviceMoreBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.accent.primary,
  },
  serviceList: {
    gap: 16,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  serviceAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#232527",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  serviceAvatarText: {
    fontSize: 18,
    color: "#B0B0B0",
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  serviceDate: {
    fontSize: 13,
    color: "#8E8E93",
  },
  serviceDesc: {
    fontSize: 13,
    color: "#B0B0B0",
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
