import React from "react";
import { ScrollView, Text, View, ViewStyle } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { useMechanicWork } from "../../context/MechanicWorkContext";
import { MechanicAssignedVehicle } from "../../types/mechanicVehicle";
import { MechanicVehicleCard } from "./MechanicVehicleCard";
import { MOCK_MECHANIC_VEHICLES } from "./mockMechanicVehicles";
import {
  formatMechanicVehicleCount,
  mergeVehicleWithSession,
} from "./mechanicVehicleUtils";
import { styles } from "./MechanicAssignedVehiclesContent.styles";

export interface MechanicAssignedVehiclesContentProps {
  contentContainerStyle?: ViewStyle;
  onVehiclePress?: (vehicleId: string) => void;
}

export function MechanicAssignedVehiclesContent({
  contentContainerStyle,
  onVehiclePress,
}: MechanicAssignedVehiclesContentProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const scrollTopInset = 16 + insets.top;
  const { sessions } = useMechanicWork();

  const vehicles: MechanicAssignedVehicle[] = MOCK_MECHANIC_VEHICLES.map(
    (vehicle) => {
      const session = sessions[vehicle.id];
      if (!session) return vehicle;

      return mergeVehicleWithSession(vehicle, session.sessionStatus);
    }
  );

  return (
    <View style={styles.panel}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: 0 },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.scrollContent, { paddingTop: scrollTopInset }]}>
          <Animated.View entering={FadeIn.duration(280)}>
            <Text style={styles.pageTitle}>Мої авто</Text>
            <Text style={styles.pageSubtitle}>
              Автомобілі, які менеджер СТО призначив на вас
            </Text>

            <View style={styles.summaryBadge}>
              <Feather name="truck" size={14} color={theme.colors.accent.primary} />
              <Text style={styles.summaryBadgeText}>
                {formatMechanicVehicleCount(vehicles.length)}
              </Text>
            </View>
          </Animated.View>

          {vehicles.length === 0 ? (
            <Animated.View entering={FadeIn.duration(300).delay(80)}>
              <View style={styles.emptyCard}>
                <Feather name="inbox" size={36} color="#8E8E93" />
                <Text style={styles.emptyTitle}>Немає призначених авто</Text>
                <Text style={styles.emptyText}>
                  Коли менеджер закріпить за вами автомобілі, вони з&apos;являться
                  тут
                </Text>
              </View>
            </Animated.View>
          ) : (
            <View style={styles.listSection}>
              {vehicles.map((vehicle, index) => (
                <MechanicVehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  index={index}
                  onPress={
                    onVehiclePress
                      ? () => onVehiclePress(vehicle.id)
                      : undefined
                  }
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
