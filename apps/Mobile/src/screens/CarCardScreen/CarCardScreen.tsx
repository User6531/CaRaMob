import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
} from "react-native";
import { FormScreen } from "../../components/FormScreen";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./CarCardScreen.styles";
import { CarCardScreenProps } from "../../navigation/types";
import { Select, SelectOption } from "../../components/Select";
import { useAppAlert } from "../../components/AppAlert";
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
import {
  isValidVin,
  normalizeVinInput,
  VIN_VALIDATION_MESSAGE,
} from "../../utils/vinUtils";
import { parseApiErrorMessage } from "../../utils/apiErrorUtils";
import {
  getEnginePowerLabel,
  getTransmissionOptionsForFuel,
  isTransmissionAllowedForFuel,
  normalizeFuelType,
  normalizeTransmissionType,
  requiresEngineDisplacement,
  resolveEngineCapacityCc,
} from "../../utils/vehicleFormUtils";

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

const BODY_CLASS_OPTIONS: SelectOption[] = [
  { label: "Седан", value: "Sedan" },
  { label: "Хетчбек", value: "Hatchback" },
  { label: "Універсал", value: "Universal" },
  { label: "Купе", value: "Coupe" },
  { label: "Кабріолет", value: "Convertible" },
  { label: "Позашляховик", value: "SUV" },
  { label: "Кросовер", value: "Crossover" },
  { label: "Мінівен", value: "Minivan" },
  { label: "Пікап", value: "Pickup" },
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

const TOTAL_STEPS = 6;
const STEP_TITLES = [
  "Базова інформація",
  "Ідентифікація авто",
  "Історія використання",
  "Двигун",
  "Трансмісія та привід",
  "Фото та завершення",
];

export default function CarCardScreen({ navigation }: CarCardScreenProps) {
  const { getAccessToken } = useAuth();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const { showAlert, showError, showSuccess, alertModal } = useAppAlert();
  const [carImage, setCarImage] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | number | undefined>(undefined);
  const [model, setModel] = useState<string | number | undefined>(undefined);
  const [year, setYear] = useState<string | number | undefined>(undefined);
  const [color, setColor] = useState<string | number | undefined>(undefined);
  const [licensePlate, setLicensePlate] = useState("");
  const [vin, setVin] = useState("");
  const [bodyClass, setBodyClass] = useState<string | number | undefined>(
    undefined
  );
  const [fuelType, setFuelType] = useState<number | undefined>(undefined);
  const [displacement, setDisplacement] = useState("");
  const [transmission, setTransmission] = useState<number | undefined>(
    undefined
  );
  const [driveType, setDriveType] = useState<number | undefined>(undefined);
  const [boughtAt, setBoughtAt] = useState(() => new Date());
  const [pickerDate, setPickerDate] = useState(() => new Date());
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
  const [currentStep, setCurrentStep] = useState(0);
  const stepAnimation = useRef(new Animated.Value(1)).current;

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
        showError("Не вдалося завантажити список марок. Спробуйте пізніше.");
      } finally {
        setIsLoadingBrands(false);
      }
    };

    loadBrands();
  }, [showError]);

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
        showError("Не вдалося завантажити список моделей. Спробуйте пізніше.");
        setModelOptions([]);
      } finally {
        setIsLoadingModels(false);
      }
    };

    loadModels();
  }, [brand, showError]);

  useEffect(() => {
    if (!requiresEngineDisplacement(fuelType)) {
      setDisplacement("");
    }

    if (!isTransmissionAllowedForFuel(fuelType, transmission)) {
      setTransmission(undefined);
    }
  }, [fuelType, transmission]);

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

  const openBoughtAtPicker = () => {
    setPickerDate(boughtAt);
    setShowBoughtAtPicker(true);
  };

  const closeBoughtAtPicker = () => {
    setShowBoughtAtPicker(false);
  };

  const confirmBoughtAtPicker = () => {
    setBoughtAt(pickerDate);
    setShowBoughtAtPicker(false);
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      showError("Потрібен дозвіл для доступу до галереї!", "Дозвіл потрібен");
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
      enginePower.trim() !== "";

    if (hasData) {
      showAlert({
        title: "Скасувати створення?",
        message: "Ви вже ввели деякі дані. Ви впевнені, що хочете скасувати?",
        buttons: [
          {
            text: "Продовжити редагування",
            style: "cancel",
          },
          {
            text: "Скасувати",
            style: "destructive",
            onPress: () => navigation.navigate("Home"),
          },
        ],
      });
    } else {
      navigation.navigate("Home");
    }
  };

  const handleSave = async () => {
    if (!brand) {
      showError("Будь ласка, вибери марку автомобіля");
      return;
    }
    if (!model) {
      showError("Будь ласка, вибери модель автомобіля");
      return;
    }
    if (!year) {
      showError("Будь ласка, вибери рік випуску");
      return;
    }
    if (!color) {
      showError("Будь ласка, вибери колір автомобіля");
      return;
    }
    if (!licensePlate.trim()) {
      showError("Будь ласка, введи номерний знак");
      return;
    }
    if (vin.trim().length !== 0 && vin.trim().length !== 17) {
      showError("VIN має містити рівно 17 символів");
      return;
    }
    if (!vin.trim()) {
      showError("Будь ласка, введи VIN номер (17 символів)");
      return;
    }
    if (!isValidVin(vin)) {
      showError(VIN_VALIDATION_MESSAGE);
      return;
    }
    if (fuelType === undefined) {
      showError("Будь ласка, вибери тип палива");
      return;
    }
    if (transmission === undefined) {
      showError("Будь ласка, вибери коробку передач");
      return;
    }
    if (!isTransmissionAllowedForFuel(fuelType, transmission)) {
      showError("Для електрокарів доступні лише автомат або CVT");
      return;
    }
    if (driveType === undefined) {
      showError("Будь ласка, вибери тип приводу");
      return;
    }
    const engineCapacityCc = resolveEngineCapacityCc(fuelType, displacement);
    if (requiresEngineDisplacement(fuelType) && engineCapacityCc === null) {
      showError("Введіть об'єм двигуна в літрах (наприклад 2.0)");
      return;
    }
    const mileageNum = parseInt(mileage.trim(), 10);
    if (mileage.trim() === "" || isNaN(mileageNum) || mileageNum < 0) {
      showError("Введіть пробіг (км)");
      return;
    }
    if (mileageNum > 1000000) {
      showError("Пробіг не може перевищувати 1 000 000 км");
      return;
    }
    const enginePowerNum = parseInt(enginePower.trim(), 10);
    if (!enginePower.trim() || isNaN(enginePowerNum) || enginePowerNum <= 0) {
      showError("Введіть потужність двигуна (к.с.)");
      return;
    }
    if (enginePowerNum > 1000) {
      showError("Потужність не може перевищувати 1000 к.с.");
      return;
    }

    try {
      setIsLoading(true);

      const brandLabel =
        brandOptions.find((opt) => opt.value === brand)?.label || String(brand);
      const modelLabel =
        modelOptions.find((opt) => opt.value === model)?.label || String(model);
      const yearNum =
        typeof year === "number" ? year : parseInt(String(year), 10);
      const colorLabel =
        COLOR_OPTIONS.find((opt) => opt.value === color)?.label ||
        String(color);

      const dto: CreateVehicleDto = {
        licensePlate: licensePlate.trim(),
        vin: vin.trim().toUpperCase(),
        brand: brandLabel,
        model: modelLabel,
        year: yearNum,
        boughtAt: boughtAt.toISOString(),
        wheelDriveType: driveType as WheelDriveType,
        engineCapacity: engineCapacityCc ?? 0,
        fuelType: fuelType as FuelType,
        enginePower: enginePowerNum,
        color: colorLabel,
        transmissionType: transmission as TransmissionType,
        mileage: mileageNum,
        photoUrl:
          carImage && (carImage.startsWith("http") ? carImage : null)
            ? carImage
            : null,
      };

      const apiClient = createApiClient(getAccessToken);
      await apiClient.post<unknown>(ENDPOINTS.VEHICLES, dto);

      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });

      showSuccess("Автомобіль додано в базу", "Успішно!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    } catch (error) {
      console.error("Error saving vehicle:", error);
      showError(parseApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const validateStep = (step: number): boolean => {
    if (step === 0) {
      if (!brand) {
        showError("Будь ласка, вибери марку автомобіля");
        return false;
      }
      if (!model) {
        showError("Будь ласка, вибери модель автомобіля");
        return false;
      }
      if (!year) {
        showError("Будь ласка, вибери рік випуску");
        return false;
      }
      return true;
    }

    if (step === 1) {
      if (!color) {
        showError("Будь ласка, вибери колір автомобіля");
        return false;
      }
      if (!licensePlate.trim()) {
        showError("Будь ласка, введи номерний знак");
        return false;
      }
      if (vin.trim().length !== 0 && vin.trim().length !== 17) {
        showError("VIN має містити рівно 17 символів");
        return false;
      }
      if (!vin.trim()) {
        showError("Будь ласка, введи VIN номер (17 символів)");
        return false;
      }
      if (!isValidVin(vin)) {
        showError(VIN_VALIDATION_MESSAGE);
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (
        mileage.trim() === "" ||
        isNaN(parseInt(mileage.trim(), 10)) ||
        parseInt(mileage.trim(), 10) < 0
      ) {
        showError("Введіть пробіг (км)");
        return false;
      }
      if (parseInt(mileage.trim(), 10) > 1000000) {
        showError("Пробіг не може перевищувати 1 000 000 км");
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (fuelType === undefined) {
        showError("Будь ласка, вибери тип палива");
        return false;
      }
      if (requiresEngineDisplacement(fuelType)) {
        const engineCapacityCc = resolveEngineCapacityCc(fuelType, displacement);
        if (engineCapacityCc === null) {
          showError("Введіть об'єм двигуна в літрах (наприклад 2.0)");
          return false;
        }
      }
      const enginePowerNum = parseInt(enginePower.trim(), 10);
      if (!enginePower.trim() || isNaN(enginePowerNum) || enginePowerNum <= 0) {
        showError("Введіть потужність двигуна (к.с.)");
        return false;
      }
      if (enginePowerNum > 1000) {
        showError("Потужність не може перевищувати 1000 к.с.");
        return false;
      }
      return true;
    }

    if (step === 4) {
      if (transmission === undefined) {
        showError("Будь ласка, вибери коробку передач");
        return false;
      }
      if (!isTransmissionAllowedForFuel(fuelType, transmission)) {
        showError("Для електрокарів доступні лише автомат або CVT");
        return false;
      }
      if (driveType === undefined) {
        showError("Будь ласка, вибери тип приводу");
        return false;
      }
      return true;
    }

    return true;
  };

  const animateStepTransition = (nextStep: number) => {
    Animated.sequence([
      Animated.timing(stepAnimation, {
        toValue: 0,
        duration: 140,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(stepAnimation, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    setCurrentStep(nextStep);
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) {
      return;
    }
    if (currentStep < TOTAL_STEPS - 1) {
      animateStepTransition(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      animateStepTransition(currentStep - 1);
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
    <FormScreen
      style={[globalStyles.container, globalStyles.pageBackground]}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.header}>
        <Text style={[globalStyles.textLarge, styles.title]}>
          Додай свій автомобіль
        </Text>
        <Text style={[globalStyles.textSecondary, styles.subtitle]}>
          Створи картку твого авто
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.stepHeaderContainer}>
          <View style={styles.stepHeaderTop}>
            <Text style={[globalStyles.textPrimary, styles.stepTitle]}>
              Крок {currentStep + 1} з {TOTAL_STEPS}
            </Text>
            <Text style={[globalStyles.textSecondary, styles.stepSubtitle]}>
              {STEP_TITLES[currentStep]}
            </Text>
          </View>
          <View style={styles.stepDots}>
            {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.stepDot,
                  index < currentStep && styles.stepDotCompleted,
                  index === currentStep && styles.stepDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <Animated.View
          style={[
            styles.stepCard,
            {
              opacity: stepAnimation,
              transform: [
                {
                  translateY: stepAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {currentStep === 0 && (
            <>
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

              <Select
                label="Рік випуску *"
                options={yearOptions}
                value={year}
                onValueChange={setYear}
                placeholder="Виберіть рік випуску"
              />
            </>
          )}

          {currentStep === 1 && (
            <>
              <Select
                label="Колір *"
                options={COLOR_OPTIONS}
                value={color}
                onValueChange={setColor}
                placeholder="Виберіть колір автомобіля"
              />

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
                  VIN номер *
                </Text>
                <TextInput
                  style={[globalStyles.input, styles.input]}
                  value={vin}
                  onChangeText={(text) => setVin(normalizeVinInput(text))}
                  placeholder="17 символів (латиниця, без I, O, Q)"
                  placeholderTextColor={theme.colors.special.placeholder}
                  autoCapitalize="characters"
                  maxLength={17}
                />
              </View>

            </>
          )}

          {currentStep === 2 && (
            <>
              <View style={styles.inputContainer}>
                <Text style={[globalStyles.textPrimary, styles.label]}>
                  Дата купівлі
                </Text>
                <TouchableOpacity
                  style={[globalStyles.input, styles.input]}
                  onPress={openBoughtAtPicker}
                >
                  <Text style={[globalStyles.textPrimary, styles.dateInputText]}>
                    {boughtAt.toLocaleDateString("uk-UA")}
                  </Text>
                </TouchableOpacity>
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
            </>
          )}

          {currentStep === 3 && (
            <>
              <Select
                label="Тип палива *"
                options={FUEL_TYPE_OPTIONS}
                value={fuelType}
                onValueChange={(value) =>
                  setFuelType(normalizeFuelType(value))
                }
                placeholder="Виберіть тип палива"
              />

              <View style={styles.inputContainer}>
                <Text style={[globalStyles.textPrimary, styles.label]}>
                  {getEnginePowerLabel(fuelType)}
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

              {requiresEngineDisplacement(fuelType) && (
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
              )}

              <Select
                label="Тип кузова"
                options={BODY_CLASS_OPTIONS}
                value={bodyClass}
                onValueChange={setBodyClass}
                placeholder="Виберіть тип кузова"
              />
            </>
          )}

          {currentStep === 4 && (
            <>
              <Select
                label="Коробка передач *"
                options={getTransmissionOptionsForFuel(
                  fuelType,
                  TRANSMISSION_API_OPTIONS
                )}
                value={transmission}
                onValueChange={(value) =>
                  setTransmission(normalizeTransmissionType(value))
                }
                placeholder={
                  normalizeFuelType(fuelType) === FuelType.Electric
                    ? "Для електрокарів — автомат або CVT"
                    : "Виберіть коробку передач"
                }
              />

              <Select
                label="Привід *"
                options={WHEEL_DRIVE_API_OPTIONS}
                value={driveType}
                onValueChange={(v) => setDriveType(v as number)}
                placeholder="Виберіть тип приводу"
              />
            </>
          )}

          {currentStep === 5 && (
            <View style={styles.imageSection}>
              <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
                {carImage ? (
                  <Image source={{ uri: carImage }} style={styles.carImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>🚗</Text>
                    <Text style={styles.placeholderLabel}>Додати фото авто</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={globalStyles.buttonSecondary}
            onPress={currentStep === 0 ? handleCancel : handlePreviousStep}
          >
            <Text style={globalStyles.buttonSecondaryText}>
              {currentStep === 0 ? "Скасувати" : "Назад"}
            </Text>
          </TouchableOpacity>

          {currentStep < TOTAL_STEPS - 1 ? (
            <TouchableOpacity
              style={globalStyles.buttonPrimary}
              onPress={handleNextStep}
            >
              <Text style={globalStyles.buttonPrimaryText}>Далі</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={globalStyles.buttonPrimary}
              onPress={handleSave}
            >
              <Text style={globalStyles.buttonPrimaryText}>Зберегти</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {Platform.OS === "ios" ? (
        <Modal
          visible={showBoughtAtPicker}
          transparent
          animationType="slide"
          onRequestClose={closeBoughtAtPicker}
        >
          <View style={styles.datePickerModalRoot}>
            <TouchableOpacity
              style={styles.datePickerBackdrop}
              activeOpacity={1}
              onPress={closeBoughtAtPicker}
            />
            <View style={styles.datePickerSheet}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity onPress={confirmBoughtAtPicker}>
                  <Text
                    style={[
                      globalStyles.textPrimary,
                      styles.datePickerDoneText,
                    ]}
                  >
                    Готово
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={pickerDate}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                themeVariant="dark"
                textColor={theme.colors.text.primary}
                onChange={(_, date) => {
                  if (date) setPickerDate(date);
                }}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showBoughtAtPicker && (
          <DateTimePicker
            value={pickerDate}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={(event, date) => {
              setShowBoughtAtPicker(false);
              if (event.type === "set" && date) {
                setBoughtAt(date);
              }
            }}
          />
        )
      )}
      {alertModal}
    </FormScreen>
  );
}
