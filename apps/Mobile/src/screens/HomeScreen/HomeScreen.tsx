import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStatusBar } from "../../hooks/useStatusBar";
import { usePullToRefresh } from "../../hooks/usePullToRefresh";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./HomeScreen.styles";
import { HomeScreenProps } from "../../navigation/types";
import { useVehicles, useVehicle, useServiceHistory } from "../../queries";
import { BottomNavBar, BottomNavTab } from "../../components/BottomNavBar";
import { RefreshStatusBar } from "../../components/RefreshStatusBar";
import { ServiceHistoryContent } from "../ServiceHistoryScreen/ServiceHistoryContent";
import { useTheme } from "../../hooks/useTheme";
import { FuelType, TransmissionType, WheelDriveType } from "../../types/api";
import { formatEngineDisplay } from "../../utils/vehicleFormUtils";

const FUEL_LABELS: Record<FuelType, string> = {
  [FuelType.Gasoline]: "Бензин",
  [FuelType.Diesel]: "Дизель",
  [FuelType.Electric]: "Електро",
  [FuelType.Hybrid]: "Гібрид",
  [FuelType.PlugInHybrid]: "Плагін-гібрид",
  [FuelType.Hydrogen]: "Водень",
};

const TRANSMISSION_LABELS: Record<TransmissionType, string> = {
  [TransmissionType.Manual]: "Механіка",
  [TransmissionType.Automatic]: "Автомат",
  [TransmissionType.CVT]: "CVT",
  [TransmissionType.SemiAutomatic]: "Робот",
  [TransmissionType.DualClutch]: "Преселективна",
};

const WHEEL_DRIVE_LABELS: Record<WheelDriveType, string> = {
  [WheelDriveType.FWD]: "Передній 2Х4",
  [WheelDriveType.RWD]: "Задній (RWD)",
  [WheelDriveType.AWD]: "Повний (AWD)",
  [WheelDriveType.FourWD]: "4WD",
};

const SVG_ICON_COLORS = {
  carPlaceholder: "#FFFFFF",
} as const;

const CAR_PLACEHOLDER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420.849 420.849">
  <g>
    <g fill="currentColor">
      <path d="m81.123,216.924c-17.161,0-31.125,13.959-31.125,31.12 0,17.166 13.959,31.131 31.125,31.131 17.155,0 31.12-13.959 31.12-31.131-1.42109e-14-17.156-13.965-31.12-31.12-31.12zm0,44.956c-7.631,0-13.831-6.205-13.831-13.837 0-7.62 6.199-13.825 13.831-13.825 7.626,0 13.825,6.205 13.825,13.825-1.42109e-14,7.626-6.199,13.837-13.825,13.837z"/>
      <path d="m339.65,222.541c-15.612,0-28.308,12.702-28.308,28.308s12.702,28.32 28.308,28.32c15.606,0 28.308-12.713 28.308-28.32s-12.696-28.308-28.308-28.308zm0,39.339c-6.083,0-11.019-4.948-11.019-11.031 0-6.071 4.936-11.019 11.019-11.019 6.071,0 11.019,4.948 11.019,11.019 0,6.083-4.948,11.031-11.019,11.031z"/>
      <rect width="177.544" x="120.497" y="257.375" height="17.295"/>
      <polygon points="415.202,206.405 407.012,198.226 391.371,190.746 285.421,180.705 231.121,141.674 185.461,141.674 127.465,151.541 59.835,182.794 43.699,177.637 0,177.637 0,191.712 13.441,211.877 0,220.981 0,251.67 12.079,263.743 24.303,251.524 17.283,244.504 17.283,230.161 37.354,216.574 22.918,194.926 41.004,194.926 60.976,201.317 132.634,168.201 186.922,158.969 225.55,158.969 279.134,197.475 386.685,207.662 396.883,212.546 399.945,215.596 403.275,226.406 402.012,237.728 391.953,252.84 406.331,262.439 418.736,243.823 420.849,224.736"/>
    </g>
  </g>
