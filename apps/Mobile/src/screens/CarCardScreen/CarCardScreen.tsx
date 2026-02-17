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
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./CarCardScreen.styles";
import { CarCardScreenProps } from "../../navigation/types";
import { Select, SelectOption } from "../../components/Select";
import {
  getAllMakes,
  getModelsForMakeId,
  generateYearOptions,
} from "../../api/services/nhtsaService";
import { useQueryClient } from "@tanstack/react-query";
import { createApiClient } from "../../api/client";
import { ENDPOINTS } from "../../config/api";
import { queryKeys } from "../../queries/queryKeys";
import {
  CreateVehicleDto,
  FuelType,
  TransmissionType,
  WheelDriveType,
} from "../../types/api";

const COLOR_OPTIONS: SelectOption[] = [
  { label: "Чорний", value: "black" },
  { label: "Білий", value: "white" },
  { label: "Сірий", value: "gray" },
  { label: "Сріблястий", value: "silver" },
  { label: "Червоний", value: "red" },
];

const BODY_CLASS_OPTIONS: SelectOption[] = [
  { label: "Sedan", value: "Sedan" },
  { label: "Hatchback", value: "Hatchback" },
  { label: "Universal", value: "Universal" },
  { label: "Coupe", value: "Coupe" },
  { label: "Convertible", value: "Convertible" },
  { label: "SUV", value: "SUV" },
  { label: "Crossover", value: "Crossover" },
  { label: "Minivan", value: "Minivan" },
  { label: "Pickup", value: "Pickup" },
];

// Відповідають enum FuelType на бекенді (0–5)
const FUEL_TYPE_OPTIONS: SelectOption[] = [
  { label: "Бензин", value: FuelType.Gasoline },
  { label: "Дизель", value: FuelType.Diesel },
  { label: "Електро", value: FuelType.Electric },
  { label: "Гібрид", value: FuelType.Hybrid },
  { label: "Плагін-гібрид", value: FuelType.PlugInHybrid },
  { label: "Водень", value: FuelType.Hydrogen },
];

const TRANSMISSION_API_OPTIONS: SelectOption[] = [
  { label: "Механіка", value: TransmissionType.Manual },
  { label: "Автомат", value: TransmissionType.Automatic },
  { label: "CVT", value: TransmissionType.CVT },
  { label: "Робот", value: TransmissionType.SemiAutomatic },
  { label: "Преселективна", value: TransmissionType.DualClutch },
];

const WHEEL_DRIVE_API_OPTIONS: SelectOption[] = [
  { label: "Передній (FWD)", value: WheelDriveType.FWD },
  { label: "Задній (RWD)", value: WheelDriveType.RWD },
  { label: "Повний (AWD)", value: WheelDriveType.AWD },
  { label: "4WD", value: WheelDriveType.FourWD },
];

