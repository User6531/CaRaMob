import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useTheme } from "../../hooks/useTheme";
import { ServiceHistoryScreenProps } from "../../navigation/types";
import { useServiceHistory } from "../../queries";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./ServiceHistoryScreen.styles";

const formatVisitDate = (isoDate: string) => {
  const parsedDate = new Date(isoDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return isoDate;
  }

  return parsedDate.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatPrice = (price: number | null | undefined) => {
  if (typeof price !== "number") return null;
  return `${price.toLocaleString("uk-UA")} грн`;
};

export default function ServiceHistoryScreen({
  navigation,
  route,
}: ServiceHistoryScreenProps) {
  useStatusBar();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { vehicleId, vehicleTitle } = route.params;
  const {
    data: visits = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useServiceHistory(vehicleId);

  if (isLoading) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.pageBackground,
          globalStyles.loadingContainer,
          { paddingTop: insets.top },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.accent.primary} />
        <Text style={globalStyles.loadingText}>Завантаження історії...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.pageBackground,
          styles.errorContainer,
          { paddingTop: insets.top },
        ]}
      >
        <Text style={globalStyles.textPrimary}>
          Не вдалося завантажити історію обслуговування
        </Text>
        <Text style={globalStyles.textSecondary}>
          {error instanceof Error ? error.message : "Помилка мережі"}
        </Text>
        <TouchableOpacity
          style={[globalStyles.buttonPrimary, styles.retryButton]}
          onPress={() => refetch()}
          activeOpacity={0.8}
        >
          <Text style={globalStyles.buttonPrimaryText}>Повторити</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[globalStyles.container, globalStyles.pageBackground]}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: 16 + insets.top, paddingBottom: 28 + insets.bottom },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={[theme.colors.accent.primary]}
        />
      }
    >
      <Text style={styles.pageTitle}>Історія обслуговування</Text>
      <Text style={styles.pageSubtitle}>
        {vehicleTitle ? `${vehicleTitle} - ${visits.length} візитів` : `${visits.length} візитів`}
      </Text>
      <View style={styles.topActions}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("ServiceHistoryCreate", { vehicleId, vehicleTitle })
          }
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+ Додати запис</Text>
        </TouchableOpacity>
      </View>

      {visits.map((visit) => (
        <View key={visit.id} style={styles.visitCard}>
          <View style={styles.visitHeader}>
            <Text style={styles.visitTitle}>{visit.title}</Text>
            <Text style={styles.visitDate}>{formatVisitDate(visit.createdAt)}</Text>
          </View>

          {visit.description ? (
            <Text style={styles.visitDescription}>{visit.description}</Text>
          ) : null}

          <Text style={styles.worksTitle}>Виконані роботи</Text>
          {visit.records?.length ? (
            visit.records.map((record) => (
              <View key={record.id} style={styles.workRow}>
                <Text style={styles.workName}>{record.title}</Text>
                {formatPrice(record.price) ? (
                  <Text style={styles.workPrice}>{formatPrice(record.price)}</Text>
                ) : null}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              Для цього візиту список робіт ще не додано.
            </Text>
          )}
        </View>
      ))}

      {!visits.length ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Історія поки порожня</Text>
          <Text style={styles.emptyText}>
            Коли в автосервісі з&apos;являться записи, вони будуть відображені
            тут.
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
