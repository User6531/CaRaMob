import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SvgXml } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStatusBar } from "../../hooks/useStatusBar";
import { usePullToRefresh } from "../../hooks/usePullToRefresh";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./HomeScreen.styles";
import { HomeScreenProps } from "../../navigation/types";
import { useVehicles, useVehicle, useServiceHistory } from "../../queries";
import { BottomNavBar, BottomNavTab } from "../../components/BottomNavBar";
import { ServiceHistoryContent } from "../ServiceHistoryScreen/ServiceHistoryContent";
import { ServicesContent } from "../ServicesScreen/ServicesContent";
import { ServiceStatusContent } from "../ServiceStatusScreen/ServiceStatusContent";
import { GarageContent } from "./GarageContent";
import { useTheme } from "../../hooks/useTheme";
import { NotificationBellButton } from "../../components/NotificationBellButton";
import { useNotifications } from "../../context/NotificationsContext";
import { useAppAlert } from "../../components/AppAlert";

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

export default function HomeScreen({ navigation }: HomeScreenProps) {
  useStatusBar();
  const theme = useTheme();
  const { showError } = useAppAlert();
  const insets = useSafeAreaInsets();
  const { unreadCount } = useNotifications();
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<
    string | undefined
  >(undefined);
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

  const refreshGarageData = React.useCallback(async () => {
    await Promise.all([
      refetchVehicles(),
      activeVehicleId ? refetchCar() : Promise.resolve(),
    ]);
  }, [refetchVehicles, refetchCar, activeVehicleId]);

  const { isRefreshing: isGarageRefreshing, onRefresh: handleGarageRefresh } =
    usePullToRefresh(refreshGarageData);

  const heroBrand = car?.brand ?? selectedVehicle?.brand ?? "";
  const heroModel = car?.model ?? selectedVehicle?.model ?? "";
  const vehicleTitle = `${heroBrand} ${heroModel}`.trim();
  const scrollTopInset = 16 + insets.top;
  const scrollBottomPadding = 120 + insets.bottom;

  const openServiceHistory = () => {
    if (!activeVehicleId) {
      showError(
        "Додайте авто, щоб переглядати історію обслуговування.",
        "Немає автомобіля"
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
              color="#FFFFFF"
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

  return (
    <View style={[globalStyles.container, globalStyles.pageBackground]}>
      <View style={styles.tabContent}>
        {activeTab === "garage" ? (
          <Animated.View
            key="garage"
            entering={FadeIn.duration(280)}
            style={styles.tabPanel}
          >
            <GarageContent
              vehicles={vehicles}
              activeVehicleId={activeVehicleId}
              onVehicleChange={setSelectedVehicleId}
              car={car}
              isLoadingCar={isLoadingCar}
              serviceHistory={serviceHistory}
              isRefreshing={isGarageRefreshing}
              onRefresh={handleGarageRefresh}
              onCarEditPress={() =>
                activeVehicleId &&
                navigation.navigate("CarEdit", { carId: activeVehicleId })
              }
              onAddCarPress={() => navigation.navigate("CarCard")}
              onServiceHistoryPress={openServiceHistory}
              contentContainerStyle={{ paddingBottom: scrollBottomPadding }}
            />
          </Animated.View>
        ) : null}

        {activeTab === "history" && activeVehicleId ? (
          <Animated.View
            key="history"
            entering={FadeIn.duration(280)}
            style={styles.tabPanel}
          >
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
          </Animated.View>
        ) : null}

        {activeTab === "status" ? (
          <Animated.View
            key="status"
            entering={FadeIn.duration(280)}
            style={styles.tabPanel}
          >
            <ServiceStatusContent
              contentContainerStyle={{ paddingBottom: scrollBottomPadding }}
            />
          </Animated.View>
        ) : null}

        {activeTab === "services" ? (
          <Animated.View
            key="services"
            entering={FadeIn.duration(280)}
            style={styles.tabPanel}
          >
            <ServicesContent
              onServicePress={(serviceId) =>
                navigation.navigate("ServiceShopDetail", { serviceId })
              }
              contentContainerStyle={{ paddingBottom: scrollBottomPadding }}
            />
          </Animated.View>
        ) : null}
      </View>

      <NotificationBellButton
        unreadCount={unreadCount}
        onPress={() => navigation.navigate("Notifications")}
      />

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
          onStatusPress={() => handleTabPress("status")}
          onServicesPress={() => handleTabPress("services")}
          onHistoryPress={() => handleTabPress("history")}
        />
      </View>
    </View>
  );
}
