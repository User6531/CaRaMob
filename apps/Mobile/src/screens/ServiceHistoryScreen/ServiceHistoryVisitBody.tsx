import React from "react";
import { Text, View } from "react-native";
import { ServiceHistoryVisitDto } from "../../types/api";
import {
  formatPrice,
  formatVisitDate,
  getRecordsTotalPrice,
  SERVICE_HISTORY_PREVIEW_RECORDS_LIMIT,
} from "./serviceHistoryUtils";
import { styles } from "./ServiceHistoryScreen.styles";

interface ServiceHistoryVisitBodyProps {
  visit: ServiceHistoryVisitDto;
  limitRecords?: boolean;
}

export function ServiceHistoryVisitBody({
  visit,
  limitRecords = true,
}: ServiceHistoryVisitBodyProps) {
  const allRecords = visit.records ?? [];
  const recordsToShow = limitRecords
    ? allRecords.slice(0, SERVICE_HISTORY_PREVIEW_RECORDS_LIMIT)
    : allRecords;
  const hiddenCount = limitRecords
    ? Math.max(allRecords.length - SERVICE_HISTORY_PREVIEW_RECORDS_LIMIT, 0)
    : 0;

  return (
    <>
      <View style={styles.visitHeader}>
        <Text style={styles.visitTitle}>{visit.title}</Text>
        <Text style={styles.visitDate}>{formatVisitDate(visit.createdAt)}</Text>
      </View>

      {visit.description ? (
        <Text style={styles.visitDescription}>{visit.description}</Text>
      ) : null}

      <Text style={styles.worksTitle}>Виконані роботи</Text>
      {recordsToShow.length ? (
        <>
          {recordsToShow.map((record) => (
            <View key={record.id} style={styles.workRow}>
              <Text style={styles.workName}>{record.title}</Text>
              {formatPrice(record.price) ? (
                <Text style={styles.workPrice}>{formatPrice(record.price)}</Text>
              ) : null}
            </View>
          ))}
          {hiddenCount > 0 ? (
            <Text style={styles.moreRecordsHint}>
              Ще {hiddenCount}{" "}
              {hiddenCount === 1
                ? "робота"
                : hiddenCount < 5
                  ? "роботи"
                  : "робіт"}{" "}
              — натисніть, щоб переглянути всі
            </Text>
          ) : null}
          <View style={styles.workTotalRow}>
            <Text style={styles.workTotalLabel}>Разом</Text>
            <Text style={styles.workTotalPrice}>
              {formatPrice(getRecordsTotalPrice(allRecords))}
            </Text>
          </View>
        </>
      ) : (
        <Text style={styles.emptyText}>
          Для цього візиту список робіт ще не додано.
        </Text>
      )}
    </>
  );
}
