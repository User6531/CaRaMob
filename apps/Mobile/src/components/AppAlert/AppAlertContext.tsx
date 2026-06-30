import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { AppAlert, AppAlertButton } from "./AppAlert";

export interface ShowAppAlertOptions {
  title: string;
  message?: string;
  buttons?: AppAlertButton[];
}

interface AppAlertState extends ShowAppAlertOptions {
  visible: boolean;
}

interface AppAlertContextValue {
  showAlert: (options: ShowAppAlertOptions) => void;
  showError: (message: string, title?: string) => void;
  showSuccess: (
    message: string,
    title?: string,
    buttons?: AppAlertButton[]
  ) => void;
  hideAlert: () => void;
}

const AppAlertContext = createContext<AppAlertContextValue | null>(null);

export function AppAlertProvider({ children }: { children: React.ReactNode }) {
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

  const value: AppAlertContextValue = {
    showAlert,
    showError,
    showSuccess,
    hideAlert,
  };

  return (
    <AppAlertContext.Provider value={value}>
      {children}
      {alertState ? (
        <AppAlert
          visible={alertState.visible}
          title={alertState.title}
          message={alertState.message}
          buttons={alertState.buttons}
          onDismiss={hideAlert}
        />
      ) : null}
    </AppAlertContext.Provider>
  );
}

export function useAppAlert() {
  const context = useContext(AppAlertContext);
  if (!context) {
    throw new Error("useAppAlert must be used within an AppAlertProvider");
  }
  return context;
}
