import { useCallback, useState } from "react";
import { AppAlert, AppAlertButton } from "./AppAlert";

export interface ShowAppAlertOptions {
  title: string;
  message?: string;
  buttons?: AppAlertButton[];
}

interface AppAlertState extends ShowAppAlertOptions {
  visible: boolean;
}

export function useAppAlert() {
  const [alertState, setAlertState] = useState<AppAlertState | null>(null);

  const hideAlert = useCallback(() => {
    setAlertState(null);
  }, []);

  const showAlert = useCallback((options: ShowAppAlertOptions) => {
    setAlertState({
      ...options,
      visible: true,
      buttons: options.buttons ?? [{ text: "OK", style: "default" }],
    });
  }, []);

  const showError = useCallback(
    (message: string, title = "Помилка") => {
      showAlert({ title, message });
    },
    [showAlert]
  );

  const showSuccess = useCallback(
    (message: string, title = "Успішно!", buttons?: AppAlertButton[]) => {
      showAlert({
        title,
        message,
        buttons: buttons ?? [{ text: "OK", style: "default" }],
      });
    },
    [showAlert]
  );

  const alertModal = alertState ? (
    <AppAlert
      visible={alertState.visible}
      title={alertState.title}
      message={alertState.message}
      buttons={alertState.buttons}
      onDismiss={hideAlert}
    />
  ) : null;

  return {
    showAlert,
    showError,
    showSuccess,
    hideAlert,
    alertModal,
  };
}
