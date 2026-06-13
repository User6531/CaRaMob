import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { theme } from "../../styles/theme";
import { styles } from "./BottomNavBar.styles";
import {
  CHAT_NAV_ICON_SVG,
  HISTORY_NAV_ICON_SVG,
  HOME_NAV_ICON_SVG,
  SERVICES_NAV_ICON_SVG,
} from "./navIcons";

export type BottomNavTab = "garage" | "chats" | "services" | "history";

const INACTIVE_ICON_COLOR = "#FFFFFF";

interface NavItemConfig {
  id: BottomNavTab;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: "garage", label: "Гараж", icon: HOME_NAV_ICON_SVG },
  { id: "chats", label: "Чати", icon: CHAT_NAV_ICON_SVG },
  { id: "services", label: "Мої сервіси", icon: SERVICES_NAV_ICON_SVG },
  { id: "history", label: "Історія", icon: HISTORY_NAV_ICON_SVG },
];

export interface BottomNavBarProps {
  activeTab?: BottomNavTab;
  onGaragePress?: () => void;
  onChatsPress?: () => void;
  onServicesPress?: () => void;
  onHistoryPress?: () => void;
}

export function BottomNavBar({
  activeTab = "garage",
  onGaragePress,
  onChatsPress,
  onServicesPress,
  onHistoryPress,
}: BottomNavBarProps) {
  const handlers: Record<BottomNavTab, (() => void) | undefined> = {
    garage: onGaragePress,
    chats: onChatsPress,
    services: onServicesPress,
    history: onHistoryPress,
  };

  return (
    <View style={styles.container}>
      <View style={styles.items}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeTab;

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.item, isActive && styles.itemActive]}
              onPress={handlers[item.id]}
              activeOpacity={0.8}
            >
              <SvgXml
                xml={item.icon}
                width={20}
                height={20}
                color={
                  isActive ? theme.colors.accent.primary : INACTIVE_ICON_COLOR
                }
              />
              <Text style={isActive ? styles.labelActive : styles.label}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
