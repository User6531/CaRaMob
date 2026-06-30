import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { styles } from "./NotificationBellButton.styles";

export interface NotificationBellButtonProps {
  onPress: () => void;
  unreadCount?: number;
}

export function NotificationBellButton({
  onPress,
  unreadCount = 0,
}: NotificationBellButtonProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const showBadge = unreadCount > 0;
  const badgeLabel = unreadCount > 9 ? "9+" : String(unreadCount);

  return (
    <View
      style={[styles.container, { top: insets.top + 8 }]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Сповіщення"
      >
        <Feather name="bell" size={16} color={theme.colors.accent.primary} />
        {showBadge ? (
          <View style={styles.badge}>
            {unreadCount > 0 ? (
              <Text style={styles.badgeText}>{badgeLabel}</Text>
            ) : null}
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
}
