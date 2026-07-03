import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { usePullToRefresh } from "../../hooks/usePullToRefresh";
import { useTheme } from "../../hooks/useTheme";
import { RefreshStatusBar } from "../../components/RefreshStatusBar";
import { useDeleteServiceHistory, useServiceHistory } from "../../queries";
import { ServiceHistoryVisitDto } from "../../types/api";
import { globalStyles } from "../../styles/globalStyles";
import { ServiceHistorySwipeableVisit } from "./ServiceHistorySwipeableVisit";
import { formatVisitCount } from "./serviceHistoryUtils";
import { styles } from "./ServiceHistoryScreen.styles";
import { useAppAlert } from "../../components/AppAlert";

export interface ServiceHistoryContentProps {
  vehicleId: string;
  vehicleTitle?: string;
  onAddPress: () => void;
  onEditPress: (visit: ServiceHistoryVisitDto) => void;
  contentContainerStyle?: ViewStyle;
}

export function ServiceHistoryContent({
  vehicleId,
  vehicleTitle,
  onAddPress,
  onEditPress,
  contentContainerStyle,
}: ServiceHistoryContentProps) {
  const theme = useTheme();
  const { showAlert, showError } = useAppAlert();
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

    showAlert({
      title: "Видалити запис?",
      message: `Запис «${visit.title}» буде видалено без можливості відновлення.`,
      buttons: [
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
              showError(
                deleteError instanceof Error
                  ? deleteError.message
                  : "Не вдалося видалити запис обслуговування"
              );
            }
          },
        },
      ],
    });
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
        <Feather name="alert-circle" size={32} color="#8E8E93" />
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
          <Animated.View entering={FadeIn.duration(280)}>
            <Text style={styles.pageTitle}>Історія</Text>
            <Text style={styles.pageSubtitle}>
              {vehicleTitle
                ? `Обслуговування для ${vehicleTitle}`
                : "Записи візитів до автосервісу"}
            </Text>

            {vehicleTitle ? (
              <View style={styles.vehicleBadge}>
                <Feather
                  name="file-text"
                  size={14}
                  color={theme.colors.accent.primary}
                />
                <Text style={styles.vehicleBadgeText}>
                  {formatVisitCount(visits.length)}
                </Text>
              </View>
            ) : null}
          </Animated.View>

          <Animated.View entering={FadeIn.duration(300).delay(60)}>
            <View style={styles.topActions}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={onAddPress}
                activeOpacity={0.85}
              >
                <Feather
                  name="plus"
                  size={16}
                  color={theme.colors.accent.primary}
                />
                <Text style={styles.addButtonText}>Додати запис</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {visits.length > 0 ? (
            <View style={styles.listSection}>
              {visits.map((visit, index) => (
                <ServiceHistorySwipeableVisit
                  key={visit.id}
                  visit={visit}
                  vehicleId={vehicleId}
                  index={index}
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
            </View>
          ) : (
            <Animated.View entering={FadeIn.duration(300).delay(100)}>
              <View style={styles.emptyCard}>
                <Feather
                  name="clipboard"
                  size={36}
                  color={theme.colors.accent.primary}
                />
                <Text style={styles.emptyTitle}>Історія поки порожня</Text>
                <Text style={styles.emptyText}>
                  Додайте перший запис про візит до автосервісу — тут буде
                  зберігатись список виконаних робіт і витрат.
                </Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={onAddPress}
                  activeOpacity={0.85}
                >
                  <Feather
                    name="plus"
                    size={16}
                    color={theme.colors.accent.primary}
                  />
                  <Text style={styles.addButtonText}>Додати перший запис</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
