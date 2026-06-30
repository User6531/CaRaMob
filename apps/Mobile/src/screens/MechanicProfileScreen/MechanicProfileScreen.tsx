import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useTheme } from "../../hooks/useTheme";
import { globalStyles } from "../../styles/globalStyles";
import { MechanicProfileScreenProps } from "../../navigation/types";
import { styles } from "./MechanicProfileScreen.styles";

export default function MechanicProfileScreen({
  navigation,
}: MechanicProfileScreenProps) {
  useStatusBar();
  const theme = useTheme();

  return (
    <ScrollView
      style={[globalStyles.container, globalStyles.pageBackground]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn.duration(280)}>
        <Text style={styles.pageTitle}>Профіль механіка</Text>
        <Text style={styles.pageSubtitle}>
          Робочий акаунт автосервісу
        </Text>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(60)}>
        <View style={styles.heroCard}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>М</Text>
            </View>
          </View>
          <Text style={styles.heroName}>Механік СТО</Text>
          <View style={styles.statusChip}>
            <View style={styles.statusDot} />
            <Text style={styles.statusChipText}>Демо-режим</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(120)}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Про режим</Text>
          <Text style={styles.sectionText}>
            Тут ви керуєте призначеними авто та етапами ремонту. Авторизація та
            синхронізація з CRM з&apos;являться пізніше.
          </Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(180)}>
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => navigation.replace("Home")}
          activeOpacity={0.85}
        >
          <Feather name="user" size={18} color={theme.colors.accent.primary} />
          <Text style={styles.switchButtonText}>Повернутись до режиму водія</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}