</svg>
`;

const EDIT_ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet">
  <path fill="currentColor" d="M 23.90625 3.96875 C 22.859286 3.96875 21.813178 4.3743215 21 5.1875 L 5.40625 20.78125 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 11.21875 26.59375 L 26.8125 11 C 28.438857 9.373643 28.438857 6.813857 26.8125 5.1875 C 25.999322 4.3743215 24.953214 3.96875 23.90625 3.96875 z M 23.90625 5.875 C 24.409286 5.875 24.919428 6.1069285 25.40625 6.59375 C 26.379893 7.567393 26.379893 8.620107 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.893072 6.1069285 23.403214 5.875 23.90625 5.875 z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.533142 22.500659 9.4993415 21.466858 8.21875 20.8125 L 20.3125 8.71875 z M 6.9375 22.4375 C 8.1365842 22.923393 9.0766067 23.863416 9.5625 25.0625 L 6.28125 25.71875 L 6.9375 22.4375 z"/>
</svg>
`;

const SERVICE_ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" preserveAspectRatio="xMidYMid meet">
  <g>
    <g>
      <circle cx="64" cy="115" r="3" fill="currentColor"/>
      <path fill="currentColor" d="M91,29c0-9.6-5.2-18.6-13.5-23.4L77,5.4h-3.5v22.7c-5.6,4.3-13.4,4.3-19,0V5.4H51l-0.5,0.3 C42.2,10.4,37,19.4,37,29c0,0,0,0,0,0l0,0c0,0.4,0,0.9,0,1.3c0,0.2,0,0.3,0,0.5c0,0.3,0,0.5,0.1,0.8c0,0.2,0,0.4,0.1,0.6 c0,0.2,0.1,0.5,0.1,0.7c0,0.2,0.1,0.4,0.1,0.7c0,0.2,0.1,0.4,0.1,0.6c0,0.2,0.1,0.5,0.2,0.7c0,0.2,0.1,0.4,0.1,0.6 c0.1,0.2,0.1,0.5,0.2,0.7c0,0.2,0.1,0.3,0.1,0.5c0.1,0.3,0.2,0.5,0.2,0.8c0,0.1,0.1,0.3,0.1,0.4c0.1,0.3,0.2,0.6,0.3,0.8 c0,0.1,0.1,0.2,0.1,0.3c0.1,0.3,0.3,0.6,0.4,0.9c0,0.1,0.1,0.1,0.1,0.2c0.2,0.4,0.3,0.7,0.5,1.1c0,0,0,0,0,0 c1.4,2.7,3.2,5.1,5.4,7.2l1.2,1.3c3.8,3.9,6.4,14.1,6.4,20.8V115c0,6.1,4.9,11,11,11s11-4.9,11-11V70.6c0-6.7,2.6-16.9,6.4-20.8 l1.2-1.3c2.2-2.1,4-4.5,5.4-7.2c0,0,0,0,0,0c0.2-0.3,0.4-0.7,0.5-1.1c0-0.1,0.1-0.1,0.1-0.2c0.1-0.3,0.3-0.6,0.4-0.9 c0-0.1,0.1-0.2,0.1-0.3c0.1-0.3,0.2-0.6,0.3-0.8c0.1-0.1,0.1-0.3,0.2-0.4c0.1-0.3,0.2-0.5,0.2-0.8c0.1-0.2,0.1-0.3,0.1-0.5 c0.1-0.2,0.1-0.5,0.2-0.7c0-0.2,0.1-0.4,0.1-0.6c0.1-0.2,0.1-0.5,0.2-0.7c0-0.2,0.1-0.4,0.1-0.6c0-0.2,0.1-0.4,0.1-0.7 c0-0.2,0.1-0.5,0.1-0.7c0-0.2,0.1-0.4,0.1-0.6c0-0.3,0-0.5,0.1-0.8c0-0.2,0-0.3,0-0.5C91,29.9,91,29.4,91,29L91,29 C91,29,91,29,91,29C91,29,91,29,91,29L91,29L91,29z M50.5,10.4v19.5l0.7,0.6c3.7,3.2,8.2,4.8,12.8,4.8c4.6,0,9.1-1.6,12.8-4.7 l0.7-0.6V10.4C83.4,14.7,87,21.6,87,29c0,0.7,0,1.4-0.1,2.1c0,0,0,0.1,0,0.1c-0.1,0.7-0.2,1.4-0.3,2c0,0.1,0,0.1,0,0.2 c-0.1,0.7-0.3,1.3-0.5,2c0,0,0,0.1,0,0.1c-0.2,0.7-0.4,1.3-0.7,2c0,0,0,0,0,0.1c-1.1,2.7-2.7,5.1-4.7,7.3l-0.9,0.9 C75.6,49.6,70.1,52,64,52c-6.1,0-11.6-2.4-15.7-6.2l-0.9-0.9c-2-2.1-3.6-4.6-4.7-7.3c0,0,0,0,0-0.1c-0.3-0.6-0.5-1.3-0.7-2 c0,0,0-0.1,0-0.1c-0.2-0.6-0.3-1.3-0.5-2c0-0.1,0-0.1,0-0.2c-0.1-0.7-0.2-1.3-0.3-2c0,0,0-0.1,0-0.1C41,30.4,41,29.7,41,29 C41,21.6,44.6,14.7,50.5,10.4z M71,70.6V115c0,3.9-3.1,7-7,7s-7-3.1-7-7V70.6c0-4.3-1.1-11.1-3.4-16.7C56.8,55.3,60.3,56,64,56 s7.2-0.7,10.4-2.1C72.1,59.5,71,66.4,71,70.6z"/>
    </g>
  </g>
