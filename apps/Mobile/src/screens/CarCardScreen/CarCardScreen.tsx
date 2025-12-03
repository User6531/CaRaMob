import React, { useState } from "react";
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
import * as ImagePicker from "expo-image-picker";
import { useCar } from "../../context/CarContext";
import { useTheme } from "../../hooks/useTheme";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./CarCardScreen.styles";
import { CarCardScreenProps } from "../../navigation/types";
import { VinDecoder } from "../../components/VinDecoder";
import { Select, SelectOption } from "../../components/Select";

// Моки для селектів
const BRAND_OPTIONS: SelectOption[] = [
  { label: "Toyota", value: "toyota" },
  { label: "BMW", value: "bmw" },
  { label: "Mercedes-Benz", value: "mercedes" },
  { label: "Audi", value: "audi" },
  { label: "Volkswagen", value: "volkswagen" },
];

const MODEL_OPTIONS: SelectOption[] = [
  { label: "Camry", value: "camry" },
  { label: "X5", value: "x5" },
  { label: "C-Class", value: "c-class" },
  { label: "A4", value: "a4" },
  { label: "Golf", value: "golf" },
];

const YEAR_OPTIONS: SelectOption[] = [
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
  { label: "2022", value: "2022" },
  { label: "2021", value: "2021" },
  { label: "2020", value: "2020" },
];

const COLOR_OPTIONS: SelectOption[] = [
  { label: "Чорний", value: "black" },
  { label: "Білий", value: "white" },
  { label: "Сірий", value: "gray" },
  { label: "Сріблястий", value: "silver" },
  { label: "Червоний", value: "red" },
];

export default function CarCardScreen({ navigation }: CarCardScreenProps) {
  const { addCar } = useCar();
  const theme = useTheme();
  const [carImage, setCarImage] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | number | undefined>(undefined);
  const [model, setModel] = useState<string | number | undefined>(undefined);
  const [year, setYear] = useState<string | number | undefined>(undefined);
  const [color, setColor] = useState<string | number | undefined>(undefined);
  const [licensePlate, setLicensePlate] = useState("");
  const [vin, setVin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVinDecodeSuccess = (data: {
    brand: string;
    model: string;
    year: string;
    vin: string;
  }) => {
    // Знаходимо відповідні значення в опціях
    const brandOption = BRAND_OPTIONS.find(
      (opt) => opt.label.toLowerCase() === data.brand.toLowerCase()
    );
    const modelOption = MODEL_OPTIONS.find(
      (opt) => opt.label.toLowerCase() === data.model.toLowerCase()
    );
    const yearOption = YEAR_OPTIONS.find((opt) => opt.value === data.year);

    setBrand(brandOption?.value || data.brand);
    setModel(modelOption?.value || data.model);
    setYear(yearOption?.value || data.year);
    setVin(data.vin);
  };

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
      setCarImage(result.assets[0].uri);
    }
  };

  const handleCancel = () => {
    const hasData =
      brand !== undefined ||
      model !== undefined ||
      year !== undefined ||
      color !== undefined ||
      licensePlate.trim() ||
      vin.trim() ||
      carImage;

    if (hasData) {
      Alert.alert(
        "Скасувати створення?",
        "Ви вже ввели деякі дані. Ви впевнені, що хочете скасувати?",
        [
          {
            text: "Продовжити редагування",
            style: "cancel",
          },
          {
            text: "Скасувати",
            style: "destructive",
            onPress: () => navigation.navigate("Home"),
          },
        ]
      );
    } else {
      navigation.navigate("Home");
    }
  };

  const handleSave = async () => {
    if (!brand) {
      Alert.alert("Помилка", "Будь ласка, вибери марку автомобіля");
      return;
    }
    if (!model) {
      Alert.alert("Помилка", "Будь ласка, вибери модель автомобіля");
      return;
    }
    if (!year) {
      Alert.alert("Помилка", "Будь ласка, вибери рік випуску");
      return;
    }
    if (!color) {
      Alert.alert("Помилка", "Будь ласка, вибери колір автомобіля");
      return;
    }
    if (!licensePlate.trim()) {
      Alert.alert("Помилка", "Будь ласка, введи номерний знак");
      return;
    }

    try {
      setIsLoading(true);

      // Отримуємо label для збереження
      const brandLabel =
        BRAND_OPTIONS.find((opt) => opt.value === brand)?.label ||
        String(brand);
      const modelLabel =
        MODEL_OPTIONS.find((opt) => opt.value === model)?.label ||
        String(model);
      const yearLabel =
        YEAR_OPTIONS.find((opt) => opt.value === year)?.label || String(year);
      const colorLabel =
        COLOR_OPTIONS.find((opt) => opt.value === color)?.label ||
        String(color);

      addCar({
        brand: brandLabel,
        model: modelLabel,
        year: yearLabel,
        color: colorLabel,
        licensePlate,
        vin,
        carImage,
      });

      Alert.alert("Успішно!", "Картка автомобіля створена", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    } catch (error) {
      console.error("Error saving car:", error);
      Alert.alert("Помилка", "Не вдалося зберегти дані");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.pageBackground,
          globalStyles.loadingContainer,
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.accent.primary} />
        <Text style={globalStyles.loadingText}>Збереження даних...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[globalStyles.container, globalStyles.pageBackground]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={[globalStyles.textLarge, styles.title]}>
            Додай свій автомобіль
          </Text>
          <Text style={[globalStyles.textSecondary, styles.subtitle]}>
            Створи картку твого авто
          </Text>
        </View>

        <View style={styles.form}>
          {/* VIN Decode Field */}
          <VinDecoder onDecodeSuccess={handleVinDecodeSuccess} />

          {/* Car Image */}
          <View style={styles.imageSection}>
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
              {carImage ? (
                <Image source={{ uri: carImage }} style={styles.carImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>🚗</Text>
                  <Text style={styles.placeholderLabel}>Фото авто</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Brand Field */}
          <Select
            label="Марка *"
            options={BRAND_OPTIONS}
            value={brand}
            onValueChange={setBrand}
            placeholder="Виберіть марку автомобіля"
          />

          {/* Model Field */}
          <Select
            label="Модель *"
            options={MODEL_OPTIONS}
            value={model}
            onValueChange={setModel}
            placeholder="Виберіть модель автомобіля"
          />

          {/* Year Field */}
          <Select
            label="Рік випуску *"
            options={YEAR_OPTIONS}
            value={year}
            onValueChange={setYear}
            placeholder="Виберіть рік випуску"
          />

          {/* Color Field */}
          <Select
            label="Колір *"
            options={COLOR_OPTIONS}
            value={color}
            onValueChange={setColor}
            placeholder="Виберіть колір автомобіля"
          />

          {/* License Plate Field */}
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

          {/* VIN Field */}
          <View style={styles.inputContainer}>
            <Text style={[globalStyles.textPrimary, styles.label]}>
              VIN номер
            </Text>
            <TextInput
              style={[globalStyles.input, styles.input]}
              value={vin}
              onChangeText={setVin}
              placeholder="17-значний VIN номер (необов'язково)"
              placeholderTextColor={theme.colors.special.placeholder}
              autoCapitalize="characters"
              maxLength={17}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={globalStyles.buttonSecondary}
              onPress={handleCancel}
            >
              <Text style={globalStyles.buttonSecondaryText}>Скасувати</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={globalStyles.buttonPrimary}
              onPress={handleSave}
            >
              <Text style={globalStyles.buttonPrimaryText}>Зберегти</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
