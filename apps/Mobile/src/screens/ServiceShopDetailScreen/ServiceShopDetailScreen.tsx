import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { globalStyles } from "../../styles/globalStyles";
import { useTheme } from "../../hooks/useTheme";
import { ServiceShopDetailScreenProps } from "../../navigation/types";
import { getServiceById } from "../ServicesScreen/mockServiceShops";
import {
  formatPhoneForDisplay,
  getServiceInitials,
  SERVICE_TAG_LABELS,
} from "../ServicesScreen/serviceShopUtils";
import { styles } from "./ServiceShopDetailScreen.styles";
import { useAppAlert } from "../../components/AppAlert";

type SocialPlatform = "instagram" | "facebook" | "telegram" | "website";

const SOCIAL_CONFIG: Record<
  SocialPlatform,
  {
    label: string;
    icon: React.ComponentProps<typeof FontAwesome5>["name"];
    brand?: boolean;
  }
> = {
  instagram: { label: "Instagram", icon: "instagram", brand: true },
  facebook: { label: "Facebook", icon: "facebook", brand: true },
  telegram: { label: "Telegram", icon: "telegram", brand: true },
  website: { label: "Веб-сайт", icon: "globe" },
};

export default function ServiceShopDetailScreen({
  navigation,
  route,
}: ServiceShopDetailScreenProps) {
  const theme = useTheme();
  const { showError } = useAppAlert();
  const { serviceId } = route.params;
  const service = getServiceById(serviceId);

  const [coverError, setCoverError] = React.useState(false);
  const [logoError, setLogoError] = React.useState(false);

  if (!service) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.pageBackground,
          styles.errorContainer,
        ]}
      >
        <Text style={globalStyles.textPrimary}>Сервіс не знайдено</Text>
      </View>
    );
  }

  const handleCall = async () => {
    const url = `tel:${service.phone.replace(/\s/g, "")}`;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        showError("Не вдалося відкрити телефонний дзвінок");
      }
    } catch {
      showError("Не вдалося відкрити телефонний дзвінок");
    }
  };

  const handleOpenLink = async (url: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch {
      showError("Не вдалося відкрити посилання");
    }
  };

  const socialEntries = (
    Object.entries(service.socialLinks) as [SocialPlatform, string | undefined][]
  ).filter((entry): entry is [SocialPlatform, string] => Boolean(entry[1]));

  const hoursEntries = [
    { label: "Пн–Пт", value: service.workingHours.weekdays },
    service.workingHours.saturday
      ? { label: "Субота", value: service.workingHours.saturday }
      : null,
    service.workingHours.sunday
      ? { label: "Неділя", value: service.workingHours.sunday }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <View style={[globalStyles.container, globalStyles.pageBackground]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.coverWrapper}>
          {coverError || !service.coverImageUrl ? (
            <View style={styles.coverFallback}>
              <Text style={styles.coverFallbackText}>
                {getServiceInitials(service.name)}
              </Text>
            </View>
          ) : (
            <Image
              source={{ uri: service.coverImageUrl }}
              style={styles.coverImage}
              onError={() => setCoverError(true)}
            />
          )}
          <View style={styles.coverGradient} />

          <View style={styles.logoWrapper}>
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
          </View>
        </View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{service.name}</Text>
            <View
              style={[
                styles.statusBadge,
                service.isOpen ? styles.statusOpen : styles.statusClosed,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  service.isOpen ? styles.statusDotOpen : styles.statusDotClosed,
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  service.isOpen ? styles.statusTextOpen : styles.statusTextClosed,
                ]}
              >
                {service.isOpen ? "Відчинено" : "Зачинено"}
              </Text>
            </View>
          </View>

          {service.rating != null ? (
            <View style={styles.ratingRow}>
              <FontAwesome5 name="star" size={14} color="#D29922" solid />
              <Text style={styles.ratingText}>
                {service.rating.toFixed(1)} рейтинг
              </Text>
            </View>
          ) : null}

          {service.description ? (
            <Animated.View
              entering={FadeInDown.duration(350).delay(150)}
              style={styles.section}
            >
              <Text style={styles.sectionTitle}>Про сервіс</Text>
              <Text style={styles.description}>{service.description}</Text>
            </Animated.View>
          ) : null}

          <Animated.View
            entering={FadeInDown.duration(350).delay(200)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Контакти</Text>

            <View style={[styles.infoRow, styles.infoRowFirst]}>
              <Feather
                name="map-pin"
                size={18}
                color={theme.colors.accent.primary}
                style={styles.infoIcon}
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Адреса</Text>
                <Text style={styles.infoValue}>
                  {service.address}, {service.city}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.infoRow}
              onPress={handleCall}
              activeOpacity={0.7}
            >
              <Feather
                name="phone"
                size={18}
                color={theme.colors.accent.primary}
                style={styles.infoIcon}
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Телефон</Text>
                <Text style={styles.infoLink}>
                  {formatPhoneForDisplay(service.phone)}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(350).delay(250)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Графік роботи</Text>
            {hoursEntries.map((entry, index) => (
              <View
                key={entry.label}
                style={[styles.hoursRow, index === 0 && styles.hoursRowFirst]}
              >
                <Text style={styles.hoursLabel}>{entry.label}</Text>
                <Text style={styles.hoursValue}>{entry.value}</Text>
              </View>
            ))}
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(350).delay(300)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Послуги</Text>
            <View style={styles.tagsGrid}>
              {service.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{SERVICE_TAG_LABELS[tag]}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {socialEntries.length > 0 ? (
            <Animated.View
              entering={FadeInDown.duration(350).delay(350)}
              style={styles.section}
            >
              <Text style={styles.sectionTitle}>Соцмережі</Text>
              <View style={styles.socialRow}>
                {socialEntries.map(([platform, url]) => {
                  const config = SOCIAL_CONFIG[platform];
                  return (
                    <TouchableOpacity
                      key={platform}
                      style={styles.socialButton}
                      onPress={() => handleOpenLink(url)}
                      activeOpacity={0.7}
                    >
                      <FontAwesome5
                        name={config.icon}
                        size={16}
                        color={theme.colors.accent.primary}
                        brand={config.brand}
                      />
                      <Text style={styles.socialButtonText}>{config.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Animated.View>
          ) : null}

          <TouchableOpacity
            style={styles.bookingButton}
            onPress={() =>
              navigation.navigate("ServiceBooking", {
                serviceId: service.id,
                serviceName: service.name,
              })
            }
            activeOpacity={0.85}
          >
            <Feather name="calendar" size={18} color={theme.colors.text.inverse} />
            <Text style={styles.bookingButtonText}>Онлайн запис</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCall}
            activeOpacity={0.8}
          >
            <Feather name="phone" size={18} color={theme.colors.accent.primary} />
            <Text style={styles.actionButtonText}>Зателефонувати</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
