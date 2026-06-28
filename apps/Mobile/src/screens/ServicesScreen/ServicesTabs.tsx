import React from "react";
import { LayoutChangeEvent, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { styles } from "./ServicesTabs.styles";

export type ServicesTab = "my" | "nearby";

interface TabConfig {
  id: ServicesTab;
  label: string;
}

const TABS: TabConfig[] = [
  { id: "my", label: "Мої сервіси" },
  { id: "nearby", label: "Сервіси поряд" },
];

const TAB_ANIMATION_DURATION_MS = 220;

export interface ServicesTabsProps {
  activeTab: ServicesTab;
  onTabChange: (tab: ServicesTab) => void;
}

export function ServicesTabs({ activeTab, onTabChange }: ServicesTabsProps) {
  const translateX = useSharedValue(0);
  const tabWidth = useSharedValue(0);
  const hasLaidOut = React.useRef(false);

  const activeIndex = TABS.findIndex((tab) => tab.id === activeTab);

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
    const nextTabWidth = width / TABS.length;

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

        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.8}
            >
              <Text style={isActive ? styles.tabLabelActive : styles.tabLabel}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
