import React from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Image,
} from 'react-native';
import { useCar } from '../../context/CarContext';
import { useStatusBar } from '../../hooks/useStatusBar';
import { globalStyles } from '../../styles/globalStyles';
import { styles } from './HomeScreen.styles';

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { cars } = useCar();

  const renderCarCard = ({ item }: { item: any }) => (
    <View style={styles.carCard}>
      <TouchableOpacity 
        style={styles.carCardContent}
        onPress={() => navigation.navigate('CarDetails', { carId: item.id })}
      >
        <View style={styles.carImageContainer}>
          {item.carImage ? (
            <Image source={{ uri: item.carImage }} style={styles.carImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>🚗</Text>
            </View>
          )}
        </View>
        <View style={styles.carInfo}>
          <Text style={styles.carBrand}>{item.brand}</Text>
          <Text style={styles.carModel}>{item.model}</Text>
          <Text style={styles.carYear}>{item.year}</Text>
          <Text style={styles.carPlate}>{item.licensePlate}</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => navigation.navigate('CarEdit', { carId: item.id })}
      >
        <Text style={styles.editButtonText}>✏️</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyCard = () => (
    <TouchableOpacity 
      style={styles.emptyCard}
      onPress={() => navigation.navigate('CarCard')}
    >
      <View style={styles.emptyCardContent}>
        <Text style={styles.plusIcon}>+</Text>
        <Text style={styles.emptyCardText}>Додати автомобіль</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      {useStatusBar()}
      <View style={[globalStyles.container, globalStyles.pageBackground]}>
        <View style={styles.header}>
        <Text style={[globalStyles.textLarge, styles.title]}>Ласкаво просимо до CARa 🚗</Text>
        <Text style={[globalStyles.textSecondary, styles.subtitle]}>Твій особистий автомобільний помічник</Text>
      </View>
      
      <View style={styles.carsSection}>
        <Text style={[globalStyles.textPrimary, styles.sectionTitle]}>Мої автомобілі</Text>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.carsList}
        >
          {cars.map((car) => (
            <View key={car.id} style={styles.carCardWrapper}>
              {renderCarCard({ item: car })}
            </View>
          ))}
          <View style={styles.carCardWrapper}>
            {renderEmptyCard()}
          </View>
        </ScrollView>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={globalStyles.buttonSecondary} 
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={globalStyles.buttonSecondaryText}>👤 Профіль</Text>
        </TouchableOpacity>
      </View>
      </View>
    </>
  );
}
