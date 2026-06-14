import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStatusBar } from "../../hooks/useStatusBar";
import { ServiceHistoryScreenProps } from "../../navigation/types";
import { globalStyles } from "../../styles/globalStyles";
import { ServiceHistoryContent } from "./ServiceHistoryContent";

export default function ServiceHistoryScreen({
  navigation,
  route,
}: ServiceHistoryScreenProps) {
  useStatusBar();
  const insets = useSafeAreaInsets();
  const { vehicleId, vehicleTitle } = route.params;

  return (
    <View style={[globalStyles.container, globalStyles.pageBackground]}>
      <ServiceHistoryContent
        vehicleId={vehicleId}
        vehicleTitle={vehicleTitle}
        onAddPress={() =>
          navigation.navigate("ServiceHistoryCreate", {
            vehicleId,
            vehicleTitle,
          })
        }
        onEditPress={(visit) =>
          navigation.navigate("ServiceHistoryEdit", {
            vehicleId,
            vehicleTitle,
            visit,
          })
        }
        contentContainerStyle={{
          paddingBottom: 28 + insets.bottom,
        }}
      />
    </View>
  );
}
