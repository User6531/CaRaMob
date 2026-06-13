import React from "react";
import { AppState } from "react-native";
import {
  clearServiceHistoryCreateDraft,
  loadServiceHistoryCreateDraft,
  saveServiceHistoryCreateDraft,
  ServiceHistoryWorkDraft,
} from "../storage/serviceHistoryDraftStorage";

const createEmptyWork = (): ServiceHistoryWorkDraft => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  title: "",
  price: "",
});

interface UseServiceHistoryCreateDraftOptions {
  vehicleId: string;
}

export function useServiceHistoryCreateDraft({
  vehicleId,
}: UseServiceHistoryCreateDraftOptions) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [works, setWorks] = React.useState<ServiceHistoryWorkDraft[]>([
    createEmptyWork(),
  ]);
  const [isDraftLoaded, setIsDraftLoaded] = React.useState(false);
  const [hasRestoredDraft, setHasRestoredDraft] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const loadDraft = async () => {
      setIsDraftLoaded(false);
      setHasRestoredDraft(false);

      const draft = await loadServiceHistoryCreateDraft(vehicleId);
      if (!isMounted) return;

      if (draft) {
        setTitle(draft.title);
        setDescription(draft.description);
        setWorks(draft.works.length ? draft.works : [createEmptyWork()]);
        setHasRestoredDraft(true);
      } else {
        setTitle("");
        setDescription("");
        setWorks([createEmptyWork()]);
      }

      setIsDraftLoaded(true);
    };

    loadDraft();

    return () => {
      isMounted = false;
    };
  }, [vehicleId]);

  const persistDraft = React.useCallback(async () => {
    await saveServiceHistoryCreateDraft(vehicleId, {
      title,
      description,
      works,
    });
  }, [vehicleId, title, description, works]);

  React.useEffect(() => {
    if (!isDraftLoaded) return;

    const timeoutId = setTimeout(() => {
      void persistDraft();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [isDraftLoaded, persistDraft]);

  React.useEffect(() => {
    if (!isDraftLoaded) return;

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background" || nextState === "inactive") {
        void persistDraft();
      }
    });

    return () => subscription.remove();
  }, [isDraftLoaded, persistDraft]);

  const clearDraft = React.useCallback(async () => {
    await clearServiceHistoryCreateDraft(vehicleId);
    setHasRestoredDraft(false);
  }, [vehicleId]);

  const addWork = React.useCallback(() => {
    setWorks((prev) => [...prev, createEmptyWork()]);
  }, []);

  const removeWork = React.useCallback((id: string) => {
    setWorks((prev) =>
      prev.length > 1 ? prev.filter((item) => item.id !== id) : prev
    );
  }, []);

  const updateWorkTitle = React.useCallback((id: string, value: string) => {
    setWorks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: value } : item))
    );
  }, []);

  const updateWorkPrice = React.useCallback((id: string, value: string) => {
    setWorks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: value } : item))
    );
  }, []);

  return {
    title,
    setTitle,
    description,
    setDescription,
    works,
    isDraftLoaded,
    hasRestoredDraft,
    clearDraft,
    addWork,
    removeWork,
    updateWorkTitle,
    updateWorkPrice,
  };
}
