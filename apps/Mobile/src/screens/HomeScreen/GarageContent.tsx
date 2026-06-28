import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { RefreshStatusBar } from "../../components/RefreshStatusBar";
import {
  FuelType,
  ServiceHistoryVisitDto,
  TransmissionType,
  VehicleDto,
  VehicleListItem,
  WheelDriveType,
} from "../../types/api";
import {
  FUEL_LABELS,
  formatServiceDate,
  formatVehicleCount,
  formatVinShort,
  resolveColorHex,
  TRANSMISSION_LABELS,
  WHEEL_DRIVE_LABELS,
} from "./homeScreenUtils";
import { styles } from "./GarageContent.styles";

const CAR_PLACEHOLDER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420.849 420.849">
  <g fill="currentColor">
    <path d="m81.123,216.924c-17.161,0-31.125,13.959-31.125,31.12 0,17.166 13.959,31.131 31.125,31.131 17.155,0 31.12-13.959 31.12-31.131-1.42109e-14-17.156-13.965-31.12-31.12-31.12zm0,44.956c-7.631,0-13.831-6.205-13.831-13.837 0-7.62 6.199-13.825 13.831-13.825 7.626,0 13.825,6.205 13.825,13.825-1.42109e-14,7.626-6.199,13.837-13.825,13.837z"/>
    <path d="m339.65,222.541c-15.612,0-28.308,12.702-28.308,28.308s12.702,28.32 28.308,28.32c15.606,0 28.308-12.713 28.308-28.32s-12.696-28.308-28.308-28.308zm0,39.339c-6.083,0-11.019-4.948-11.019-11.031 0-6.071 4.936-11.019 11.019-11.019 6.071,0 11.019,4.948 11.019,11.019 0,6.083-4.948,11.031-11.019,11.031z"/>
    <rect width="177.544" x="120.497" y="257.375" height="17.295"/>
    <polygon points="415.202,206.405 407.012,198.226 391.371,190.746 285.421,180.705 231.121,141.674 185.461,141.674 127.465,151.541 59.835,182.794 43.699,177.637 0,177.637 0,191.712 13.441,211.877 0,220.981 0,251.67 12.079,263.743 24.303,251.524 17.283,244.504 17.283,230.161 37.354,216.574 22.918,194.926 41.004,194.926 60.976,201.317 132.634,168.201 186.922,158.969 225.55,158.969 279.134,197.475 386.685,207.662 396.883,212.546 399.945,215.596 403.275,226.406 402.012,237.728 391.953,252.84 406.331,262.439 418.736,243.823 420.849,224.736"/>
  </g>
