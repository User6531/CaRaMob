import React from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { usePullToRefresh } from "../../hooks/usePullToRefresh";
import { useTheme } from "../../hooks/useTheme";
import { RefreshStatusBar } from "../../components/RefreshStatusBar";
import { useDeleteServiceHistory, useServiceHistory } from "../../queries";
import { ServiceHistoryVisitDto } from "../../types/api";
import { globalStyles } from "../../styles/globalStyles";
import { ServiceHistorySwipeableVisit } from "./ServiceHistorySwipeableVisit";
import { styles } from "./ServiceHistoryScreen.styles";

export interface ServiceHistoryContentProps {
  vehicleId: string;
  vehicleTitle?: string;
  onAddPress: () => void;
  onVisitPress: (visit: ServiceHistoryVisitDto) => void;
  onEditPress: (visit: ServiceHistoryVisitDto) => void;
  contentContainerStyle?: ViewStyle;
}

export function ServiceHistoryContent({
  vehicleId,
  vehicleTitle,
  onAddPress,
  onVisitPress,
  onEditPress,
  contentContainerStyle,
}: ServiceHistoryContentProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const deleteServiceHistory = useDeleteServiceHistory();
  const swipeableRefs = React.useRef<Map<string, Swipeable | null>>(new Map());
  const {
    data: visits = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useServiceHistory(vehicleId);

  const refreshHistory = React.useCallback(async () => {
    await refetch();
  }, [refetch]);

  const { isRefreshing, onRefresh } = usePullToRefresh(refreshHistory);
  const scrollTopInset = 16 + insets.top;

  const closeOtherSwipeables = (openedVisitId: string) => {
    swipeableRefs.current.forEach((ref, visitId) => {
      if (visitId !== openedVisitId) {
        ref?.close();
      }
    });
  };

  const handleDeletePress = (visit: ServiceHistoryVisitDto) => {
    swipeableRefs.current.get(visit.id)?.close();

    Alert.alert(
      "Видалити запис?",
      `Запис «${visit.title}» буде видалено без можливості відновлення.`,
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteServiceHistory.mutateAsync({
                vehicleId,
                serviceHistoryId: visit.id,
              });
            } catch (deleteError) {
              Alert.alert(
                "Помилка",
                deleteError instanceof Error
                  ? deleteError.message
                  : "Не вдалося видалити запис обслуговування"
              );
            }
          },
        },
      ]
    );
  };

  const handleEditPress = (visit: ServiceHistoryVisitDto) => {
    swipeableRefs.current.get(visit.id)?.close();
    onEditPress(visit);
  };

  if (isLoading) {
    return (
      <View style={[globalStyles.loadingContainer, { flex: 1 }]}>
        <ActivityIndicator size="large" color={theme.colors.accent.primary} />
        <Text style={globalStyles.loadingText}>Завантаження історії...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.errorContainer, { flex: 1 }]}>
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
    <View style={styles.panel}>
      <RefreshStatusBar visible={isRefreshing} />
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: 0 },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.accent.primary}
          colors={[theme.colors.accent.primary]}
          progressViewOffset={insets.top}
        />
      }
    >
      <View style={[styles.scrollContent, { paddingTop: scrollTopInset }]}>
        <Text style={styles.pageTitle}>Історія обслуговування</Text>
        <Text style={styles.pageSubtitle}>
          {vehicleTitle
            ? `${vehicleTitle} - ${visits.length} візитів`
            : `${visits.length} візитів`}
        </Text>
        <View style={styles.topActions}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddPress}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+ Додати запис</Text>
          </TouchableOpacity>
        </View>

        {visits.map((visit) => (
          <ServiceHistorySwipeableVisit
            key={visit.id}
            visit={visit}
            onPress={onVisitPress}
            onEditPress={handleEditPress}
            onDeletePress={handleDeletePress}
            onSwipeOpen={closeOtherSwipeables}
            swipeableRef={(ref) => {
              if (ref) {
                swipeableRefs.current.set(visit.id, ref);
              } else {
                swipeableRefs.current.delete(visit.id);
              }
            }}
          />
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
      </View>
    </ScrollView>
    </View>
  );
}
