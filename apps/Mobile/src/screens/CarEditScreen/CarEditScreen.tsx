import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCar, Car } from '../../context/CarContext';
import { useTheme } from '../../hooks/useTheme';
import { globalStyles } from '../../styles/globalStyles';
import { styles } from './CarEditScreen.styles';

export default function CarEditScreen({ navigation, route }: any) {
  const { getCarById, updateCar, deleteCar } = useCar();
  const theme = useTheme();
  const { carId } = route.params;
  
  const [carImage, setCarImage] = useState<string | null>(null);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [vin, setVin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const car = getCarById(carId);
    if (car) {
      setCarImage(car.carImage);
      setBrand(car.brand);
      setModel(car.model);
      setYear(car.year);
      setColor(car.color);
      setLicensePlate(car.licensePlate);
      setVin(car.vin);
    }
  }, [carId, getCarById]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Дозвіл потрібен', 'Потрібен дозвіл для доступу до галереї!');
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
    const hasChanges = 
      brand !== getCarById(carId)?.brand ||
      model !== getCarById(carId)?.model ||
      year !== getCarById(carId)?.year ||
      color !== getCarById(carId)?.color ||
      licensePlate !== getCarById(carId)?.licensePlate ||
      vin !== getCarById(carId)?.vin ||
      carImage !== getCarById(carId)?.carImage;
    
    if (hasChanges) {
      Alert.alert(
        'Скасувати зміни?',
        'Ви внесли зміни. Ви впевнені, що хочете скасувати?',
        [
          {
            text: 'Продовжити редагування',
            style: 'cancel'
          },
          {
            text: 'Скасувати',
            style: 'destructive',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleSave = async () => {
    if (!brand.trim()) {
      Alert.alert('Помилка', 'Будь ласка, введи марку автомобіля');
      return;
    }
    if (!model.trim()) {
      Alert.alert('Помилка', 'Будь ласка, введи модель автомобіля');
      return;
    }
    if (!year.trim()) {
      Alert.alert('Помилка', 'Будь ласка, введи рік випуску');
      return;
    }
    if (!color.trim()) {
      Alert.alert('Помилка', 'Будь ласка, введи колір автомобіля');
      return;
    }
    if (!licensePlate.trim()) {
      Alert.alert('Помилка', 'Будь ласка, введи номерний знак');
      return;
    }

    try {
      setIsLoading(true);
      
      updateCar(carId, {
        brand,
        model,
        year,
        color,
        licensePlate,
        vin,
        carImage,
      });
      
      Alert.alert(
        'Успішно!', 
        'Дані автомобіля оновлені',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося зберегти дані');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Видалити автомобіль?',
      'Ви впевнені, що хочете видалити цей автомобіль? Цю дію неможливо скасувати.',
      [
        {
          text: 'Скасувати',
          style: 'cancel'
        },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: () => {
            deleteCar(carId);
            navigation.navigate('Home');
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[globalStyles.container, globalStyles.pageBackground, globalStyles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.accent.primary} />
        <Text style={globalStyles.loadingText}>Збереження даних...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[globalStyles.container, globalStyles.pageBackground]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={[globalStyles.textLarge, styles.title]}>Редагувати автомобіль</Text>
          <Text style={[globalStyles.textSecondary, styles.subtitle]}>Оновити дані твого авто</Text>
        </View>

        <View style={styles.form}>
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
            <Text style={[globalStyles.textPrimary, styles.label]}>Марка *</Text>
            <TextInput
              style={[globalStyles.input, styles.input]}
              value={brand}
              onChangeText={setBrand}
              placeholder="Наприклад: Toyota, BMW, Mercedes"
              placeholderTextColor={theme.colors.special.placeholder}
            />
          </View>

          {/* Model Field */}
          <View style={styles.inputContainer}>
            <Text style={[globalStyles.textPrimary, styles.label]}>Модель *</Text>
            <TextInput
              style={[globalStyles.input, styles.input]}
              value={model}
              onChangeText={setModel}
              placeholder="Наприклад: Camry, X5, C-Class"
              placeholderTextColor={theme.colors.special.placeholder}
            />
          </View>

          {/* Year Field */}
          <View style={styles.inputContainer}>
            <Text style={[globalStyles.textPrimary, styles.label]}>Рік випуску *</Text>
            <TextInput
              style={[globalStyles.input, styles.input]}
              value={year}
              onChangeText={setYear}
              placeholder="Наприклад: 2020"
              placeholderTextColor={theme.colors.special.placeholder}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>

          {/* Color Field */}
          <View style={styles.inputContainer}>
            <Text style={[globalStyles.textPrimary, styles.label]}>Колір *</Text>
            <TextInput
              style={[globalStyles.input, styles.input]}
              value={color}
              onChangeText={setColor}
              placeholder="Наприклад: Чорний, Білий, Сірий"
              placeholderTextColor={theme.colors.special.placeholder}
            />
          </View>

          {/* License Plate Field */}
          <View style={styles.inputContainer}>
            <Text style={[globalStyles.textPrimary, styles.label]}>Номерний знак *</Text>
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
            <Text style={[globalStyles.textPrimary, styles.label]}>VIN номер</Text>
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
              style={globalStyles.buttonDanger} 
              onPress={handleDelete}
            >
              <Text style={globalStyles.buttonDangerText}>Видалити</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={globalStyles.buttonSecondary} 
              onPress={handleCancel}
            >
              <Text style={globalStyles.buttonSecondaryText}>Скасувати</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={globalStyles.buttonPrimary} onPress={handleSave}>
              <Text style={globalStyles.buttonPrimaryText}>Зберегти</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
