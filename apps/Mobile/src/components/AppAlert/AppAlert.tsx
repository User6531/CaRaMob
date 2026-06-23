import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { globalStyles } from "../../styles/globalStyles";

export type AppAlertButtonStyle = "default" | "cancel" | "destructive";

export interface AppAlertButton {
  text: string;
  onPress?: () => void;
  style?: AppAlertButtonStyle;
}

export interface AppAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AppAlertButton[];
  onDismiss: () => void;
}

export function AppAlert({
  visible,
  title,
  message,
  buttons = [{ text: "OK", style: "default" }],
  onDismiss,
}: AppAlertProps) {
  const handlePress = (button: AppAlertButton) => {
    onDismiss();
    button.onPress?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onDismiss}
        />
        <View style={styles.card}>
          <Text style={[globalStyles.textLarge, styles.title]}>{title}</Text>
          {message ? (
            <Text style={[globalStyles.textSecondary, styles.message]}>
              {message}
            </Text>
          ) : null}

          <View
            style={[
              styles.actions,
              buttons.length > 1 && styles.actionsMultiple,
            ]}
          >
            {buttons.map((button, index) => {
              const isDestructive = button.style === "destructive";
              const isCancel = button.style === "cancel";
              const isPrimary = !isCancel && !isDestructive;

              return (
                <TouchableOpacity
                  key={`${button.text}-${index}`}
                  style={[
                    styles.actionButton,
                    buttons.length > 1 && styles.actionButtonMultiple,
                    isPrimary && styles.actionButtonPrimary,
                    isCancel && styles.actionButtonSecondary,
                    isDestructive && styles.actionButtonDestructive,
                  ]}
                  onPress={() => handlePress(button)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.actionButtonText,
                      isPrimary && styles.actionButtonTextPrimary,
                      isCancel && styles.actionButtonTextSecondary,
                      isDestructive && styles.actionButtonTextDestructive,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#161B22",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#30363D",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  actions: {
    gap: 10,
  },
  actionsMultiple: {
    flexDirection: "column-reverse",
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonMultiple: {
    width: "100%",
  },
  actionButtonPrimary: {
    backgroundColor: "#4ade9e",
  },
  actionButtonSecondary: {
    backgroundColor: "#21262D",
    borderWidth: 1,
    borderColor: "#30363D",
  },
  actionButtonDestructive: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#F85149",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  actionButtonTextPrimary: {
    color: "#121212",
  },
  actionButtonTextSecondary: {
    color: "#FFFFFF",
  },
  actionButtonTextDestructive: {
    color: "#F85149",
  },
});
