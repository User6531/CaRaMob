import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../hooks/useTheme";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./CarEditScreen.styles";
import { CarEditScreenProps } from "../../navigation/types";
import { Select, SelectOption } from "../../components/Select";
import { useVehicle, useUpdateVehicle, useDeleteVehicle } from "../../queries";

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
  const theme = useTheme();
  const { carId } = route.params;
  const { data: vehicle, isLoading: isLoadingVehicle, isError, error } = useVehicle(carId);
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

  const getInitialBoughtAt = () => (vehicle?.boughtAt ? new Date(vehicle.boughtAt) : null);
  const getInitialMileage = () => (vehicle ? String(vehicle.mileage) : "");
  const getInitialColor = () => {
    if (!vehicle?.color) return undefined;
    const opt = COLOR_OPTIONS.find((o) => o.label === vehicle.color);
    return opt?.value;
  };

  const hasChanges = () => {
    if (!vehicle) return false;
    const colorLabel = COLOR_OPTIONS.find((o) => o.value === color)?.label ?? String(color ?? "");
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
          { text: "Скасувати", style: "destructive", onPress: () => navigation.goBack() },
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

    const colorLabel = COLOR_OPTIONS.find((o) => o.value === color)?.label ?? String(color ?? "");

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
          globalStyles.loadingContainer,
        ]}
      >
        {isLoadingVehicle ? (
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
        <Text style={globalStyles.textPrimary}>
          {error instanceof Error ? error.message : "Помилка завантаження"}
        </Text>
        <TouchableOpacity
          style={[globalStyles.buttonPrimary, { marginTop: 16 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={globalStyles.buttonPrimaryText}>Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isSaving = updateVehicle.isPending;

  return (
    <KeyboardAvoidingView
      style={[globalStyles.container, globalStyles.pageBackground]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={[globalStyles.textLarge, styles.title]}>
            Редагувати автомобіль
          </Text>
          <Text style={[globalStyles.textSecondary, styles.subtitle]}>
            Можна змінити номерний знак, дату купівлі, колір, пробіг та фото
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.imageSection}>
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
              {photoUrl ? (
                <Image source={{ uri: photoUrl }} style={styles.carImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>🚗</Text>
                  <Text style={styles.placeholderLabel}>Фото авто</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[globalStyles.textPrimary, styles.label]}>
              Номерний знак *
            </Text>
            <TextInput
              style={[globalStyles.input, styles.input]}
              value={licensePlate}
              onChangeText={setLicensePlate}
              placeholder="Наприклад: АА1234ВВ"
              placeholderTextColor={theme.colors.special.placeholder}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[globalStyles.textPrimary, styles.label]}>
              Дата купівлі
            </Text>
            <TouchableOpacity
              style={[globalStyles.input, styles.input]}
              onPress={() => setShowBoughtAtPicker(true)}
            >
              <Text
                style={
                  boughtAt
                    ? [globalStyles.textPrimary, { paddingVertical: 12 }]
                    : [
                        {
                          color: theme.colors.special.placeholder,
                          paddingVertical: 12,
                        },
                      ]
                }
              >
                {boughtAt
                  ? boughtAt.toLocaleDateString("uk-UA")
                  : "Оберіть дату (необов'язково)"}
              </Text>
            </TouchableOpacity>
            {showBoughtAtPicker && (
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
            )}
          </View>

          <View style={styles.inputContainer}>
            <Select
              label="Колір *"
              options={COLOR_OPTIONS}
              value={color}
              onValueChange={setColor}
              placeholder="Виберіть колір"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[globalStyles.textPrimary, styles.label]}>
              Пробіг (км) *
            </Text>
            <TextInput
              style={[globalStyles.input, styles.input]}
              value={mileage}
              onChangeText={setMileage}
              placeholder="Наприклад: 50000"
              placeholderTextColor={theme.colors.special.placeholder}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={globalStyles.buttonDanger}
              onPress={handleDelete}
              disabled={deleteVehicle.isPending}
            >
              <Text style={globalStyles.buttonDangerText}>
                {deleteVehicle.isPending ? "..." : "🗑️ Видалити"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={globalStyles.buttonSecondary}
              onPress={handleCancel}
              disabled={isSaving}
            >
              <Text style={globalStyles.buttonSecondaryText}>Скасувати</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={globalStyles.buttonPrimary}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={globalStyles.buttonPrimaryText}>
                {isSaving ? "Збереження..." : "Зберегти"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
