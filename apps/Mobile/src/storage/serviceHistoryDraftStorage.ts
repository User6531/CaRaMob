import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ServiceHistoryWorkDraft {
  id: string;
  title: string;
  price: string;
}

export interface ServiceHistoryCreateDraft {
  title: string;
  description: string;
  works: ServiceHistoryWorkDraft[];
  updatedAt: string;
}

const draftKey = (vehicleId: string) =>
  `service-history-create-draft:${vehicleId}`;

export const isServiceHistoryDraftEmpty = (
  draft: Pick<ServiceHistoryCreateDraft, "title" | "description" | "works">
) =>
  !draft.title.trim() &&
  !draft.description.trim() &&
  draft.works.every((work) => !work.title.trim() && !work.price.trim());

export const loadServiceHistoryCreateDraft = async (
  vehicleId: string
): Promise<ServiceHistoryCreateDraft | null> => {
  try {
    const raw = await AsyncStorage.getItem(draftKey(vehicleId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as ServiceHistoryCreateDraft;
    if (
      typeof parsed.title !== "string" ||
      typeof parsed.description !== "string" ||
      !Array.isArray(parsed.works)
    ) {
      return null;
    }

    const works = parsed.works
      .filter(
        (work): work is ServiceHistoryWorkDraft =>
          typeof work === "object" &&
          work !== null &&
          typeof work.id === "string" &&
          typeof work.title === "string" &&
          typeof work.price === "string"
      )
      .map((work) => ({
        id: work.id,
        title: work.title,
        price: work.price,
      }));

    return {
      title: parsed.title,
      description: parsed.description,
      works,
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    return null;
  }
};

export const saveServiceHistoryCreateDraft = async (
  vehicleId: string,
  draft: Pick<ServiceHistoryCreateDraft, "title" | "description" | "works">
) => {
  if (isServiceHistoryDraftEmpty(draft)) {
    await clearServiceHistoryCreateDraft(vehicleId);
    return;
  }

  const payload: ServiceHistoryCreateDraft = {
    ...draft,
    updatedAt: new Date().toISOString(),
  };

  await AsyncStorage.setItem(draftKey(vehicleId), JSON.stringify(payload));
};

export const clearServiceHistoryCreateDraft = async (vehicleId: string) => {
  await AsyncStorage.removeItem(draftKey(vehicleId));
};
