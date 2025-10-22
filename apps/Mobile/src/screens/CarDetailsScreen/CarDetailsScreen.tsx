import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useCar } from '../../context/CarContext';

const { width } = Dimensions.get('window');

export default function CarDetailsScreen({ navigation, route }: any) {
  const { getCarById, deleteCar } = useCar();
  const { carId } = route.params;
  const [car, setCar] = useState<any>(null);

  useEffect(() => {
    const carData = getCarById(carId);
    if (carData) {
      setCar(carData);
    } else {
      Alert.alert('Помилка', 'Автомобіль не знайдено');
      navigation.goBack();
    }
  }, [carId, getCarById, navigation]);

  const handleEdit = () => {
    navigation.navigate('CarEdit', { carId });
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

  if (!car) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Завантаження...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Car Image */}
      <View style={styles.imageContainer}>
        {car.carImage ? (
          <Image source={{ uri: car.carImage }} style={styles.carImage} />
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
          <Text style={styles.carTitle}>{car.brand} {car.model}</Text>
          <Text style={styles.carYear}>{car.year} рік</Text>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Основна інформація</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Марка:</Text>
            <Text style={styles.detailValue}>{car.brand}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Модель:</Text>
            <Text style={styles.detailValue}>{car.model}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Рік випуску:</Text>
            <Text style={styles.detailValue}>{car.year}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Колір:</Text>
            <Text style={styles.detailValue}>{car.color}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Номерний знак:</Text>
            <Text style={[styles.detailValue, styles.licensePlate]}>{car.licensePlate}</Text>
          </View>
          
          {car.vin && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>VIN номер:</Text>
              <Text style={styles.detailValue}>{car.vin}</Text>
            </View>
          )}
        </View>

        <View style={styles.metaSection}>
          <Text style={styles.sectionTitle}>Додаткова інформація</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Додано:</Text>
            <Text style={styles.detailValue}>
              {new Date(car.createdAt).toLocaleDateString('uk-UA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
          
          {car.updatedAt && car.updatedAt !== car.createdAt && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Оновлено:</Text>
              <Text style={styles.detailValue}>
                {new Date(car.updatedAt).toLocaleDateString('uk-UA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>✏️ Редагувати</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>🗑️ Видалити</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  imageContainer: {
    height: 250,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  carImage: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  placeholderImage: {
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  carTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  carYear: {
    fontSize: 18,
    color: '#666',
  },
  detailsSection: {
    marginBottom: 24,
  },
  metaSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  licensePlate: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
