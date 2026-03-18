import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = width - 48; // Full width minus padding

export const styles = StyleSheet.create({
  scroll: {
    flex: 1,
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
    color: "#0A3D33",
    fontWeight: "600",
  },
  editButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0A3D33",
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
    color: "#fff",
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
    color: "#0A3D33",
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
  heroPlaceholderLabel: {
    fontSize: 16,
    color: "#B0B0B0",
  },
  heroOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
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
    marginBottom: 14,
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
    backgroundColor: "#0A3D33",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  serviceMoreBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
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
    paddingTop: 16,
    backgroundColor: "transparent",
  },
  bottomAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1A1C1E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  bottomAvatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  bottomNavBlock: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#212121",
    borderRadius: 50,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  bottomNavItems: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 24,
  },
  navItemActive: {
    // backgroundColor: "#0A3D33",
  },
  navItemIcon: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  navItemLabel: {
    fontSize: 8,
    color: "#B0B0B0",
  },
  navItemLabelActive: {
    fontSize: 8,
    color: "#33AD78",
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
