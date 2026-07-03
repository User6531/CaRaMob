import React from "react";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import {
  ActiveServiceSession,
  ServiceStatusId,
} from "../../types/serviceStatus";
import { MOCK_ACTIVE_SESSION } from "./mockServiceStatus";
import {
  getStatusContextMessage,
  getStatusIndex,
  getStatusProgress,
  SERVICE_STATUS_STEPS,
} from "./serviceStatusConfig";
import { styles } from "./ServiceStatusContent.styles";
import { useAppAlert } from "../../components/AppAlert";

export interface ServiceStatusContentProps {
  contentContainerStyle?: ViewStyle;
}

function formatAcceptedAt(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(price: number): string {
  return `${price.toLocaleString("uk-UA")} грн`;
}

function PulsingDot() {
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = withRepeat(withTiming(0.35, { duration: 900 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.liveDot, animatedStyle]} />;
}

export function ServiceStatusContent({
  contentContainerStyle,
}: ServiceStatusContentProps) {
  const theme = useTheme();
  const { showAlert, showError } = useAppAlert();
  const insets = useSafeAreaInsets();
  const scrollTopInset = 16 + insets.top;

  const [session, setSession] = React.useState<ActiveServiceSession | null>(
    MOCK_ACTIVE_SESSION
  );

  const currentStatus = session?.currentStatus ?? "received";
  const currentIndex = getStatusIndex(currentStatus);
  const progress = getStatusProgress(currentStatus);
  const contextMessage = getStatusContextMessage(
    currentStatus,
    session?.currentWork
  );

  const progressWidth = useSharedValue(progress);

  React.useEffect(() => {
    progressWidth.value = withTiming(progress, { duration: 500 });
  }, [progress, progressWidth]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const handleApprove = () => {
    if (!session?.estimateItems?.length) return;

    showAlert({
      title: "Затвердити кошторис?",
      message: "Після підтвердження СТО розпочне виконання погоджених робіт.",
      buttons: [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Затвердити",
          onPress: () => {
            setSession((prev) =>
              prev
                ? {
                    ...prev,
                    isApproved: true,
                    currentStatus: "waiting_parts",
                  }
                : prev
            );
          },
        },
      ],
    });
  };

  const handleNavigate = () => {
    if (!session) return;
    const query = encodeURIComponent(session.serviceAddress);
    const url = `https://maps.google.com/?q=${query}`;
    Linking.openURL(url).catch(() => {
      showError("Не вдалося відкрити карту");
    });
  };

  const handleCall = () => {
    if (!session?.servicePhone) return;
    Linking.openURL(`tel:${session.servicePhone.replace(/\s/g, "")}`).catch(
      () => showError("Не вдалося відкрити дзвінок")
    );
  };

  const setDemoStatus = (status: ServiceStatusId) => {
    setSession((prev) =>
      prev
        ? {
            ...prev,
            currentStatus: status,
            isApproved: getStatusIndex(status) > getStatusIndex("approval"),
          }
        : prev
    );
  };

  const estimateTotal =
    session?.estimateItems?.reduce((sum, item) => sum + item.price, 0) ?? 0;

  return (
    <View style={styles.panel}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: 0 },
          contentContainerStyle,
        ]}
      >
        <View style={[styles.scrollContent, { paddingTop: scrollTopInset }]}>
          <Animated.View entering={FadeIn.duration(280)}>
            <Text style={styles.pageTitle}>Статус ремонту</Text>
            <Text style={styles.pageSubtitle}>
              Відстежуйте етапи робіт з вашим автомобілем у СТО в реальному часі
            </Text>
          </Animated.View>

          {!session ? (
            <Animated.View entering={FadeIn.duration(300).delay(80)}>
              <View style={styles.emptyCard}>
                <Feather
                  name="activity"
                  size={36}
                  color={theme.colors.accent.primary}
                />
                <Text style={styles.emptyTitle}>Немає активного ремонту</Text>
                <Text style={styles.emptyText}>
                  Коли ви залишите авто на СТО, тут з&apos;явиться статус
                  виконання робіт у реальному часі.
                </Text>
              </View>
            </Animated.View>
          ) : (
            <>
              <Animated.View entering={FadeIn.duration(300).delay(60)}>
                <View style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <View style={styles.sessionIcon}>
                      <Feather
                        name="activity"
                        size={22}
                        color={theme.colors.accent.primary}
                      />
                    </View>
                    <View style={styles.sessionInfo}>
                      <Text style={styles.sessionServiceName}>
                        {session.serviceName}
                      </Text>
                      <Text style={styles.sessionVehicle}>
                        {session.vehicleTitle} · {session.licensePlate}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.liveBadge}>
                    <PulsingDot />
                    <Text style={styles.liveBadgeText}>
                      Оновлення в реальному часі
                    </Text>
                  </View>
                  <Text style={styles.sessionVehicle}>
                    Прийнято о {formatAcceptedAt(session.acceptedAt)}
                  </Text>
                </View>
              </Animated.View>

              <Animated.View entering={FadeIn.duration(300).delay(100)}>
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressTitle}>Загальний прогрес</Text>
                    <Text style={styles.progressPercent}>{progress}%</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <Animated.View
                      style={[styles.progressFill, progressAnimatedStyle]}
                    />
                  </View>
                  <View style={styles.contextCard}>
                    <Text style={styles.contextText}>{contextMessage}</Text>
                  </View>
                </View>
              </Animated.View>

              <Animated.View entering={FadeIn.duration(300).delay(140)}>
                <View style={styles.timelineSection}>
                  <Text style={styles.timelineTitle}>Етапи робіт</Text>
                  {SERVICE_STATUS_STEPS.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isLast = index === SERVICE_STATUS_STEPS.length - 1;

                    return (
                      <View key={step.id} style={styles.timelineItem}>
                        <View style={styles.timelineRail}>
                          <View
                            style={[
                              styles.timelineDot,
                              isCompleted && styles.timelineDotCompleted,
                              isCurrent && styles.timelineDotCurrent,
                              !isCompleted &&
                                !isCurrent &&
                                styles.timelineDotUpcoming,
                            ]}
                          >
                            {isCompleted ? (
                              <Feather
                                name="check"
                                size={14}
                                color={theme.colors.accent.primary}
                              />
                            ) : (
                              <Text style={styles.timelineDotEmoji}>
                                {step.emoji}
                              </Text>
                            )}
                          </View>
                          {!isLast ? (
                            <View
                              style={[
                                styles.timelineLine,
                                isCompleted && styles.timelineLineCompleted,
                              ]}
                            />
                          ) : null}
                        </View>
                        <View
                          style={[
                            styles.timelineContent,
                            isLast && styles.timelineContentLast,
                          ]}
                        >
                          <Text
                            style={[
                              styles.timelineStepTitle,
                              isCompleted && styles.timelineStepTitleCompleted,
                              isCurrent && styles.timelineStepTitleCurrent,
                              !isCompleted &&
                                !isCurrent &&
                                styles.timelineStepTitleUpcoming,
                            ]}
                          >
                            {step.title}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </Animated.View>

              {currentStatus === "approval" &&
              session.estimateItems?.length &&
              !session.isApproved ? (
                <Animated.View entering={FadeIn.duration(300).delay(180)}>
                  <View style={styles.estimateCard}>
                    <Text style={styles.estimateTitle}>Кошторис робіт</Text>
                    {session.estimateItems.map((item, index) => (
                      <View
                        key={item.id}
                        style={[
                          styles.estimateRow,
                          index === 0 && styles.estimateRowFirst,
                        ]}
                      >
                        <Text style={styles.estimateItemTitle}>
                          {item.title}
                        </Text>
                        <Text style={styles.estimateItemPrice}>
                          {formatPrice(item.price)}
                        </Text>
                      </View>
                    ))}
                    <View style={styles.estimateTotalRow}>
                      <Text style={styles.estimateTotalLabel}>Разом</Text>
                      <Text style={styles.estimateTotalPrice}>
                        {formatPrice(estimateTotal)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleApprove}
                    activeOpacity={0.85}
                  >
                    <Feather
                      name="check-circle"
                      size={18}
                      color={theme.colors.text.inverse}
                    />
                    <Text style={styles.primaryButtonText}>
                      Затвердити перелік робіт
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ) : null}

              {currentStatus === "ready" ? (
                <Animated.View entering={FadeIn.duration(300).delay(180)}>
                  <View style={styles.estimateCard}>
                    <Text style={styles.estimateTitle}>Фінальний рахунок</Text>
                    <View style={[styles.estimateRow, styles.estimateRowFirst]}>
                      <Text style={styles.estimateItemTitle}>
                        Оплата за виконані роботи
                      </Text>
                      <Text style={styles.estimateItemPrice}>
                        {formatPrice(session.totalBill ?? estimateTotal)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleNavigate}
                    activeOpacity={0.85}
                  >
                    <Feather
                      name="navigation"
                      size={18}
                      color={theme.colors.text.inverse}
                    />
                    <Text style={styles.primaryButtonText}>
                      Як доїхати до СТО
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleCall}
                    activeOpacity={0.85}
                  >
                    <Feather
                      name="phone"
                      size={18}
                      color={theme.colors.accent.primary}
                    />
                    <Text style={styles.secondaryButtonText}>
                      Зателефонувати на СТО
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ) : null}

              <Animated.View entering={FadeIn.duration(300).delay(220)}>
                <View style={styles.demoStrip}>
                  <Text style={styles.demoStripTitle}>
                    Перегляд етапів (демо)
                  </Text>
                  <View style={styles.demoChips}>
                    {SERVICE_STATUS_STEPS.map((step) => {
                      const isActive = step.id === currentStatus;
                      return (
                        <TouchableOpacity
                          key={step.id}
                          style={[
                            styles.demoChip,
                            isActive && styles.demoChipActive,
                          ]}
                          onPress={() => setDemoStatus(step.id)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.demoChipText,
                              isActive && styles.demoChipTextActive,
                            ]}
                          >
                            {step.shortTitle}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </Animated.View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
