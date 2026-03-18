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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStatusBar } from "../../hooks/useStatusBar";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./HomeScreen.styles";
import { HomeScreenProps } from "../../navigation/types";
import { useVehicles, useVehicle } from "../../queries";
import { useTheme } from "../../hooks/useTheme";
import {
  FuelType,
  TransmissionType,
  WheelDriveType,
} from "../../types/api";
import { MOCK_SERVICE_HISTORY } from "./mockServiceHistory";

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

function formatVinShort(vin: string) {
  if (vin.length <= 11) return vin;
  return `${vin.slice(0, 4)}...${vin.slice(-4)}`;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  useStatusBar();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {
    data: vehicles = [],
    isLoading: isLoadingList,
    isError,
    error,
    refetch,
    isRefetching,
  } = useVehicles();

  const firstVehicleId = vehicles[0]?.id;
  const { data: car, isLoading: isLoadingCar } = useVehicle(firstVehicleId);

  const handleCopyVin = () => {
    if (car?.vin) {
      Alert.alert("VIN-код", car.vin, [{ text: "OK" }]);
    }
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
            Ласкаво просимо до CARa 🚗
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
            onPress={() => refetch()}
          >
            <Text style={globalStyles.buttonPrimaryText}>Повторити</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const hasVehicle = vehicles.length > 0;
  const firstVehicle = vehicles[0];
  const showCarContent = hasVehicle && car && !isLoadingCar;
  const heroPhotoUrl = car?.photoUrl ?? firstVehicle?.photoUrl ?? null;
  const heroBrand = car?.brand ?? firstVehicle?.brand ?? "";
  const heroModel = car?.model ?? firstVehicle?.model ?? "";

  return (
    <View style={[globalStyles.container, globalStyles.pageBackground]}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: 16 + insets.top, paddingBottom: 120 + insets.bottom },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[theme.colors.accent.primary]}
          />
        }
      >
        {/* Hero: car photo + name */}
        <TouchableOpacity
          style={styles.heroCard}
          onPress={() =>
            firstVehicleId
              ? navigation.navigate("CarDetails", { carId: firstVehicleId })
              : navigation.navigate("CarCard")
          }
          activeOpacity={1}
        >
          {hasVehicle ? (
            <>
              {heroPhotoUrl ? (
                <Image
                  source={{ uri: heroPhotoUrl }}
                  style={styles.heroImage}
                />
              ) : (
                <View style={styles.heroPlaceholder}>
                  <Text style={styles.heroPlaceholderText}>🚗</Text>
                  <Text style={styles.heroPlaceholderLabel}>
                    Фото автомобіля
                  </Text>
                </View>
              )}
              <View style={styles.heroOverlay}>
                <View style={styles.heroTitleRow}>
                  <Text style={styles.heroBrand}>{heroBrand}</Text>
                  <Text style={styles.heroModel}>{heroModel}</Text>
                </View>
                <Text style={styles.heroChevron}>▼</Text>
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
        </TouchableOpacity>

        {showCarContent && (
          <>
            {/* Information block */}
            <View style={styles.infoBlock}>
              <View style={styles.infoBlockHeader}>
                <Text style={styles.infoBlockTitle}>Інформація</Text>
                <TouchableOpacity
                  style={styles.infoEditBtn}
                  onPress={() =>
                    firstVehicleId &&
                    navigation.navigate("CarEdit", { carId: firstVehicleId })
                  }
                >
                  <Text style={styles.infoEditIcon}>✏️</Text>
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
                        <Text style={styles.copyIcon}>📋</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={styles.infoCol}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Двигун</Text>
                    <Text style={styles.infoValue}>
                      {(car.engineCapacity / 1000).toFixed(1)} л,{" "}
                      {car.enginePower} к.с.
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Тип палива</Text>
                    <Text style={styles.infoValue}>
                      {FUEL_LABELS[car.fuelType as FuelType] ?? car.fuelType}
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
                <Text style={styles.licensePlateText}>{car.licensePlate}</Text>
              </View>
            </View>

            {/* Service history block (mock data) */}
            <View style={styles.serviceBlock}>
              <View style={styles.serviceBlockHeader}>
                <Text style={styles.serviceBlockTitle}>
                  Історія обслуговування
                </Text>
                <TouchableOpacity style={styles.serviceMoreBtn}>
                  <Text style={styles.serviceMoreBtnText}>Більше &gt;</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.serviceList}>
                {MOCK_SERVICE_HISTORY.map((item) => (
                  <View key={item.id} style={styles.serviceItem}>
                    <View style={styles.serviceAvatar}>
                      <Text style={styles.serviceAvatarText}>🔧</Text>
                    </View>
                    <View style={styles.serviceContent}>
                      <View style={styles.serviceTitleRow}>
                        <Text style={styles.serviceTitle}>{item.title}</Text>
                        <Text style={styles.serviceDate}>{item.date}</Text>
                      </View>
                      <Text style={styles.serviceDesc}>{item.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Bottom nav */}
      <View style={[styles.bottomNav, { paddingBottom: 16 + insets.bottom }]}>
        <TouchableOpacity
          style={styles.bottomAvatar}
          onPress={() => navigation.navigate("Profile")}
          activeOpacity={0.8}
        >
          <Text style={styles.bottomAvatarText}>K</Text>
        </TouchableOpacity>

        <View style={styles.bottomNavBlock}>
          <View style={styles.bottomNavItems}>
            <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
              <Text style={styles.navItemIcon}>🏠</Text>
              <Text style={styles.navItemLabelActive}>Гараж</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navItemIcon}>💬</Text>
              <Text style={styles.navItemLabel}>Чати</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navItemIcon}>🧰</Text>
              <Text style={styles.navItemLabel}>Мої сервіси</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navItemIcon}>🕒</Text>
              <Text style={styles.navItemLabel}>Історія</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