</svg>
`;

function formatVinShort(vin: string) {
  if (vin.length <= 11) return vin;
  return `${vin.slice(0, 4)}...${vin.slice(-4)}`;
}

function formatServiceDate(date: string) {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return parsedDate.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  useStatusBar();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<
    string | undefined
  >(undefined);
  const [isVehicleSelectOpen, setIsVehicleSelectOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<BottomNavTab>("garage");
  const {
    data: vehicles = [],
    isLoading: isLoadingList,
    isError,
    error,
    refetch: refetchVehicles,
  } = useVehicles();

  React.useEffect(() => {
    if (!vehicles.length) {
      setSelectedVehicleId(undefined);
      setIsVehicleSelectOpen(false);
      return;
    }

    const selectedExists = selectedVehicleId
      ? vehicles.some((vehicle) => vehicle.id === selectedVehicleId)
      : false;

    if (!selectedExists) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);

  const activeVehicleId = selectedVehicleId ?? vehicles[0]?.id;
  const selectedVehicle =
    vehicles.find((vehicle) => vehicle.id === activeVehicleId) ?? vehicles[0];

  const {
    data: car,
    isLoading: isLoadingCar,
    refetch: refetchCar,
  } = useVehicle(activeVehicleId);
  const { data: serviceHistory = [] } = useServiceHistory(activeVehicleId);
  const recentServiceHistory = serviceHistory.slice(0, 3);

  const handleCopyVin = () => {
    if (car?.vin) {
      Alert.alert("VIN-код", car.vin, [{ text: "OK" }]);
    }
  };

  const refreshGarageData = React.useCallback(async () => {
    await Promise.all([
      refetchVehicles(),
      activeVehicleId ? refetchCar() : Promise.resolve(),
    ]);
  }, [refetchVehicles, refetchCar, activeVehicleId]);

  const { isRefreshing: isGarageRefreshing, onRefresh: handleGarageRefresh } =
    usePullToRefresh(refreshGarageData);

  const openServiceHistory = () => {
    if (!activeVehicleId) {
      Alert.alert(
        "Немає автомобіля",
        "Додайте авто, щоб переглядати історію обслуговування."
      );
      return;
    }

    setActiveTab("history");
  };

  const handleTabPress = (tab: BottomNavTab) => {
    if (tab === "history") {
      openServiceHistory();
      return;
    }

    setActiveTab(tab);
  };

  if (isLoadingList && !vehicles.length) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.pageBackground,
          globalStyles.loadingContainer,
          { paddingTop: insets.top },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.accent.primary} />
        <Text style={globalStyles.loadingText}>Завантаження...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.pageBackground,
          { paddingTop: insets.top },
        ]}
      >
        <View style={styles.header}>
          <Text style={[globalStyles.textLarge, styles.title]}>
            Ласкаво просимо до CARa{" "}
            <SvgXml
              xml={CAR_PLACEHOLDER_SVG}
              width={44}
              height={44}
              color={SVG_ICON_COLORS.carPlaceholder}
              style={styles.heroPlaceholderIcon}
            />
          </Text>
        </View>
        <View style={styles.errorStateContainer}>
          <Text style={[globalStyles.textPrimary, styles.errorMessage]}>
            Не вдалося завантажити список авто
          </Text>
          <Text style={globalStyles.textSecondary}>
            {error instanceof Error ? error.message : "Помилка мережі"}
          </Text>
          <TouchableOpacity
            style={[globalStyles.buttonPrimary, styles.retryButtonMargin]}
            onPress={() => refetchVehicles()}
          >
            <Text style={globalStyles.buttonPrimaryText}>Повторити</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const hasVehicle = vehicles.length > 0;
  const showCarContent = hasVehicle && car && !isLoadingCar;
  const heroPhotoUrl = car?.photoUrl ?? selectedVehicle?.photoUrl ?? null;
  const heroBrand = car?.brand ?? selectedVehicle?.brand ?? "";
  const heroModel = car?.model ?? selectedVehicle?.model ?? "";
  const vehicleTitle = `${heroBrand} ${heroModel}`.trim();
  const scrollTopInset = 16 + insets.top;
  const scrollBottomPadding = 120 + insets.bottom;

  const renderTabPlaceholder = (title: string) => (
    <View
      style={[
        styles.tabPlaceholder,
        { paddingTop: scrollTopInset, paddingBottom: scrollBottomPadding },
      ]}
    >
      <Text style={styles.tabPlaceholderTitle}>{title}</Text>
      <Text style={styles.tabPlaceholderText}>Розділ у розробці</Text>
    </View>
  );

  return (
    <View style={[globalStyles.container, globalStyles.pageBackground]}>
      <View style={styles.tabContent}>
        {activeTab === "garage" ? (
          <View style={styles.tabPanel}>
            <RefreshStatusBar visible={isGarageRefreshing} />
            <ScrollView
              style={styles.scroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.contentContainer,
                { paddingBottom: scrollBottomPadding },
              ]}
              refreshControl={
                <RefreshControl
                  refreshing={isGarageRefreshing}
                  onRefresh={handleGarageRefresh}
                  tintColor={theme.colors.accent.primary}
                  colors={[theme.colors.accent.primary]}
                  progressViewOffset={insets.top}
                />
              }
            >
              <View
                style={[styles.scrollContent, { paddingTop: scrollTopInset }]}
              >
                {isVehicleSelectOpen && (
                  <TouchableOpacity
                    style={styles.heroSelectBackdrop}
                    activeOpacity={1}
                    onPress={() => setIsVehicleSelectOpen(false)}
                  />
                )}

                {/* Hero: car photo + name */}
                <View style={styles.heroCard}>
                  {hasVehicle ? (
                    <>
                      <View style={styles.heroMedia}>
                        {heroPhotoUrl ? (
                          <TouchableOpacity
                            onPress={() =>
                              activeVehicleId &&
                              navigation.navigate("CarDetails", {
                                carId: activeVehicleId,
                              })
                            }
                            activeOpacity={0.9}
                          >
                            <Image
                              source={{ uri: heroPhotoUrl }}
                              style={styles.heroImage}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.heroPlaceholder}>
                            <SvgXml
                              xml={CAR_PLACEHOLDER_SVG}
                              width={44}
                              height={44}
                              color={theme.colors.accent.primary}
                              style={styles.heroPlaceholderIcon}
                            />
                            <Text style={styles.heroPlaceholderLabel}>
                              Фото автомобіля
                            </Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.heroSelectContainer}>
                        <TouchableOpacity
                          style={styles.heroOverlay}
                          onPress={() =>
                            setIsVehicleSelectOpen((prev) => !prev)
                          }
                          activeOpacity={0.85}
                        >
                          <View style={styles.heroTitleRow}>
                            <Text style={styles.heroBrand}>{heroBrand}</Text>
                            <Text style={styles.heroModel}>{heroModel}</Text>
                          </View>
                          <Text style={styles.heroChevron}>
                            {isVehicleSelectOpen ? "▲" : "▼"}
                          </Text>
                        </TouchableOpacity>

                        {isVehicleSelectOpen && (
                          <View style={styles.heroSelectMenu}>
                            {vehicles.map((vehicle) => {
                              const isSelected = vehicle.id === activeVehicleId;

                              return (
                                <TouchableOpacity
                                  key={vehicle.id}
                                  style={styles.heroSelectItem}
                                  onPress={() => {
                                    setSelectedVehicleId(vehicle.id);
                                    setIsVehicleSelectOpen(false);
                                  }}
                                  activeOpacity={0.8}
                                >
                                  <Text
                                    style={[
                                      styles.heroSelectItemText,
                                      isSelected &&
                                        styles.heroSelectItemTextActive,
                                    ]}
                                  >
                                    {vehicle.brand} {vehicle.model}
                                  </Text>
                                  <Text style={styles.heroSelectItemPlate}>
                                    {vehicle.licensePlate}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}

                            <TouchableOpacity
                              style={styles.heroAddVehicleItem}
                              onPress={() => {
                                setIsVehicleSelectOpen(false);
                                navigation.navigate("CarCard");
                              }}
                              activeOpacity={0.8}
                            >
                              <Text style={styles.heroAddVehicleText}>
                                + Додати авто
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={styles.heroPlaceholder}
                      onPress={() => navigation.navigate("CarCard")}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.heroPlaceholderText}>+</Text>
                      <Text style={styles.heroPlaceholderLabel}>
                        Додати автомобіль
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {showCarContent && (
                  <>
                    {/* Information block */}
                    <View style={styles.infoBlock}>
                      <View style={styles.infoBlockHeader}>
                        <Text style={styles.infoBlockTitle}>Інформація</Text>
                        <TouchableOpacity
                          style={styles.infoEditBtn}
                          onPress={() =>
                            activeVehicleId &&
                            navigation.navigate("CarEdit", {
                              carId: activeVehicleId,
                            })
                          }
                        >
                          <SvgXml
                            xml={EDIT_ICON_SVG}
                            width={18}
                            height={18}
                            color={theme.colors.accent.primary}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.infoGrid}>
                        <View style={styles.infoCol}>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Рік</Text>
                            <Text style={styles.infoValue}>{car.year}</Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Пробіг</Text>
                            <Text style={styles.infoValue}>
                              {car.mileage.toLocaleString("uk-UA")} км
                            </Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Кузов</Text>
                            <Text style={styles.infoValue}>—</Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Колір</Text>
                            <View style={styles.colorRow}>
                              <View
                                style={[
                                  styles.colorSwatch,
                                  {
                                    backgroundColor: car.color
                                      ? car.color.startsWith("#")
                                        ? car.color
                                        : `#${car.color}`
                                      : "#808080",
                                  },
                                ]}
                              />
                              <Text style={styles.infoValue}>
                                {car.color
                                  ? car.color.replace("#", "").toUpperCase()
                                  : "—"}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>VIN-код</Text>
                            <View style={styles.vinRow}>
                              <Text style={styles.infoValue}>
                                {formatVinShort(car.vin)}
                              </Text>
                              <TouchableOpacity
                                style={styles.copyBtn}
                                onPress={handleCopyVin}
                              >
                                <Feather
                                  name="copy"
                                  size={16}
                                  color={theme.colors.accent.primary}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                        <View style={styles.infoCol}>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Двигун</Text>
                            <Text style={styles.infoValue}>
                              {formatEngineDisplay(
                                car.engineCapacity,
                                car.enginePower,
                                car.fuelType as FuelType
                              )}
                            </Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Тип палива</Text>
                            <Text style={styles.infoValue}>
                              {FUEL_LABELS[car.fuelType as FuelType] ??
                                car.fuelType}
                            </Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>КПП</Text>
                            <Text style={styles.infoValue}>
                              {TRANSMISSION_LABELS[
                                car.transmissionType as TransmissionType
                              ] ?? car.transmissionType}
                            </Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Тип приводу</Text>
                            <Text style={styles.infoValue}>
                              {WHEEL_DRIVE_LABELS[
                                car.wheelDriveType as WheelDriveType
                              ] ?? car.wheelDriveType}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.licensePlateBox}>
                        <Text style={styles.licensePlateText}>
                          {car.licensePlate}
                        </Text>
                      </View>
                    </View>

                    {/* Service history block (mock data) */}
                    <View style={styles.serviceBlock}>
                      <View style={styles.serviceBlockHeader}>
                        <Text style={styles.serviceBlockTitle}>Історія</Text>
                        <TouchableOpacity
                          style={styles.serviceMoreBtn}
                          onPress={openServiceHistory}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.serviceMoreBtnText}>
                            Більше &gt;
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.serviceList}>
                        {recentServiceHistory.map((item) => (
                          <View key={item.id} style={styles.serviceItem}>
                            <View style={styles.serviceAvatar}>
                              <SvgXml
                                xml={SERVICE_ICON_SVG}
                                width={18}
                                height={18}
                                color={theme.colors.accent.primary}
                              />
                            </View>
                            <View style={styles.serviceContent}>
                              <View style={styles.serviceTitleRow}>
                                <Text style={styles.serviceTitle}>
                                  {item.title}
                                </Text>
                                <Text style={styles.serviceDate}>
                                  {formatServiceDate(item.createdAt)}
                                </Text>
                              </View>
                              <Text
                                style={styles.serviceDesc}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                              >
                                {item.records?.length
                                  ? item.records
                                      .map((record) => record.title)
                                      .join(", ")
                                  : item.description ||
                                    "Список робіт поки не заповнений"}
                              </Text>
                            </View>
                          </View>
                        ))}
                        {!recentServiceHistory.length ? (
                          <Text style={styles.serviceDesc}>
                            Ще немає записів обслуговування для цього авто.
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </>
                )}
              </View>
            </ScrollView>
          </View>
        ) : null}

        {activeTab === "history" && activeVehicleId ? (
          <ServiceHistoryContent
            vehicleId={activeVehicleId}
            vehicleTitle={vehicleTitle}
            onAddPress={() =>
              navigation.navigate("ServiceHistoryCreate", {
                vehicleId: activeVehicleId,
                vehicleTitle,
              })
            }
            onEditPress={(visit) =>
              navigation.navigate("ServiceHistoryEdit", {
                vehicleId: activeVehicleId,
                vehicleTitle,
                visit,
              })
            }
            contentContainerStyle={{ paddingBottom: scrollBottomPadding }}
          />
        ) : null}

        {activeTab === "chats" ? renderTabPlaceholder("Чати") : null}
        {activeTab === "services" ? renderTabPlaceholder("Мої сервіси") : null}
      </View>

      {/* Bottom nav */}
      <View style={[styles.bottomNav, { paddingBottom: 16 + insets.bottom }]}>
        <TouchableOpacity
          style={styles.bottomAvatar}
          onPress={() => navigation.navigate("Profile")}
          activeOpacity={0.8}
        >
          <Text style={styles.bottomAvatarText}>K</Text>
        </TouchableOpacity>

        <BottomNavBar
          activeTab={activeTab}
          onGaragePress={() => handleTabPress("garage")}
          onChatsPress={() => handleTabPress("chats")}
          onServicesPress={() => handleTabPress("services")}
          onHistoryPress={() => handleTabPress("history")}
        />
      </View>
    </View>
  );
}
