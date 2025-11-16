import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useCar } from '../../context/CarContext';
import { useTheme } from '../../hooks/useTheme';
import { globalStyles } from '../../styles/globalStyles';
import { styles } from './CarDetailsScreen.styles';
import { CarDetailsScreenProps } from '../../navigation/types';

export default function CarDetailsScreen({ navigation, route }: CarDetailsScreenProps) {
  const { getCarById, deleteCar } = useCar();
  const theme = useTheme();
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
      <View style={[globalStyles.container, globalStyles.pageBackground, globalStyles.loadingContainer]}>
        <Text style={globalStyles.loadingText}>Завантаження...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[globalStyles.container, globalStyles.pageBackground]}>
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
          <Text style={[globalStyles.textLarge, styles.carTitle]}>{car.brand} {car.model}</Text>
          <Text style={[globalStyles.textSecondary, styles.carYear]}>{car.year} рік</Text>
        </View>

        <View style={[globalStyles.card, styles.detailsSection]}>
          <Text style={[globalStyles.textPrimary, styles.sectionTitle]}>Основна інформація</Text>
          
          <View style={styles.detailRow}>
            <Text style={[globalStyles.textSecondary, styles.detailLabel]}>Марка:</Text>
            <Text style={[globalStyles.textPrimary, styles.detailValue]}>{car.brand}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[globalStyles.textSecondary, styles.detailLabel]}>Модель:</Text>
            <Text style={[globalStyles.textPrimary, styles.detailValue]}>{car.model}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[globalStyles.textSecondary, styles.detailLabel]}>Рік випуску:</Text>
            <Text style={[globalStyles.textPrimary, styles.detailValue]}>{car.year}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[globalStyles.textSecondary, styles.detailLabel]}>Колір:</Text>
            <Text style={[globalStyles.textPrimary, styles.detailValue]}>{car.color}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[globalStyles.textSecondary, styles.detailLabel]}>Номерний знак:</Text>
            <Text style={[globalStyles.textPrimary, styles.detailValue, styles.licensePlate]}>{car.licensePlate}</Text>
          </View>
          
          {car.vin && (
            <View style={styles.detailRow}>
              <Text style={[globalStyles.textSecondary, styles.detailLabel]}>VIN номер:</Text>
              <Text style={[globalStyles.textPrimary, styles.detailValue]}>{car.vin}</Text>
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
        <TouchableOpacity style={globalStyles.buttonPrimary} onPress={handleEdit}>
          <Text style={globalStyles.buttonPrimaryText}>✏️ Редагувати</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={globalStyles.buttonDanger} onPress={handleDelete}>
          <Text style={globalStyles.buttonDangerText}>🗑️ Видалити</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
