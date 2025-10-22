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

interface CarCardScreenProps {
  navigation: any;
}

export default function CarCardScreen({ navigation }: CarCardScreenProps) {
  const { addCar } = useCar();
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
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Збереження даних...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Додай свій автомобіль</Text>
          <Text style={styles.subtitle}>Створи картку твого авто</Text>
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
            <Text style={styles.label}>Марка *</Text>
            <TextInput
              style={styles.input}
              value={brand}
              onChangeText={setBrand}
              placeholder="Наприклад: Toyota, BMW, Mercedes"
              placeholderTextColor="#999"
            />
          </View>

          {/* Model Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Модель *</Text>
            <TextInput
              style={styles.input}
              value={model}
              onChangeText={setModel}
              placeholder="Наприклад: Camry, X5, C-Class"
              placeholderTextColor="#999"
            />
          </View>

          {/* Year Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Рік випуску *</Text>
            <TextInput
              style={styles.input}
              value={year}
              onChangeText={setYear}
              placeholder="Наприклад: 2020"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={4}
            />
          </View>

          {/* Color Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Колір *</Text>
            <TextInput
              style={styles.input}
              value={color}
              onChangeText={setColor}
              placeholder="Наприклад: Чорний, Білий, Сірий"
              placeholderTextColor="#999"
            />
          </View>

          {/* License Plate Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Номерний знак *</Text>
            <TextInput
              style={styles.input}
              value={licensePlate}
              onChangeText={setLicensePlate}
              placeholder="Наприклад: АА1234ВВ"
              placeholderTextColor="#999"
              autoCapitalize="characters"
            />
          </View>

          {/* VIN Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>VIN номер</Text>
            <TextInput
              style={styles.input}
              value={vin}
              onChangeText={setVin}
              placeholder="17-значний VIN номер (необов'язково)"
              placeholderTextColor="#999"
              autoCapitalize="characters"
              maxLength={17}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Скасувати</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Зберегти</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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
    borderColor: '#E0E0E0',
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
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
