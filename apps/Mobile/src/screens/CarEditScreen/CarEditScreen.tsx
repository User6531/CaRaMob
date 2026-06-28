import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { FormScreen } from "../../components/FormScreen";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../hooks/useTheme";
import { useStatusBar } from "../../hooks/useStatusBar";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./CarEditScreen.styles";
import { CarEditScreenProps } from "../../navigation/types";
import { Select, SelectOption } from "../../components/Select";
import { useVehicle, useUpdateVehicle, useDeleteVehicle } from "../../queries";
import { formatVinShort } from "../HomeScreen/homeScreenUtils";

const COLOR_OPTIONS: SelectOption[] = [
  { label: "Білий", value: "white" },
  { label: "Чорний", value: "black" },
  { label: "Сірий", value: "gray" },
  { label: "Сріблястий", value: "silver" },
  { label: "Червоний", value: "red" },
  { label: "Синій", value: "blue" },
  { label: "Зелений", value: "green" },
  { label: "Жовтий", value: "yellow" },
  { label: "Коричневий", value: "brown" },
  { label: "Бежевий", value: "beige" },
  { label: "Помаранчевий", value: "orange" },
  { label: "Фіолетовий", value: "purple" },
];

export default function CarEditScreen({
  navigation,
  route,
}: CarEditScreenProps) {
  useStatusBar();
  const theme = useTheme();
  const { carId } = route.params;
  const {
    data: vehicle,
    isLoading: isLoadingVehicle,
    isError,
    error,
  } = useVehicle(carId);
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();

  const [licensePlate, setLicensePlate] = useState("");
  const [boughtAt, setBoughtAt] = useState<Date | null>(null);
  const [showBoughtAtPicker, setShowBoughtAtPicker] = useState(false);
  const [color, setColor] = useState<string | number | undefined>(undefined);
  const [mileage, setMileage] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!vehicle) return;
    setLicensePlate(vehicle.licensePlate);
    setBoughtAt(vehicle.boughtAt ? new Date(vehicle.boughtAt) : null);
    setMileage(String(vehicle.mileage));
    setPhotoUrl(vehicle.photoUrl);
    const colorOption = COLOR_OPTIONS.find((o) => o.label === vehicle.color);
    setColor(colorOption ? colorOption.value : undefined);
  }, [vehicle]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Дозвіл потрібен", "Потрібен дозвіл для доступу до галереї!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.canceled) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  const getInitialBoughtAt = () =>
    vehicle?.boughtAt ? new Date(vehicle.boughtAt) : null;
  const getInitialMileage = () => (vehicle ? String(vehicle.mileage) : "");
  const getInitialColor = () => {
    if (!vehicle?.color) return undefined;
    const opt = COLOR_OPTIONS.find((o) => o.label === vehicle.color);
    return opt?.value;
  };

  const hasChanges = () => {
    if (!vehicle) return false;
    const colorLabel =
      COLOR_OPTIONS.find((o) => o.value === color)?.label ??
      String(color ?? "");
    return (
      licensePlate.trim() !== vehicle.licensePlate ||
      (boughtAt?.getTime() ?? 0) !== (getInitialBoughtAt()?.getTime() ?? 0) ||
      mileage.trim() !== getInitialMileage() ||
      colorLabel !== vehicle.color ||
      photoUrl !== (vehicle.photoUrl ?? null)
    );
  };

  const handleCancel = () => {
    if (hasChanges()) {
      Alert.alert(
        "Скасувати зміни?",
        "Ви внесли зміни. Ви впевнені, що хочете скасувати?",
        [
          { text: "Продовжити редагування", style: "cancel" },
          {
            text: "Скасувати",
            style: "destructive",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleSave = async () => {
    if (!licensePlate.trim()) {
      Alert.alert("Помилка", "Введіть номерний знак");
      return;
    }
    const mileageNum = parseInt(mileage.trim(), 10);
    if (mileage.trim() === "" || isNaN(mileageNum) || mileageNum < 0) {
      Alert.alert("Помилка", "Введіть коректний пробіг (км)");
      return;
    }
    if (mileageNum > 1000000) {
      Alert.alert("Помилка", "Пробіг не може перевищувати 1 000 000 км");
      return;
    }

    const colorLabel =
      COLOR_OPTIONS.find((o) => o.value === color)?.label ??
      String(color ?? "");

    const dto = {
      licensePlate: licensePlate.trim(),
      boughtAt: boughtAt ? boughtAt.toISOString() : null,
      color: colorLabel,
      mileage: mileageNum,
      photoUrl: photoUrl && photoUrl.startsWith("http") ? photoUrl : null,
    };

    try {
      await updateVehicle.mutateAsync({ vehicleId: carId, data: dto });
      Alert.alert("Успішно!", "Дані автомобіля оновлені", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert(
        "Помилка",
        e instanceof Error ? e.message : "Не вдалося зберегти зміни"
      );
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Видалити автомобіль?",
      "Ви впевнені, що хочете видалити цей автомобіль? Цю дію неможливо скасувати.",
      [
        { text: "Скасувати", style: "cancel" },
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
                e instanceof Error ? e.message : "Не вдалося видалити"
              );
            }
          },
        },
      ]
    );
  };

  if (isLoadingVehicle || !vehicle) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.pageBackground,
          styles.loadingContainer,
        ]}
      >
        {isLoadingVehicle ? (
          <>
            <ActivityIndicator
              size="large"
              color={theme.colors.accent.primary}
            />
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
          styles.errorContainer,
        ]}
      >
        <Text style={globalStyles.textPrimary}>
          {error instanceof Error ? error.message : "Помилка завантаження"}
        </Text>
        <TouchableOpacity
          style={[globalStyles.buttonPrimary, styles.retryButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={globalStyles.buttonPrimaryText}>Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isSaving = updateVehicle.isPending;
  const vehicleTitle = `${vehicle.brand} ${vehicle.model}`.trim();

  return (
    <FormScreen
      style={[globalStyles.container, globalStyles.pageBackground]}
      contentContainerStyle={styles.contentContainer}
    >
      <Animated.View entering={FadeIn.duration(280)}>
        <Text style={styles.pageTitle}>Редагування</Text>
        <Text style={styles.pageSubtitle}>
          Змініть номерний знак, пробіг, колір, фото або дату купівлі
        </Text>

        <View style={styles.vehicleBadge}>
          <Feather name="truck" size={14} color={theme.colors.accent.primary} />
          <Text style={styles.vehicleBadgeText}>
            {vehicleTitle} · {vehicle.year} · VIN {formatVinShort(vehicle.vin)}
          </Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(60)}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Фото</Text>
          <TouchableOpacity
            style={styles.photoCard}
            onPress={pickImage}
            activeOpacity={0.9}
          >
            {photoUrl ? (
              <Image source={{ uri: photoUrl }} style={styles.photoImage} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Feather
                  name="image"
                  size={32}
                  color={theme.colors.accent.primary}
                />
                <Text style={styles.photoPlaceholderText}>
                  Додати фото автомобіля
                </Text>
              </View>
            )}
            <View style={styles.photoOverlay}>
              <Feather name="camera" size={16} color="#FFFFFF" />
              <Text style={styles.photoOverlayText}>
                {photoUrl ? "Змінити фото" : "Обрати фото"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(120)}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Основні дані</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Номерний знак *</Text>
            <TextInput
              style={styles.input}
              value={licensePlate}
              onChangeText={setLicensePlate}
              placeholder="Наприклад: АА1234ВВ"
              placeholderTextColor="#8E8E93"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Пробіг (км) *</Text>
            <TextInput
              style={styles.input}
              value={mileage}
              onChangeText={setMileage}
              placeholder="Наприклад: 50000"
              placeholderTextColor="#8E8E93"
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Колір *</Text>
            <Select
              options={COLOR_OPTIONS}
              value={color}
              onValueChange={setColor}
              placeholder="Виберіть колір"
              containerStyle={styles.selectContainer}
            />
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(180)}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Додатково</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Дата купівлі</Text>
            <TouchableOpacity
              style={[styles.input, styles.dateInput]}
              onPress={() => setShowBoughtAtPicker(true)}
              activeOpacity={0.8}
            >
              <Text
                style={
                  boughtAt ? styles.dateInputText : styles.dateInputPlaceholder
                }
              >
                {boughtAt
                  ? boughtAt.toLocaleDateString("uk-UA")
                  : "Оберіть дату (необов'язково)"}
              </Text>
            </TouchableOpacity>
            {showBoughtAtPicker ? (
              <DateTimePicker
                value={boughtAt ?? new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                maximumDate={new Date()}
                onChange={(_, date) => {
                  setShowBoughtAtPicker(Platform.OS === "ios");
                  if (date) setBoughtAt(date);
                }}
              />
            ) : null}
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(240)}>
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              isSaving && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            <Feather name="check" size={18} color={theme.colors.text.inverse} />
            <Text style={styles.saveButtonText}>
              {isSaving ? "Збереження..." : "Зберегти зміни"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            <Feather
              name="x"
              size={18}
              color={theme.colors.accent.primary}
            />
            <Text style={styles.cancelButtonText}>Скасувати</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(300)}>
        <View style={styles.dangerSection}>
          <Text style={styles.dangerTitle}>Небезпечна зона</Text>
          <Text style={styles.dangerText}>
            Видалення автомобіля також прибере пов&apos;язану історію
            обслуговування. Цю дію неможливо скасувати.
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={deleteVehicle.isPending}
            activeOpacity={0.85}
          >
            <Feather name="trash-2" size={16} color="#F85149" />
            <Text style={styles.deleteButtonText}>
              {deleteVehicle.isPending ? "Видалення..." : "Видалити автомобіль"}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </FormScreen>
  );
}
