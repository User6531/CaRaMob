import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCar } from '../../context/CarContext';
import { useTheme } from '../../hooks/useTheme';
import { globalStyles } from '../../styles/globalStyles';

interface CarCardScreenProps {
  navigation: any;
}

export default function CarCardScreen({ navigation }: CarCardScreenProps) {
  const { addCar } = useCar();
  const theme = useTheme();
  const [carImage, setCarImage] = useState<string | null>(null);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [vin, setVin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    const hasData = brand.trim() || model.trim() || year.trim() || color.trim() || licensePlate.trim() || vin.trim() || carImage;
    
    if (hasData) {
      Alert.alert(
        'Скасувати створення?',
        'Ви вже ввели деякі дані. Ви впевнені, що хочете скасувати?',
        [
          {
            text: 'Продовжити редагування',
            style: 'cancel'
          },
          {
            text: 'Скасувати',
            style: 'destructive',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } else {
      navigation.navigate('Home');
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
      
      addCar({
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
        'Картка автомобіля створена',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося зберегти дані');
    } finally {
      setIsLoading(false);
    }
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
          <Text style={[globalStyles.textLarge, styles.title]}>Додай свій автомобіль</Text>
          <Text style={[globalStyles.textSecondary, styles.subtitle]}>Створи картку твого авто</Text>
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

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imageContainer: {
    width: 200,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#30363D', // Using theme color directly
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImage: {
    width: 196,
    height: 116,
    borderRadius: 10,
  },
  placeholderImage: {
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    marginBottom: 8,
  },
  placeholderLabel: {
    fontSize: 14,
    color: '#8B949E', // Using theme color directly
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    // Additional input styles if needed
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
    gap: 12,
  },
});
