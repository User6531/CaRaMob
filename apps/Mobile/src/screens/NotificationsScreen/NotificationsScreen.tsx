import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useTheme } from "../../hooks/useTheme";
import { useNotifications } from "../../context/NotificationsContext";
import { globalStyles } from "../../styles/globalStyles";
import { NotificationsScreenProps } from "../../navigation/types";
import { AppNotification } from "../../types/notification";
import {
  formatNotificationTime,
  getNotificationIcon,
  groupNotificationsByDate,
} from "./notificationUtils";
import { styles } from "./NotificationsScreen.styles";

function NotificationItem({
  notification,
  onPress,
}: {
  notification: AppNotification;
  onPress: () => void;
}) {
  const theme = useTheme();
  const iconName = getNotificationIcon(notification.type);

  return (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !notification.isRead && styles.notificationCardUnread,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View
        style={[
          styles.iconWrap,
          !notification.isRead && styles.iconWrapUnread,
        ]}
      >
        <Feather
          name={iconName}
          size={18}
          color={theme.colors.accent.primary}
        />
      </View>

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text
            style={[
              styles.notificationTitle,
              !notification.isRead && styles.notificationTitleUnread,
            ]}
          >
            {notification.title}
          </Text>
          {!notification.isRead ? <View style={styles.unreadDot} /> : null}
        </View>
        <Text style={styles.notificationBody}>{notification.body}</Text>
        <Text style={styles.notificationTime}>
          {formatNotificationTime(notification.receivedAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen({}: NotificationsScreenProps) {
  useStatusBar();
  const theme = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const sections = React.useMemo(
    () => groupNotificationsByDate(notifications),
    [notifications]
  );

  const handleNotificationPress = (notification: AppNotification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  return (
    <ScrollView
      style={[globalStyles.container, globalStyles.pageBackground, styles.scroll]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn.duration(280)}>
        <Text style={styles.pageTitle}>Сповіщення</Text>
        <Text style={styles.pageSubtitle}>
          Історія всіх повідомлень від сервісу та додатку
        </Text>
      </Animated.View>

      {unreadCount > 0 ? (
        <Animated.View entering={FadeIn.duration(300).delay(40)}>
          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={markAllAsRead}
              activeOpacity={0.85}
            >
              <Feather
                name="check-circle"
                size={14}
                color={theme.colors.accent.primary}
              />
              <Text style={styles.markAllButtonText}>Позначити всі прочитаними</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : null}

      {sections.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="bell-off" size={36} color="#8E8E93" />
          <Text style={styles.emptyTitle}>Немає сповіщень</Text>
          <Text style={styles.emptyText}>
            Тут з&apos;являтимуться оновлення статусу ремонту, нагадування та
            новини сервісу
          </Text>
        </View>
      ) : (
        sections.map((section, sectionIndex) => (
          <Animated.View
            key={section.key}
            entering={FadeIn.duration(300).delay(60 + sectionIndex * 40)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>{section.label}</Text>
            {section.items.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onPress={() => handleNotificationPress(notification)}
              />
            ))}
          </Animated.View>
        ))
      )}
    </ScrollView>
  );
}
