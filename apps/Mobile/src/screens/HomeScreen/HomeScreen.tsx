import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  FlatList,
  Dimensions 
} from 'react-native';
import { useCar } from '../../context/CarContext';
import { useTheme } from '../../hooks/useTheme';
import { useStatusBar } from '../../hooks/useStatusBar';
import { globalStyles } from '../../styles/globalStyles';

const { width } = Dimensions.get('window');
const cardWidth = width - 48; // Full width minus padding

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { cars } = useCar();
  const theme = useTheme();

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

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: { 
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  carsSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  carsList: {
    paddingBottom: 20,
  },
  carCardWrapper: {
    marginBottom: 16,
  },
  carCard: {
    width: cardWidth,
    backgroundColor: '#161B22', // Using theme color directly
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  carCardContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  carImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#21262D', // Using theme color directly
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  carInfo: {
    flex: 1,
  },
  carBrand: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F0F6FC', // Using theme color directly
    marginBottom: 4,
  },
  carModel: {
    fontSize: 16,
    color: '#8B949E', // Using theme color directly
    marginBottom: 4,
  },
  carYear: {
    fontSize: 14,
    color: '#8B949E', // Using theme color directly
    marginBottom: 4,
  },
  carPlate: {
    fontSize: 14,
    color: '#58A6FF', // Using theme color directly
    fontWeight: '600',
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#58A6FF', // Using theme color directly
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  editButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  emptyCard: {
    width: cardWidth,
    backgroundColor: '#161B22', // Using theme color directly
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#30363D', // Using theme color directly
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyCardContent: {
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 48,
    color: '#58A6FF', // Using theme color directly
    marginBottom: 12,
  },
  emptyCardText: {
    fontSize: 16,
    color: '#8B949E', // Using theme color directly
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F0F6FC', // Using theme color directly
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#8B949E', // Using theme color directly
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    alignItems: 'center',
  },
});
