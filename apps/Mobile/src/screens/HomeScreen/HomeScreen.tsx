import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useStatusBar } from "../../hooks/useStatusBar";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./HomeScreen.styles";
import { HomeScreenProps } from "../../navigation/types";
import { useVehicles } from "../../queries";
import { useTheme } from "../../hooks/useTheme";
import type { VehicleListItem } from "../../types/api";

export default function HomeScreen({ navigation }: HomeScreenProps) {
  useStatusBar();
  const theme = useTheme();
  const { data: vehicles = [], isLoading, isError, error, refetch, isRefetching } = useVehicles();

  const renderCarCard = ({ item }: { item: VehicleListItem }) => (
    <View style={styles.carCard}>
      <TouchableOpacity
        style={styles.carCardContent}
        onPress={() => navigation.navigate("CarDetails", { carId: item.id })}
      >
        <View style={styles.carImageContainer}>
          {item.photoUrl ? (
            <Image source={{ uri: item.photoUrl }} style={styles.carImage} />
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
        onPress={() => navigation.navigate("CarEdit", { carId: item.id })}
      >
        <Text style={styles.editButtonText}>✏️</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyCard = () => (
    <TouchableOpacity
      style={styles.emptyCard}
      onPress={() => navigation.navigate("CarCard")}
    >
      <View style={styles.emptyCardContent}>
        <Text style={styles.plusIcon}>+</Text>
        <Text style={styles.emptyCardText}>Додати автомобіль</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && !vehicles.length) {
    return (
      <>
        <View
          style={[
            globalStyles.container,
            globalStyles.pageBackground,
            globalStyles.loadingContainer,
          ]}
        >
          <ActivityIndicator size="large" color={theme.colors.accent.primary} />
          <Text style={globalStyles.loadingText}>Завантаження автомобілів...</Text>
        </View>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <View style={[globalStyles.container, globalStyles.pageBackground]}>
          <View style={styles.header}>
            <Text style={[globalStyles.textLarge, styles.title]}>
              Ласкаво просимо до CARa 🚗
            </Text>
          </View>
          <View style={styles.errorStateContainer}>
            <Text style={[globalStyles.textPrimary, styles.errorMessage]}>
              Не вдалося завантажити список авто
            </Text>
            <Text style={globalStyles.textSecondary}>
              {error instanceof Error ? error.message : "Помилка мережі"}
            </Text>
            <TouchableOpacity
              style={[globalStyles.buttonPrimary, styles.retryButtonMargin]}
              onPress={() => refetch()}
            >
              <Text style={globalStyles.buttonPrimaryText}>Повторити</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <View style={[globalStyles.container, globalStyles.pageBackground]}>
        <View style={styles.header}>
          <Text style={[globalStyles.textLarge, styles.title]}>
            Ласкаво просимо до CARa 🚗
          </Text>
          <Text style={[globalStyles.textSecondary, styles.subtitle]}>
            Твій особистий автомобільний помічник
          </Text>
        </View>

        <View style={styles.carsSection}>
          <Text style={[globalStyles.textPrimary, styles.sectionTitle]}>
            Мої автомобілі
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.carsList}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching && vehicles.length > 0}
                onRefresh={refetch}
                colors={[theme.colors.accent.primary]}
              />
            }
          >
            {vehicles.map((vehicle) => (
              <View key={vehicle.id} style={styles.carCardWrapper}>
                {renderCarCard({ item: vehicle })}
              </View>
            ))}
            <View style={styles.carCardWrapper}>{renderEmptyCard()}</View>
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={globalStyles.buttonSecondary}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={globalStyles.buttonSecondaryText}>👤 Профіль</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
