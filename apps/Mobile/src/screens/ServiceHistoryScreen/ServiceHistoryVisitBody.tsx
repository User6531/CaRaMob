import React from "react";
import {
  ActivityIndicator,
  Alert,
  LayoutChangeEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { useServiceHistoryDetails } from "../../queries";
import { ServiceHistoryVisitDto, ServiceWorkItemDto } from "../../types/api";
import {
  formatPrice,
  formatVisitDate,
  getRecordsTotalPrice,
} from "./serviceHistoryUtils";
import { styles } from "./ServiceHistoryScreen.styles";

const EXPAND_DURATION_MS = 320;

interface ServiceHistoryVisitBodyProps {
  visit: ServiceHistoryVisitDto;
  vehicleId: string;
}

export function ServiceHistoryVisitBody({
  visit,
  vehicleId,
}: ServiceHistoryVisitBodyProps) {
  const theme = useTheme();
  const detailsMutation = useServiceHistoryDetails();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [records, setRecords] = React.useState<ServiceWorkItemDto[] | null>(
    null
  );
  const contentHeight = useSharedValue(0);
  const expandProgress = useSharedValue(0);

  const animateExpand = React.useCallback(
    (open: boolean) => {
      expandProgress.value = withTiming(open ? 1 : 0, {
        duration: EXPAND_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      });
    },
    [expandProgress]
  );

  React.useEffect(() => {
    setIsExpanded(false);
    setRecords(null);
    contentHeight.value = 0;
    expandProgress.value = 0;
  }, [visit.id, visit.title, visit.createdAt, visit.description, contentHeight, expandProgress]);

  React.useEffect(() => {
    if (records === null || contentHeight.value === 0) return;
    animateExpand(isExpanded);
  }, [isExpanded, records, animateExpand, contentHeight]);

  const handleDetailsPress = async () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    if (records !== null) {
      setIsExpanded(true);
      return;
    }

    try {
      const details = await detailsMutation.mutateAsync({
        vehicleId,
        serviceHistoryId: visit.id,
      });
      setRecords(details.records ?? []);
      setIsExpanded(true);
    } catch (error) {
      Alert.alert(
        "Помилка",
        error instanceof Error
          ? error.message
          : "Не вдалося завантажити виконані роботи"
      );
    }
  };

  const handleContentLayout = (event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;
    if (nextHeight <= 0) return;

    const heightChanged = Math.abs(contentHeight.value - nextHeight) > 1;
    if (heightChanged) {
      contentHeight.value = nextHeight;
    }

    if (isExpanded && heightChanged) {
      animateExpand(true);
    }
  };

  const expandableStyle = useAnimatedStyle(() => ({
    height: contentHeight.value * expandProgress.value,
    opacity: interpolate(expandProgress.value, [0, 0.4, 1], [0, 1, 1]),
    overflow: "hidden",
  }));

  const recordsToShow = records ?? [];

  const worksContent = (
    <>
      <Text style={styles.worksTitle}>Виконані роботи</Text>
      {recordsToShow.length ? (
        <>
          {recordsToShow.map((record) => (
            <View key={record.id} style={styles.workRow}>
              <Text style={styles.workName}>{record.title}</Text>
              {formatPrice(record.price) ? (
                <Text style={styles.workPrice}>{formatPrice(record.price)}</Text>
              ) : null}
            </View>
          ))}
          <View style={styles.workTotalRow}>
            <Text style={styles.workTotalLabel}>Разом</Text>
            <Text style={styles.workTotalPrice}>
              {formatPrice(getRecordsTotalPrice(recordsToShow))}
            </Text>
          </View>
        </>
      ) : (
        <Text style={styles.emptyWorksText}>
          Для цього візиту список робіт ще не додано.
        </Text>
      )}
    </>
  );

  return (
    <>
      <View style={styles.visitHeader}>
        <Text style={styles.visitTitle}>{visit.title}</Text>
        <Text style={styles.visitDate}>{formatVisitDate(visit.createdAt)}</Text>
      </View>

      {visit.description ? (
        <Text style={styles.visitDescription}>{visit.description}</Text>
      ) : null}

      {records !== null ? (
        <Animated.View style={expandableStyle}>
          <View style={styles.expandableContent} onLayout={handleContentLayout}>
            {worksContent}
          </View>
        </Animated.View>
      ) : null}

      <TouchableOpacity
        style={styles.detailsButton}
        onPress={handleDetailsPress}
        activeOpacity={0.8}
        disabled={detailsMutation.isPending}
      >
        {detailsMutation.isPending ? (
          <ActivityIndicator size="small" color={theme.colors.accent.primary} />
        ) : (
          <Text style={styles.detailsButtonText}>
            {isExpanded ? "Згорнути" : "Детальніше"}
          </Text>
        )}
      </TouchableOpacity>
    </>
  );
}
