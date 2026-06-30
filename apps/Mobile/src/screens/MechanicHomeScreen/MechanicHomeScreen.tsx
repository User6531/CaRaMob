import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStatusBar } from "../../hooks/useStatusBar";
import { globalStyles } from "../../styles/globalStyles";
import { NotificationBellButton } from "../../components/NotificationBellButton";
import { useNotifications } from "../../context/NotificationsContext";
import { MechanicWorkProvider, useMechanicWork } from "../../context/MechanicWorkContext";
import {
  MechanicBottomNavBar,
  MechanicBottomNavTab,
} from "../../components/MechanicBottomNavBar";
import { MechanicHomeScreenProps } from "../../navigation/types";
import { MechanicAssignedVehiclesContent } from "../MechanicAssignedVehiclesScreen/MechanicAssignedVehiclesContent";
import { MechanicActiveWorkContent } from "../MechanicActiveWorkScreen/MechanicActiveWorkContent";
import { styles } from "./MechanicHomeScreen.styles";

function MechanicHomeContent({ navigation }: MechanicHomeScreenProps) {
  const insets = useSafeAreaInsets();
  const { unreadCount } = useNotifications();
  const { setActiveVehicleId } = useMechanicWork();
  const [activeTab, setActiveTab] =
    React.useState<MechanicBottomNavTab>("assigned");

  const scrollBottomPadding = 120 + insets.bottom;

  const handleVehiclePress = (vehicleId: string) => {
    setActiveVehicleId(vehicleId);
    setActiveTab("work");
  };

  return (
    <View style={[globalStyles.container, globalStyles.pageBackground]}>
      <View style={styles.tabContent}>
        {activeTab === "assigned" ? (
          <Animated.View
            key="assigned"
            entering={FadeIn.duration(280)}
            style={styles.tabPanel}
          >
            <MechanicAssignedVehiclesContent
              contentContainerStyle={{ paddingBottom: scrollBottomPadding }}
              onVehiclePress={handleVehiclePress}
            />
          </Animated.View>
        ) : null}

        {activeTab === "work" ? (
          <Animated.View
            key="work"
            entering={FadeIn.duration(280)}
            style={styles.tabPanel}
          >
            <MechanicActiveWorkContent
              contentContainerStyle={{ paddingBottom: scrollBottomPadding }}
            />
          </Animated.View>
        ) : null}
      </View>

      <NotificationBellButton
        unreadCount={unreadCount}
        onPress={() => navigation.navigate("Notifications")}
      />

      <View style={[styles.bottomNav, { paddingBottom: 16 + insets.bottom }]}>
        <TouchableOpacity
          style={styles.bottomAvatar}
          onPress={() => navigation.navigate("MechanicProfile")}
          activeOpacity={0.8}
        >
          <Text style={styles.bottomAvatarText}>М</Text>
        </TouchableOpacity>

        <MechanicBottomNavBar
          activeTab={activeTab}
          onAssignedPress={() => setActiveTab("assigned")}
          onWorkPress={() => setActiveTab("work")}
        />
      </View>
    </View>
  );
}

export default function MechanicHomeScreen(props: MechanicHomeScreenProps) {
  useStatusBar();

  return (
    <MechanicWorkProvider>
      <MechanicHomeContent {...props} />
    </MechanicWorkProvider>
  );
}
