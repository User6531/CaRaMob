import React from "react";
import { ScrollView, Text, View, ViewStyle } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { ServicesTabs, ServicesTab } from "./ServicesTabs";
import { ServiceShopCard } from "./ServiceShopCard";
import { MOCK_MY_SERVICES, MOCK_NEARBY_SERVICES } from "./mockServiceShops";
import { styles } from "./ServicesScreen.styles";

export interface ServicesContentProps {
  onServicePress: (serviceId: string) => void;
  contentContainerStyle?: ViewStyle;
}

export function ServicesContent({
  onServicePress,
  contentContainerStyle,
}: ServicesContentProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = React.useState<ServicesTab>("my");

  const scrollTopInset = 16 + insets.top;
  const services =
    activeTab === "my" ? MOCK_MY_SERVICES : MOCK_NEARBY_SERVICES;

  return (
    <View style={styles.panel}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: 0 },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.scrollContent, { paddingTop: scrollTopInset }]}>
          <Text style={styles.pageTitle}>Мої сервіси</Text>
          <Text style={styles.pageSubtitle}>
            {activeTab === "my"
              ? "СТО, на які ви підписані або вже відвідували"
              : "Автосервіси у вашому регіоні"}
          </Text>

          <View style={styles.tabsWrapper}>
            <ServicesTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </View>

          {activeTab === "nearby" ? (
            <Animated.View
              entering={FadeIn.duration(250)}
              style={styles.regionBadge}
            >
              <Feather name="navigation" size={14} color={theme.colors.accent.primary} />
              <Text style={styles.regionBadgeText}>Київ та околиці</Text>
            </Animated.View>
          ) : null}

          <Animated.View
            key={activeTab}
            entering={FadeIn.duration(300)}
            style={styles.listSection}
          >
            {services.map((service, index) => (
              <ServiceShopCard
                key={service.id}
                service={service}
                index={index}
                showDistance={activeTab === "nearby"}
                onPress={() => onServicePress(service.id)}
              />
            ))}

            {!services.length ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>
                  {activeTab === "my"
                    ? "Ще немає сервісів"
                    : "Немає сервісів поряд"}
                </Text>
                <Text style={styles.emptyText}>
                  {activeTab === "my"
                    ? "Коли ви відвідаєте автосервіс або підпишетесь на нього, він з'явиться тут."
                    : "Спробуйте змінити регіон або перевірте пізніше."}
                </Text>
              </View>
            ) : null}
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
