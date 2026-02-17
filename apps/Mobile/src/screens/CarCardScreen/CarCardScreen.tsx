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
import * as ImagePicker from "expo-image-picker";
import { useCar } from "../../context/CarContext";
import { useTheme } from "../../hooks/useTheme";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./CarCardScreen.styles";
import { CarCardScreenProps } from "../../navigation/types";
// import { VinDecoder } from "../../components/VinDecoder";
import { Select, SelectOption } from "../../components/Select";
import {
  getAllMakes,
  getModelsForMakeId,
  generateYearOptions,
  getVariableValues,
} from "../../api/services/nhtsaService";

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

const FUEL_TYPE_OPTIONS: SelectOption[] = [
  { label: "Gasoline", value: "Gasoline" },
  { label: "Diesel", value: "Diesel" },
  { label: "LPG (Liquefied Petroleum Gas)", value: "LPG" },
  { label: "CNG (Compressed Natural Gas)", value: "CNG" },
  { label: "LPG + Petrol (Bi-Fuel)", value: "LPG + Petrol" },
  { label: "CNG + Petrol (Bi-Fuel)", value: "CNG + Petrol" },
  { label: "Hybrid (HEV)", value: "Hybrid" },
  { label: "Plug-in Hybrid (PHEV)", value: "Plug-in Hybrid" },
  { label: "Mild Hybrid (MHEV)", value: "Mild Hybrid" },
  { label: "Electric", value: "Electric" },
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
  const [bodyClass, setBodyClass] = useState<string | number | undefined>(undefined);
  const [fuelType, setFuelType] = useState<string | number | undefined>(undefined);
  const [displacement, setDisplacement] = useState("");
  const [transmission, setTransmission] = useState<string | number | undefined>(undefined);
  const [driveType, setDriveType] = useState<string | number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // NHTSA API дані
  const [brandOptions, setBrandOptions] = useState<SelectOption[]>([]);
  const [modelOptions, setModelOptions] = useState<SelectOption[]>([]);
  const [yearOptions] = useState<SelectOption[]>(generateYearOptions());
  const [transmissionOptions, setTransmissionOptions] = useState<SelectOption[]>([]);
  const [driveTypeOptions, setDriveTypeOptions] = useState<SelectOption[]>([]);
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

  // Завантаження опцій для нових полів
  useEffect(() => {
    const loadOptions = async () => {
      try {
        // Завантажуємо опції для коробки передач
        const transmissions = await getVariableValues("Transmission Style");
        setTransmissionOptions(
          transmissions.map((item) => ({ label: item, value: item }))
        );

        // Завантажуємо опції для приводу
        const driveTypes = await getVariableValues("Drive Type");
        setDriveTypeOptions(
          driveTypes.map((item) => ({ label: item, value: item }))
        );
      } catch (error) {
        console.error("Error loading options:", error);
      }
    };

    loadOptions();
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
        brandOptions.find((opt) => opt.value === brand)?.label || String(brand);
      const modelLabel =
        modelOptions.find((opt) => opt.value === model)?.label || String(model);
      const yearLabel =
        yearOptions.find((opt) => opt.value === year)?.label || String(year);
      const colorLabel =
        COLOR_OPTIONS.find((opt) => opt.value === color)?.label ||
        String(color);
      const bodyClassLabel =
        BODY_CLASS_OPTIONS.find((opt) => opt.value === bodyClass)?.label ||
        String(bodyClass || "");
      const fuelTypeLabel =
        FUEL_TYPE_OPTIONS.find((opt) => opt.value === fuelType)?.label ||
        String(fuelType || "");
      const transmissionLabel =
        transmissionOptions.find((opt) => opt.value === transmission)?.label ||
        String(transmission || "");
      const driveTypeLabel =
        driveTypeOptions.find((opt) => opt.value === driveType)?.label ||
        String(driveType || "");

      addCar({
        brand: brandLabel,
        model: modelLabel,
        year: yearLabel,
        color: colorLabel,
        licensePlate,
        vin,
        carImage,
        bodyClass: bodyClassLabel,
        fuelType: fuelTypeLabel,
        displacement,
        transmission: transmissionLabel,
        driveType: driveTypeLabel,
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
            label="Тип палива"
            options={FUEL_TYPE_OPTIONS}
            value={fuelType}
            onValueChange={setFuelType}
            placeholder="Виберіть тип палива"
          />

          {/* Displacement Field */}
          <View style={styles.inputContainer}>
            <Text style={[globalStyles.textPrimary, styles.label]}>
              Об&apos;єм двигуна (л)
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
            label="Коробка передач"
            options={transmissionOptions}
            value={transmission}
            onValueChange={setTransmission}
            placeholder="Виберіть коробку передач"
          />

          {/* Drive Type Field */}
          <Select
            label="Привід"
            options={driveTypeOptions}
            value={driveType}
            onValueChange={setDriveType}
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
