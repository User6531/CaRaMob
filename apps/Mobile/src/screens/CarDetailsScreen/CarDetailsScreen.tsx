import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./CarDetailsScreen.styles";
import { CarDetailsScreenProps } from "../../navigation/types";
import { useVehicle, useDeleteVehicle } from "../../queries";
import {
  FuelType,
  TransmissionType,
  WheelDriveType,
} from "../../types/api";

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
  [WheelDriveType.FWD]: "Передній (FWD)",
  [WheelDriveType.RWD]: "Задній (RWD)",
  [WheelDriveType.AWD]: "Повний (AWD)",
  [WheelDriveType.FourWD]: "4WD",
};

const errorBlockStyles = StyleSheet.create({
  errorMessage: { marginBottom: 12 },
  retryButtonMargin: { marginTop: 16 },
});

export default function CarDetailsScreen({
  navigation,
  route,
}: CarDetailsScreenProps) {
  const theme = useTheme();
  const { carId } = route.params;
  const { data: car, isLoading, isError, error } = useVehicle(carId);
  const deleteVehicle = useDeleteVehicle();

  const handleEdit = () => {
    navigation.navigate("CarEdit", { carId });
  };

  const handleDelete = () => {
    Alert.alert(
      "Видалити автомобіль?",
      "Ви впевнені, що хочете видалити цей автомобіль? Цю дію неможливо скасувати.",
      [
        {
          text: "Скасувати",
          style: "cancel",
        },
        {
          text: "Видалити",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteVehicle.mutateAsync(carId);
              navigation.navigate("Home");
            } catch (e) {
              Alert.alert(
                "Помилка",
                e instanceof Error ? e.message : "Не вдалося видалити автомобіль"
              );
            }
          },
        },
      ]
    );
  };

  if (isLoading || !car) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.pageBackground,
          globalStyles.loadingContainer,
        ]}
      >
        {isLoading ? (
          <>
            <ActivityIndicator size="large" color={theme.colors.accent.primary} />
            <Text style={globalStyles.loadingText}>Завантаження...</Text>
          </>
        ) : (
          <Text style={globalStyles.loadingText}>Автомобіль не знайдено</Text>
        )}
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.pageBackground,
          globalStyles.loadingContainer,
        ]}
      >
        <Text style={[globalStyles.textPrimary, errorBlockStyles.errorMessage]}>
          Не вдалося завантажити дані
        </Text>
        <Text style={globalStyles.textSecondary}>
          {error instanceof Error ? error.message : "Помилка мережі"}
        </Text>
        <TouchableOpacity
          style={[globalStyles.buttonPrimary, errorBlockStyles.retryButtonMargin]}
          onPress={() => navigation.goBack()}
        >
          <Text style={globalStyles.buttonPrimaryText}>Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[globalStyles.container, globalStyles.pageBackground]}>
      {/* Car Image */}
      <View style={styles.imageContainer}>
        {car.photoUrl ? (
          <Image source={{ uri: car.photoUrl }} style={styles.carImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🚗</Text>
            <Text style={styles.placeholderLabel}>Фото автомобіля</Text>
          </View>
        )}
      </View>

      {/* Car Information */}
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Text style={[globalStyles.textLarge, styles.carTitle]}>
            {car.brand} {car.model}
          </Text>
          <Text style={[globalStyles.textSecondary, styles.carYear]}>
            {car.year} рік
          </Text>
        </View>

        <View style={[globalStyles.card, styles.detailsSection]}>
          <Text style={[globalStyles.textPrimary, styles.sectionTitle]}>
            Основна інформація
          </Text>

          <View style={styles.detailRow}>
            <Text style={[globalStyles.textSecondary, styles.detailLabel]}>
              Марка:
            </Text>
            <Text style={[globalStyles.textPrimary, styles.detailValue]}>
              {car.brand}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[globalStyles.textSecondary, styles.detailLabel]}>
              Модель:
            </Text>
            <Text style={[globalStyles.textPrimary, styles.detailValue]}>
              {car.model}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[globalStyles.textSecondary, styles.detailLabel]}>
              Рік випуску:
            </Text>
            <Text style={[globalStyles.textPrimary, styles.detailValue]}>
              {car.year}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[globalStyles.textSecondary, styles.detailLabel]}>
              Колір:
            </Text>
            <Text style={[globalStyles.textPrimary, styles.detailValue]}>
              {car.color}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[globalStyles.textSecondary, styles.detailLabel]}>
              Номерний знак:
            </Text>
            <Text
              style={[
                globalStyles.textPrimary,
                styles.detailValue,
                styles.licensePlate,
              ]}
            >
              {car.licensePlate}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[globalStyles.textSecondary, styles.detailLabel]}>
              VIN номер:
            </Text>
            <Text style={[globalStyles.textPrimary, styles.detailValue]}>
              {car.vin}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[globalStyles.textSecondary, styles.detailLabel]}>
              Пробіг:
            </Text>
            <Text style={[globalStyles.textPrimary, styles.detailValue]}>
              {car.mileage.toLocaleString("uk-UA")} км
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[globalStyles.textSecondary, styles.detailLabel]}>
              Потужність:
            </Text>
            <Text style={[globalStyles.textPrimary, styles.detailValue]}>
              {car.enginePower} к.с.
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[globalStyles.textSecondary, styles.detailLabel]}>
              Об&apos;єм двигуна:
            </Text>
            <Text style={[globalStyles.textPrimary, styles.detailValue]}>
              {car.engineCapacity / 1000} л
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[globalStyles.textSecondary, styles.detailLabel]}>
              Тип палива:
            </Text>
            <Text style={[globalStyles.textPrimary, styles.detailValue]}>
              {FUEL_LABELS[car.fuelType as FuelType] ?? car.fuelType}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[globalStyles.textSecondary, styles.detailLabel]}>
              Коробка передач:
            </Text>
            <Text style={[globalStyles.textPrimary, styles.detailValue]}>
              {TRANSMISSION_LABELS[car.transmissionType as TransmissionType] ??
                car.transmissionType}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[globalStyles.textSecondary, styles.detailLabel]}>
              Привід:
            </Text>
            <Text style={[globalStyles.textPrimary, styles.detailValue]}>
              {WHEEL_DRIVE_LABELS[car.wheelDriveType as WheelDriveType] ??
                car.wheelDriveType}
            </Text>
          </View>

          {car.boughtAt && (
            <View style={styles.detailRow}>
              <Text style={[globalStyles.textSecondary, styles.detailLabel]}>
                Дата купівлі:
              </Text>
              <Text style={[globalStyles.textPrimary, styles.detailValue]}>
                {new Date(car.boughtAt).toLocaleDateString("uk-UA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.metaSection}>
          <Text style={styles.sectionTitle}>Додаткова інформація</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Додано:</Text>
            <Text style={styles.detailValue}>
              {new Date(car.createdAt).toLocaleDateString("uk-UA", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>

          {car.updatedAt && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Оновлено:</Text>
              <Text style={styles.detailValue}>
                {new Date(car.updatedAt).toLocaleDateString("uk-UA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={globalStyles.buttonPrimary}
          onPress={handleEdit}
        >
          <Text style={globalStyles.buttonPrimaryText}>✏️ Редагувати</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.buttonDanger}
          onPress={handleDelete}
          disabled={deleteVehicle.isPending}
        >
          <Text style={globalStyles.buttonDangerText}>
            {deleteVehicle.isPending ? "..." : "🗑️ Видалити"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
