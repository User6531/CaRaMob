import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { AutoServiceShop } from "../../types/serviceShop";
import {
  formatDistance,
  getServiceInitials,
  SERVICE_TAG_LABELS,
} from "./serviceShopUtils";
import { styles } from "./ServiceShopCard.styles";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export interface ServiceShopCardProps {
  service: AutoServiceShop;
  index: number;
  showDistance?: boolean;
  onPress: () => void;
}

export function ServiceShopCard({
  service,
  index,
  showDistance = false,
  onPress,
}: ServiceShopCardProps) {
  const [logoError, setLogoError] = React.useState(false);
  const scale = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const visibleTags = service.tags.slice(0, 3);
  const extraTagsCount = service.tags.length - visibleTags.length;

  return (
    <AnimatedTouchable
      entering={FadeInDown.delay(index * 60)
        .duration(350)
        .damping(18)}
      style={[styles.card, animatedCardStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <View style={styles.cardHeader}>
        {logoError ? (
          <View style={styles.logoFallback}>
            <Text style={styles.logoFallbackText}>
              {getServiceInitials(service.name)}
            </Text>
          </View>
        ) : (
          <Image
            source={{ uri: service.logoUrl }}
            style={styles.logo}
            onError={() => setLogoError(true)}
          />
        )}

        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {service.name}
            </Text>
            <View
              style={[
                styles.statusBadge,
                service.isOpen ? styles.statusOpen : styles.statusClosed,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  service.isOpen
                    ? styles.statusDotOpen
                    : styles.statusDotClosed,
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  service.isOpen
                    ? styles.statusTextOpen
                    : styles.statusTextClosed,
                ]}
              >
                {service.isOpen ? "Відчинено" : "Зачинено"}
              </Text>
            </View>
          </View>
          <Text style={styles.address} numberOfLines={1}>
            {service.address}, {service.city}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        {showDistance && service.distanceKm != null ? (
          <View style={styles.metaItem}>
            <Feather name="map-pin" size={12} color="#8E8E93" />
            <Text style={styles.metaAccent}>
              {formatDistance(service.distanceKm)}
            </Text>
          </View>
        ) : service.visitCount != null ? (
          <View style={styles.metaItem}>
            <Feather name="clock" size={12} color="#8E8E93" />
            <Text style={styles.metaText}>
              {service.visitCount}{" "}
              {service.visitCount === 1
                ? "візит"
                : service.visitCount < 5
                  ? "візити"
                  : "візитів"}
            </Text>
          </View>
        ) : (
          <View />
        )}

        {service.rating != null ? (
          <View style={styles.metaItem}>
            <Feather name="star" size={12} color="#D29922" />
            <Text style={styles.metaText}>{service.rating.toFixed(1)}</Text>
          </View>
        ) : null}

        {service.isSubscribed ? (
          <View style={styles.metaItem}>
            <Feather name="check-circle" size={12} color="#4ade9e" />
            <Text style={styles.metaAccent}>Підписаний</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.tagsRow}>
        {visibleTags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{SERVICE_TAG_LABELS[tag]}</Text>
          </View>
        ))}
        {extraTagsCount > 0 ? (
          <View style={styles.tag}>
            <Text style={styles.tagText}>+{extraTagsCount}</Text>
          </View>
        ) : null}
      </View>
    </AnimatedTouchable>
  );
}
