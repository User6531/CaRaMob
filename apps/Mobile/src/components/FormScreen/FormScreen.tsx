import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  ViewStyle,
  ScrollViewProps,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FormScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: ScrollViewProps["contentContainerStyle"];
  /** Offset for stack navigator header on iOS. Default true. */
  includeHeaderOffset?: boolean;
}

export function FormScreen({
  children,
  style,
  contentContainerStyle,
  includeHeaderOffset = true,
}: FormScreenProps) {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const keyboardVerticalOffset =
    Platform.OS === "ios" && includeHeaderOffset ? headerHeight : 0;

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView
        contentContainerStyle={[
          { flexGrow: 1, paddingBottom: insets.bottom + 32 },
          contentContainerStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