export default function CarCardScreen({ navigation }: CarCardScreenProps) {
  const { getAccessToken } = useAuth();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [carImage, setCarImage] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | number | undefined>(undefined);
  const [model, setModel] = useState<string | number | undefined>(undefined);
  const [year, setYear] = useState<string | number | undefined>(undefined);
  const [color, setColor] = useState<string | number | undefined>(undefined);
  const [licensePlate, setLicensePlate] = useState("");
  const [vin, setVin] = useState("");
  const [bodyClass, setBodyClass] = useState<string | number | undefined>(undefined);
  const [fuelType, setFuelType] = useState<number | undefined>(undefined);
  const [displacement, setDisplacement] = useState("");
  const [transmission, setTransmission] = useState<number | undefined>(undefined);
  const [driveType, setDriveType] = useState<number | undefined>(undefined);
  const [boughtAt, setBoughtAt] = useState<Date | null>(null);
  const [showBoughtAtPicker, setShowBoughtAtPicker] = useState(false);
  const [mileage, setMileage] = useState("");
  const [enginePower, setEnginePower] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // NHTSA API дані
  const [brandOptions, setBrandOptions] = useState<SelectOption[]>([]);
  const [modelOptions, setModelOptions] = useState<SelectOption[]>([]);
  const [yearOptions] = useState<SelectOption[]>(generateYearOptions());
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // Завантаження марок при монтуванні компонента
  useEffect(() => {
    const loadBrands = async () => {
      try {
        setIsLoadingBrands(true);
        const makes = await getAllMakes();
        const options: SelectOption[] = makes.map((make) => ({
          label: make.MakeName,
          value: make.MakeId,
        }));
        setBrandOptions(options);
      } catch (error) {
        console.error("Error loading brands:", error);
        Alert.alert(
          "Помилка",
          "Не вдалося завантажити список марок. Спробуйте пізніше."
        );
      } finally {
        setIsLoadingBrands(false);
      }
    };

    loadBrands();
  }, []);

  // Завантаження моделей при зміні марки
  useEffect(() => {
    const loadModels = async () => {
      if (!brand || typeof brand !== "number") {
        setModelOptions([]);
        setModel(undefined);
      return;
    }

    try {
        setIsLoadingModels(true);
        const models = await getModelsForMakeId(brand);
        const options: SelectOption[] = models.map((model) => ({
          label: model.Model_Name,
          value: model.Model_ID,
        }));
        setModelOptions(options);
        // Скидаємо вибір моделі при зміні марки
        setModel(undefined);
      } catch (error) {
        console.error("Error loading models:", error);
        Alert.alert(
          "Помилка",
          "Не вдалося завантажити список моделей. Спробуйте пізніше."
        );
        setModelOptions([]);
      } finally {
        setIsLoadingModels(false);
      }
    };

    loadModels();
  }, [brand]);

  // const handleVinDecodeSuccess = async (data: {
  //   brand: string;
  //   model: string;
  //   year: string;
  //   vin: string;
  //   bodyClass?: string;
  //   fuelType?: string;
  //   displacement?: string;
  //   transmission?: string;
  //   driveType?: string;
  // }) => {
  //   try {
  //     // Знаходимо марку за назвою
  //     const brandOption = brandOptions.find(
  //       (opt) => opt.label.toLowerCase() === data.brand.toLowerCase()
  //     );

  //     if (brandOption) {
  //       setBrand(brandOption.value as number);
  //       setVin(data.vin);

  //       // Завантажуємо моделі для знайденої марки
  //       const models = await getModelsForMakeId(brandOption.value as number);
  //       const modelOptions: SelectOption[] = models.map((m) => ({
  //         label: m.Model_Name,
  //         value: m.Model_ID,
  //       }));
  //       setModelOptions(modelOptions);

  //       // Знаходимо модель
  //       const modelOption = modelOptions.find(
  //         (opt) => opt.label.toLowerCase() === data.model.toLowerCase()
  //       );
  //       if (modelOption) {
  //         setModel(modelOption.value as number);
  //       }

  //       // Встановлюємо рік
  //       const yearOption = yearOptions.find((opt) => opt.value === data.year);
  //       if (yearOption) {
  //         setYear(yearOption.value);
  //       }

  //       // Встановлюємо нові поля з VIN декодування
  //       if (data.bodyClass) {
  //         setBodyClass(data.bodyClass);
  //       }
  //       if (data.fuelType) {
  //         setFuelType(data.fuelType);
  //       }
  //       if (data.displacement) {
  //         setDisplacement(data.displacement);
  //       }
  //       if (data.transmission) {
  //         setTransmission(data.transmission);
  //       }
  //       if (data.driveType) {
  //         setDriveType(data.driveType);
  //       }
  //     } else {
  //       // Якщо марку не знайдено, встановлюємо тільки VIN та нові поля
  //       setVin(data.vin);
  //       if (data.bodyClass) setBodyClass(data.bodyClass);
  //       if (data.fuelType) setFuelType(data.fuelType);
  //       if (data.displacement) setDisplacement(data.displacement);
  //       if (data.transmission) setTransmission(data.transmission);
  //       if (data.driveType) setDriveType(data.driveType);
  //       Alert.alert(
  //         "Увага",
  //         "Марку не знайдено в списку. Будь ласка, виберіть марку вручну."
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error processing VIN decode:", error);
  //     setVin(data.vin);
  //   }
  // };

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
      carImage ||
      mileage.trim() !== "" ||
      enginePower.trim() !== "" ||
      boughtAt !== null;

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
    if (vin.trim().length !== 0 && vin.trim().length !== 17) {
      Alert.alert("Помилка", "VIN має містити рівно 17 символів");
      return;
    }
    if (!vin.trim()) {
      Alert.alert("Помилка", "Будь ласка, введи VIN номер (17 символів)");
      return;
    }
    if (fuelType === undefined) {
      Alert.alert("Помилка", "Будь ласка, вибери тип палива");
      return;
    }
    if (transmission === undefined) {
      Alert.alert("Помилка", "Будь ласка, вибери коробку передач");
      return;
    }
    if (driveType === undefined) {
      Alert.alert("Помилка", "Будь ласка, вибери тип приводу");
      return;
    }
    const displacementNum = displacement.trim() ? parseFloat(displacement.replace(",", ".")) : 0;
    if (!displacement.trim() || isNaN(displacementNum) || displacementNum <= 0) {
      Alert.alert("Помилка", "Введіть об'єм двигуна в літрах (наприклад 2.0)");
      return;
    }
    const engineCapacityCc = Math.round(displacementNum * 1000);
    if (engineCapacityCc <= 0 || engineCapacityCc > 10000) {
      Alert.alert("Помилка", "Об'єм двигуна має бути від 0.001 до 10 л");
      return;
    }
    const mileageNum = parseInt(mileage.trim(), 10);
    if (mileage.trim() === "" || isNaN(mileageNum) || mileageNum < 0) {
      Alert.alert("Помилка", "Введіть пробіг (км)");
      return;
    }
    if (mileageNum > 1000000) {
      Alert.alert("Помилка", "Пробіг не може перевищувати 1 000 000 км");
      return;
    }
    const enginePowerNum = parseInt(enginePower.trim(), 10);
    if (!enginePower.trim() || isNaN(enginePowerNum) || enginePowerNum <= 0) {
      Alert.alert("Помилка", "Введіть потужність двигуна (к.с.)");
      return;
    }
    if (enginePowerNum > 1000) {
      Alert.alert("Помилка", "Потужність не може перевищувати 1000 к.с.");
      return;
    }

    try {
      setIsLoading(true);

      const brandLabel =
        brandOptions.find((opt) => opt.value === brand)?.label || String(brand);
      const modelLabel =
        modelOptions.find((opt) => opt.value === model)?.label || String(model);
      const yearNum = typeof year === "number" ? year : parseInt(String(year), 10);
      const colorLabel =
        COLOR_OPTIONS.find((opt) => opt.value === color)?.label ||
        String(color);

      const dto: CreateVehicleDto = {
        licensePlate: licensePlate.trim(),
        vin: vin.trim(),
        brand: brandLabel,
        model: modelLabel,
        year: yearNum,
        boughtAt: boughtAt ? boughtAt.toISOString() : null,
        wheelDriveType: driveType as WheelDriveType,
        engineCapacity: engineCapacityCc,
        fuelType: fuelType as FuelType,
        enginePower: enginePowerNum,
        color: colorLabel,
        transmissionType: transmission as TransmissionType,
        mileage: mileageNum,
        photoUrl: carImage && (carImage.startsWith("http") ? carImage : null) ? carImage : null,
      };

      const apiClient = createApiClient(getAccessToken);
      await apiClient.post<unknown>(ENDPOINTS.VEHICLES, dto);

      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });

      Alert.alert("Успішно!", "Автомобіль додано в базу", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    } catch (error) {
      console.error("Error saving vehicle:", error);
      const message = error instanceof Error ? error.message : "Не вдалося зберегти дані";
      Alert.alert("Помилка", message);
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
          {/* <VinDecoder onDecodeSuccess={handleVinDecodeSuccess} /> */}

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
          <View style={styles.inputContainer}>
            <Select
              label="Марка *"
              options={brandOptions}
              value={brand}
              onValueChange={setBrand}
              placeholder={
                isLoadingBrands
                  ? "Завантаження марок..."
                  : "Виберіть марку автомобіля"
              }
            />
            {isLoadingBrands && (
              <View style={styles.loadingIndicator}>
                <ActivityIndicator
                  size="small"
                  color={theme.colors.accent.primary}
                />
              </View>
            )}
          </View>

          {/* Model Field */}
          <View style={styles.inputContainer}>
            <Select
              label="Модель *"
              options={modelOptions}
              value={model}
              onValueChange={setModel}
              placeholder={
                !brand
                  ? "Спочатку виберіть марку"
                  : isLoadingModels
                    ? "Завантаження моделей..."
                    : "Виберіть модель автомобіля"
              }
              disabled={!brand || isLoadingModels}
            />
            {isLoadingModels && (
              <View style={styles.loadingIndicator}>
                <ActivityIndicator
                  size="small"
                  color={theme.colors.accent.primary}
                />
              </View>
            )}
          </View>

          {/* Year Field */}
          <Select
            label="Рік випуску *"
            options={yearOptions}
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
              VIN номер *
            </Text>
            <TextInput
              style={[globalStyles.input, styles.input]}
              value={vin}
              onChangeText={setVin}
              placeholder="17 символів (обов'язково)"
              placeholderTextColor={theme.colors.special.placeholder}
              autoCapitalize="characters"
              maxLength={17}
            />
          </View>

          {/* Date bought */}
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
                        { color: theme.colors.special.placeholder, paddingVertical: 12 },
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

          {/* Mileage */}
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

          {/* Engine power */}
          <View style={styles.inputContainer}>
            <Text style={[globalStyles.textPrimary, styles.label]}>
              Потужність двигуна (к.с.) *
            </Text>
            <TextInput
              style={[globalStyles.input, styles.input]}
              value={enginePower}
              onChangeText={setEnginePower}
              placeholder="Наприклад: 150"
              placeholderTextColor={theme.colors.special.placeholder}
              keyboardType="number-pad"
            />
          </View>

          {/* Body Class Field */}
          <Select
            label="Тип кузова"
            options={BODY_CLASS_OPTIONS}
            value={bodyClass}
            onValueChange={setBodyClass}
            placeholder="Виберіть тип кузова"
          />

          {/* Fuel Type Field */}
          <Select
            label="Тип палива *"
            options={FUEL_TYPE_OPTIONS}
            value={fuelType}
            onValueChange={(v) => setFuelType(v as number)}
            placeholder="Виберіть тип палива"
          />

          {/* Displacement Field */}
          <View style={styles.inputContainer}>
            <Text style={[globalStyles.textPrimary, styles.label]}>
              Об&apos;єм двигуна (л) *
            </Text>
            <TextInput
              style={[globalStyles.input, styles.input]}
              value={displacement}
              onChangeText={setDisplacement}
              placeholder="Наприклад: 2.0, 3.5"
              placeholderTextColor={theme.colors.special.placeholder}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Transmission Field */}
          <Select
            label="Коробка передач *"
            options={TRANSMISSION_API_OPTIONS}
            value={transmission}
            onValueChange={(v) => setTransmission(v as number)}
            placeholder="Виберіть коробку передач"
          />

          {/* Drive Type Field */}
          <Select
            label="Привід *"
            options={WHEEL_DRIVE_API_OPTIONS}
            value={driveType}
            onValueChange={(v) => setDriveType(v as number)}
            placeholder="Виберіть тип приводу"
          />

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
