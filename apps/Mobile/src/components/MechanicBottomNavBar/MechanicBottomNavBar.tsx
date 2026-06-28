import React from "react";
import { LayoutChangeEvent, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SvgXml } from "react-native-svg";
import { theme } from "../../styles/theme";
import { styles } from "./MechanicBottomNavBar.styles";
import {
  MECHANIC_ASSIGNED_NAV_ICON_SVG,
  MECHANIC_WORK_NAV_ICON_SVG,
} from "./navIcons";

export type MechanicBottomNavTab = "assigned" | "work";

interface NavItemConfig {
  id: MechanicBottomNavTab;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: "assigned", label: "Мої авто", icon: MECHANIC_ASSIGNED_NAV_ICON_SVG },
  { id: "work", label: "В роботі", icon: MECHANIC_WORK_NAV_ICON_SVG },
];

const TAB_ANIMATION_DURATION_MS = 220;

export interface MechanicBottomNavBarProps {
  activeTab?: MechanicBottomNavTab;
  onAssignedPress?: () => void;
  onWorkPress?: () => void;
}

export function MechanicBottomNavBar({
  activeTab = "assigned",
  onAssignedPress,
  onWorkPress,
}: MechanicBottomNavBarProps) {
  const handlers: Record<MechanicBottomNavTab, (() => void) | undefined> = {
    assigned: onAssignedPress,
    work: onWorkPress,
  };

  const translateX = useSharedValue(0);
  const tabWidth = useSharedValue(0);
  const hasLaidOut = React.useRef(false);

  const activeIndex = NAV_ITEMS.findIndex((item) => item.id === activeTab);

  const animateToActiveTab = React.useCallback(
    (animated: boolean) => {
      if (tabWidth.value <= 0 || activeIndex < 0) return;

      const nextOffset = activeIndex * tabWidth.value;

      translateX.value = animated
        ? withTiming(nextOffset, {
            duration: TAB_ANIMATION_DURATION_MS,
            easing: Easing.out(Easing.cubic),
          })
        : nextOffset;
    },
    [activeIndex, tabWidth, translateX]
  );

  React.useEffect(() => {
    if (!hasLaidOut.current) return;
    animateToActiveTab(true);
  }, [activeTab, animateToActiveTab]);

  const handleItemsLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    const nextTabWidth = width / NAV_ITEMS.length;

    tabWidth.value = nextTabWidth;

    if (!hasLaidOut.current) {
      animateToActiveTab(false);
      hasLaidOut.current = true;
      return;
    }

    animateToActiveTab(true);
  };

  const activeIndicatorStyle = useAnimatedStyle(() => ({
    width: tabWidth.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.items} onLayout={handleItemsLayout}>
        <Animated.View style={[styles.activeIndicator, activeIndicatorStyle]} />

        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeTab;

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={handlers[item.id]}
              activeOpacity={0.8}
            >
              <SvgXml
                xml={item.icon}
                width={20}
                height={20}
                color={
                  isActive
                    ? theme.colors.accent.primary
                    : theme.colors.text.secondary
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
