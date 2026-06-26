import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { MechanicAssignedVehicle } from "../../types/mechanicVehicle";
import {
  formatMechanicAcceptedAt,
  formatMechanicVehicleMeta,
  getMechanicVehicleProgress,
  getMechanicVehicleStatusBadgeStyle,
  getMechanicVehicleStatusLabel,
} from "./mechanicVehicleUtils";
import { styles } from "./MechanicVehicleCard.styles";

export interface MechanicVehicleCardProps {
  vehicle: MechanicAssignedVehicle;
  index: number;
  onPress?: () => void;
}

export function MechanicVehicleCard({
  vehicle,
  index,
  onPress,
}: MechanicVehicleCardProps) {
  const theme = useTheme();
  const statusLabel = getMechanicVehicleStatusLabel(vehicle);
  const badgeStyle = getMechanicVehicleStatusBadgeStyle(vehicle);
  const progress = getMechanicVehicleProgress(vehicle);

  const content = (
    <>
      <View style={styles.cardHeader}>
        <View style={styles.vehicleIcon}>
          <Feather name="truck" size={22} color={theme.colors.accent.primary} />
        </View>

        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.vehicleTitle} numberOfLines={1}>
              {vehicle.vehicleTitle}
            </Text>
            <Text style={styles.plateBadge}>{vehicle.licensePlate}</Text>
          </View>
          <Text style={styles.metaText}>
            {formatMechanicVehicleMeta(vehicle)}
          </Text>
          {vehicle.clientName ? (
            <Text style={styles.clientText}>Власник: {vehicle.clientName}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.problemRow}>
        <Feather name="alert-circle" size={16} color={theme.colors.accent.primary} />
        <View style={styles.problemContent}>
          <Text style={styles.problemLabel}>Проблема</Text>
          <Text style={styles.problemText}>{vehicle.problemSummary}</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Прогрес ремонту</Text>
          <Text style={styles.progressPercent}>{progress}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <View style={styles.footerRow}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: badgeStyle.backgroundColor,
              borderColor: badgeStyle.borderColor,
            },
          ]}
        >
          <View
            style={[styles.statusDot, { backgroundColor: badgeStyle.dotColor }]}
          />
          <Text
            style={[styles.statusText, { color: badgeStyle.textColor }]}
            numberOfLines={1}
          >
            {statusLabel}
          </Text>
        </View>
        <Text style={styles.acceptedText}>
          {formatMechanicAcceptedAt(vehicle.acceptedAt)}
        </Text>
      </View>
    </>
  );

  return (
    <Animated.View entering={FadeIn.duration(300).delay(80 + index * 50)}>
      {onPress ? (
        <TouchableOpacity
          style={styles.card}
          onPress={onPress}
          activeOpacity={0.85}
        >
          {content}
        </TouchableOpacity>
      ) : (
        <View style={styles.card}>{content}</View>
      )}
    </Animated.View>
  );
}
