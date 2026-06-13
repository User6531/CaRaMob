import React, { useEffect, useRef } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { useTheme } from "../../hooks/useTheme";
import { REFRESH_LOADER_SVG } from "./refreshIcon";

const REFRESH_ICON_SIZE = 28;
const REFRESH_ROTATION_DURATION_MS = 1200;
const SLIDE_DURATION_MS = 360;
const SCREEN_WIDTH = Dimensions.get("window").width;
const HIDDEN_LEFT_OFFSET = -(SCREEN_WIDTH / 2 + REFRESH_ICON_SIZE);
const HIDDEN_RIGHT_OFFSET = SCREEN_WIDTH / 2 + REFRESH_ICON_SIZE;

interface RefreshStatusBarProps {
  visible: boolean;
}

export function RefreshStatusBar({ visible }: RefreshStatusBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, 8);
  const rotation = useSharedValue(0);
  const translateX = useSharedValue(HIDDEN_LEFT_OFFSET);
  const prevVisibleRef = useRef<boolean | null>(null);

  useEffect(() => {
    const prevVisible = prevVisibleRef.current;
    prevVisibleRef.current = visible;

    if (prevVisible === null) {
      translateX.value = visible ? 0 : HIDDEN_LEFT_OFFSET;
      return;
    }

    if (visible && !prevVisible) {
      translateX.value = HIDDEN_LEFT_OFFSET;
      translateX.value = withTiming(0, {
        duration: SLIDE_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      });
      return;
    }

    if (!visible && prevVisible) {
      translateX.value = withTiming(
        HIDDEN_RIGHT_OFFSET,
        {
          duration: SLIDE_DURATION_MS,
          easing: Easing.in(Easing.cubic),
        },
        (finished) => {
          if (finished) {
            translateX.value = HIDDEN_LEFT_OFFSET;
          }
        },
      );
    }
  }, [translateX, visible]);

  useEffect(() => {
    if (visible) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: REFRESH_ROTATION_DURATION_MS,
          easing: Easing.linear,
        }),
        -1,
        false,
      );
      return;
    }

    cancelAnimation(rotation);
    rotation.value = 0;
  }, [rotation, visible]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          paddingTop: topPadding,
        },
        containerAnimatedStyle,
      ]}
    >
      <Animated.View style={iconAnimatedStyle}>
        <SvgXml
          xml={REFRESH_LOADER_SVG}
          width={REFRESH_ICON_SIZE}
          height={REFRESH_ICON_SIZE}
          color={theme.colors.accent.primary}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
});