</svg>
`;

interface PickerMenuLayout {
  top: number;
  left: number;
  width: number;
}

export interface GarageContentProps {
  vehicles: VehicleListItem[];
  activeVehicleId: string | undefined;
  onVehicleChange: (vehicleId: string) => void;
  car: VehicleDto | undefined;
  isLoadingCar: boolean;
  serviceHistory: ServiceHistoryVisitDto[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onCarEditPress: () => void;
  onAddCarPress: () => void;
  onServiceHistoryPress: () => void;
  contentContainerStyle?: ViewStyle;
}

function VehicleThumb({
  photoUrl,
  size = 48,
  borderRadius = 12,
}: {
  photoUrl: string | null;
  size?: number;
  borderRadius?: number;
}) {
  const theme = useTheme();

  if (photoUrl) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={{ width: size, height: size, borderRadius }}
      />
    );
  }

  return (
    <View
      style={[
        styles.vehicleThumbPlaceholder,
        { width: size, height: size, borderRadius },
      ]}
    >
      <SvgXml
        xml={CAR_PLACEHOLDER_SVG}
        width={size * 0.45}
        height={size * 0.45}
        color={theme.colors.accent.primary}
      />
    </View>
  );
}

export function GarageContent({
  vehicles,
  activeVehicleId,
  onVehicleChange,
  car,
  isLoadingCar,
  serviceHistory,
  isRefreshing,
  onRefresh,
  onCarEditPress,
  onAddCarPress,
  onServiceHistoryPress,
  contentContainerStyle,
}: GarageContentProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const pickerRef = React.useRef<View>(null);
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);
  const [pickerMenuLayout, setPickerMenuLayout] =
    React.useState<PickerMenuLayout | null>(null);

  const scrollTopInset = 16 + insets.top;
  const hasVehicle = vehicles.length > 0;
  const selectedVehicle =
    vehicles.find((v) => v.id === activeVehicleId) ?? vehicles[0];
  const showCarContent = hasVehicle && car && !isLoadingCar;
  const recentHistory = serviceHistory.slice(0, 3);
  const heroPhotoUrl = car?.photoUrl ?? selectedVehicle?.photoUrl ?? null;
  const heroBrand = car?.brand ?? selectedVehicle?.brand ?? "";
  const heroModel = car?.model ?? selectedVehicle?.model ?? "";

  const handleCopyVin = () => {
    if (car?.vin) {
      Alert.alert("VIN-код", car.vin, [{ text: "OK" }]);
    }
  };

  const closePicker = React.useCallback(() => {
    setIsPickerOpen(false);
    setPickerMenuLayout(null);
  }, []);

  const openPicker = React.useCallback(() => {
    pickerRef.current?.measureInWindow((x, y, width, height) => {
      setPickerMenuLayout({
        top: y + height + 8,
        left: x,
        width,
      });
      setIsPickerOpen(true);
    });
  }, []);

  const handlePickerToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isPickerOpen) {
      closePicker();
      return;
    }
    openPicker();
  };

  const handleVehicleSelect = (vehicleId: string) => {
    onVehicleChange(vehicleId);
    closePicker();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderPickerMenu = () => (
    <>
      <Text style={styles.vehiclePickerMenuTitle}>Ваші автомобілі</Text>

      <ScrollView
        style={styles.vehiclePickerMenuList}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        bounces={vehicles.length > 4}
      >
        {vehicles.map((vehicle) => {
          const isActive = vehicle.id === activeVehicleId;
          return (
            <TouchableOpacity
              key={vehicle.id}
              style={[
                styles.vehiclePickerItem,
                isActive && styles.vehiclePickerItemActive,
              ]}
              onPress={() => handleVehicleSelect(vehicle.id)}
              activeOpacity={0.8}
            >
              <VehicleThumb
                photoUrl={vehicle.photoUrl}
                size={36}
                borderRadius={8}
              />
              <View style={styles.vehiclePickerItemInfo}>
                <Text
                  style={[
                    styles.vehiclePickerItemName,
                    isActive && styles.vehiclePickerItemNameActive,
                  ]}
                >
                  {vehicle.brand} {vehicle.model}
                </Text>
                <Text style={styles.vehiclePickerItemPlate}>
                  {vehicle.licensePlate}
                </Text>
              </View>
              {isActive ? (
                <Feather
                  name="check-circle"
                  size={18}
                  color={theme.colors.accent.primary}
                />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={styles.vehiclePickerAdd}
        onPress={() => {
          closePicker();
          onAddCarPress();
        }}
        activeOpacity={0.8}
      >
        <View style={styles.vehiclePickerAddIcon}>
          <Feather name="plus" size={14} color={theme.colors.accent.primary} />
        </View>
        <Text style={styles.vehiclePickerAddText}>Додати автомобіль</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.panel}>
      <RefreshStatusBar visible={isRefreshing} />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isPickerOpen}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: 0 },
          contentContainerStyle,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent.primary}
            colors={[theme.colors.accent.primary]}
            progressViewOffset={insets.top}
          />
        }
      >
        <View style={[styles.scrollContent, { paddingTop: scrollTopInset }]}>
          <Animated.View entering={FadeIn.duration(280)}>
            <Text style={styles.pageTitle}>Гараж</Text>
            <Text style={styles.pageSubtitle}>
              {hasVehicle
                ? formatVehicleCount(vehicles.length)
                : "Додайте автомобіль, щоб почати"}
            </Text>
          </Animated.View>

          {!hasVehicle ? (
            <Animated.View entering={FadeIn.duration(300).delay(80)}>
              <TouchableOpacity
                style={styles.emptyGarageCard}
                onPress={onAddCarPress}
                activeOpacity={0.8}
              >
                <Feather
                  name="plus-circle"
                  size={36}
                  color={theme.colors.accent.primary}
                />
                <Text style={styles.emptyGarageTitle}>Немає автомобілів</Text>
                <Text style={styles.emptyGarageText}>
                  Додайте своє авто, щоб відстежувати обслуговування та
                  характеристики
                </Text>
                <View style={styles.emptyGarageButton}>
                  <Text style={styles.emptyGarageButtonText}>
                    + Додати автомобіль
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <>
              <Animated.View entering={FadeIn.duration(300).delay(60)}>
                <View
                  ref={pickerRef}
                  collapsable={false}
                  style={styles.vehiclePickerWrapper}
                >
                  <TouchableOpacity
                    style={[
                      styles.vehiclePicker,
                      isPickerOpen && styles.vehiclePickerOpen,
                    ]}
                    onPress={handlePickerToggle}
                    activeOpacity={0.85}
                  >
                    <View style={styles.vehiclePickerButton}>
                      <VehicleThumb
                        photoUrl={selectedVehicle?.photoUrl ?? null}
                      />
                      <View style={styles.vehiclePickerInfo}>
                        <Text style={styles.vehiclePickerName}>
                          {selectedVehicle?.brand} {selectedVehicle?.model}
                        </Text>
                        <Text style={styles.vehiclePickerPlate}>
                          {selectedVehicle?.licensePlate}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.vehiclePickerChevron,
                          isPickerOpen && styles.vehiclePickerChevronOpen,
                        ]}
                      >
                        <Feather
                          name={isPickerOpen ? "chevron-up" : "chevron-down"}
                          size={18}
                          color={
                            isPickerOpen
                              ? theme.colors.accent.primary
                              : "#8E8E93"
                          }
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </Animated.View>

              <Animated.View
                key={activeVehicleId}
                entering={FadeIn.duration(320).delay(100)}
              >
                <Animated.View style={styles.heroCard}>
                  {heroPhotoUrl ? (
                    <Image
                      source={{ uri: heroPhotoUrl }}
                      style={styles.heroImage}
                    />
                  ) : (
                    <View style={styles.heroPlaceholder}>
                      <SvgXml
                        xml={CAR_PLACEHOLDER_SVG}
                        width={48}
                        height={48}
                        color={theme.colors.accent.primary}
                      />
                      <Text style={styles.heroPlaceholderLabel}>
                        Фото автомобіля
                      </Text>
                    </View>
                  )}

                  {car?.licensePlate ? (
                    <View style={styles.plateBadge}>
                      <Text style={styles.plateBadgeText}>
                        {car.licensePlate}
                      </Text>
                    </View>
                  ) : null}

                  <View style={styles.heroOverlay}>
                    <Text style={styles.heroBrand}>{heroBrand}</Text>
                    <Text style={styles.heroModel}>{heroModel}</Text>
                  </View>
                </Animated.View>
              </Animated.View>

              {isLoadingCar ? (
                <View style={styles.carLoading}>
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.accent.primary}
                  />
                  <Text style={styles.carLoadingText}>
                    Завантаження даних...
                  </Text>
                </View>
              ) : null}

              {showCarContent ? (
                <>
                  <Animated.View entering={FadeIn.duration(300).delay(140)}>
                    <View style={styles.statsRow}>
                      <View style={styles.statPill}>
                        <Feather
                          name="calendar"
                          size={14}
                          color={theme.colors.accent.primary}
                        />
                        <Text style={styles.statPillValue}>{car.year}</Text>
                        <Text style={styles.statPillLabel}>Рік</Text>
                      </View>
                      <View style={styles.statPill}>
                        <Feather
                          name="activity"
                          size={14}
                          color={theme.colors.accent.primary}
                        />
                        <Text style={styles.statPillValue}>
                          {car.mileage.toLocaleString("uk-UA")}
                        </Text>
                        <Text style={styles.statPillLabel}>км</Text>
                      </View>
                      <View style={styles.statPill}>
                        <Feather
                          name="droplet"
                          size={14}
                          color={theme.colors.accent.primary}
                        />
                        <Text
                          style={styles.statPillValue}
                          numberOfLines={1}
                        >
                          {FUEL_LABELS[car.fuelType as FuelType] ??
                            car.fuelType}
                        </Text>
                        <Text style={styles.statPillLabel}>Паливо</Text>
                      </View>
                    </View>
                  </Animated.View>

                  <Animated.View entering={FadeIn.duration(300).delay(180)}>
                    <View style={styles.quickActions}>
                      <TouchableOpacity
                        style={styles.quickAction}
                        onPress={onCarEditPress}
                        activeOpacity={0.8}
                      >
                        <Feather
                          name="edit-2"
                          size={15}
                          color={theme.colors.accent.primary}
                        />
                        <Text style={styles.quickActionText}>Редагувати</Text>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>

                  <Animated.View entering={FadeIn.duration(300).delay(220)}>
                    <View style={styles.section}>
                      <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Характеристики</Text>
                        <TouchableOpacity
                          style={styles.sectionAction}
                          onPress={onCarEditPress}
                          activeOpacity={0.8}
                        >
                          <Feather
                            name="edit-2"
                            size={12}
                            color={theme.colors.accent.primary}
                          />
                          <Text style={styles.sectionActionText}>
                            Змінити
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={[styles.infoRow, styles.infoRowFirst]}>
                        <Feather
                          name="zap"
                          size={16}
                          color={theme.colors.accent.primary}
                          style={styles.infoIcon}
                        />
                        <View style={styles.infoContent}>
                          <Text style={styles.infoLabel}>Двигун</Text>
                          <Text style={styles.infoValue}>
                            {(car.engineCapacity / 1000).toFixed(1)} л,{" "}
                            {car.enginePower} к.с.
                          </Text>
                        </View>
                      </View>

                      <View style={styles.infoRow}>
                        <Feather
                          name="settings"
                          size={16}
                          color={theme.colors.accent.primary}
                          style={styles.infoIcon}
                        />
                        <View style={styles.infoContent}>
                          <Text style={styles.infoLabel}>КПП</Text>
                          <Text style={styles.infoValue}>
                            {TRANSMISSION_LABELS[
                              car.transmissionType as TransmissionType
                            ] ?? car.transmissionType}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.infoRow}>
                        <Feather
                          name="truck"
                          size={16}
                          color={theme.colors.accent.primary}
                          style={styles.infoIcon}
                        />
                        <View style={styles.infoContent}>
                          <Text style={styles.infoLabel}>Привід</Text>
                          <Text style={styles.infoValue}>
                            {WHEEL_DRIVE_LABELS[
                              car.wheelDriveType as WheelDriveType
                            ] ?? car.wheelDriveType}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.infoRow}>
                        <Feather
                          name="layers"
                          size={16}
                          color={theme.colors.accent.primary}
                          style={styles.infoIcon}
                        />
                        <View style={styles.infoContent}>
                          <Text style={styles.infoLabel}>Кузов</Text>
                          <Text style={styles.infoValue}>—</Text>
                        </View>
                      </View>

                      <View style={styles.infoRow}>
                        <Feather
                          name="droplet"
                          size={16}
                          color={theme.colors.accent.primary}
                          style={styles.infoIcon}
                        />
                        <View style={styles.infoContent}>
                          <Text style={styles.infoLabel}>Колір</Text>
                          <View style={styles.colorValueRow}>
                            <View
                              style={[
                                styles.colorSwatch,
                                {
                                  backgroundColor: resolveColorHex(car.color),
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
                      </View>

                      <TouchableOpacity
                        style={styles.infoRow}
                        onPress={handleCopyVin}
                        activeOpacity={0.7}
                      >
                        <Feather
                          name="hash"
                          size={16}
                          color={theme.colors.accent.primary}
                          style={styles.infoIcon}
                        />
                        <View style={styles.infoContent}>
                          <Text style={styles.infoLabel}>VIN-код</Text>
                          <View style={styles.infoValueRow}>
                            <Text style={styles.infoValue}>
                              {formatVinShort(car.vin)}
                            </Text>
                            <Feather
                              name="copy"
                              size={15}
                              color={theme.colors.accent.primary}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>

                  <Animated.View entering={FadeIn.duration(300).delay(260)}>
                    <View style={styles.section}>
                      <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                          Останні візити
                        </Text>
                        <TouchableOpacity
                          style={styles.sectionAction}
                          onPress={onServiceHistoryPress}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.sectionActionText}>Більше</Text>
                          <Feather
                            name="chevron-right"
                            size={14}
                            color={theme.colors.accent.primary}
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.historyList}>
                        {recentHistory.map((item, index) => (
                          <Animated.View
                            key={item.id}
                            entering={FadeIn.duration(250).delay(
                              280 + index * 50
                            )}
                            style={styles.historyCard}
                          >
                            <View style={styles.historyAvatar}>
                              <Feather
                                name="file-text"
                                size={16}
                                color={theme.colors.accent.primary}
                              />
                            </View>
                            <View style={styles.historyContent}>
                              <View style={styles.historyTitleRow}>
                                <Text
                                  style={styles.historyTitle}
                                  numberOfLines={1}
                                >
                                  {item.title}
                                </Text>
                                <Text style={styles.historyDate}>
                                  {formatServiceDate(item.createdAt)}
                                </Text>
                              </View>
                              <Text
                                style={styles.historyDesc}
                                numberOfLines={2}
                              >
                                {item.records?.length
                                  ? item.records
                                      .map((r) => r.title)
                                      .join(", ")
                                  : item.description ||
                                    "Список робіт поки не заповнений"}
                              </Text>
                            </View>
                          </Animated.View>
                        ))}

                        {!recentHistory.length ? (
                          <Text style={styles.emptyHistoryText}>
                            Ще немає записів обслуговування для цього авто.
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </Animated.View>
                </>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>

      {isPickerOpen && pickerMenuLayout ? (
        <View style={styles.pickerOverlayLayer} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.pickerBackdrop}
            activeOpacity={1}
            onPress={closePicker}
          />
          <Animated.View
            entering={FadeIn.duration(200)}
            style={[
              styles.vehiclePickerMenu,
              styles.vehiclePickerMenuPortal,
              {
                top: pickerMenuLayout.top,
                left: pickerMenuLayout.left,
                width: pickerMenuLayout.width,
              },
            ]}
          >
            {renderPickerMenu()}
          </Animated.View>
        </View>
      ) : null}
    </View>
  );
}
