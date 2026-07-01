import { useState } from "react";
import type { StoVehicleActivityEntry, StoVehicleActivityType } from "../../types/stoVehicle";
import { ACTIVITY_ACTOR_ROLE_LABELS } from "../../utils/stoVehicleActivityLog";
import { formatEventDateTime } from "../../utils/stoVehicleLabels";
import styles from "./ActivityLog.module.css";

const ACTIVITY_DOT_COLORS: Record<StoVehicleActivityType, string> = {
  vehicle_created: "#6e7681",
  appointment_scheduled: "#58a6ff",
  vehicle_arrived: "#4ade9e",
  status_changed: "#a371f7",
  mechanic_assigned: "#d29922",
  approval_requested: "#ffa657",
  approval_sent_to_client: "#58a6ff",
  approval_approved: "#4ade9e",
  approval_rejected: "#f85149",
};

interface ActivityLogProps {
  entries: StoVehicleActivityEntry[];
  hint?: string;
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <span
      className={[styles.chevron, expanded ? styles.chevronExpanded : ""]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <svg viewBox="0 0 16 16" width="14" height="14">
        <path
          d="M4 6l4 4 4-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function ActivityLog({
  entries,
  hint = "Повний життєвий цикл: статуси, погодження, призначення механіка",
}: ActivityLogProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className={styles.section}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setIsExpanded((current) => !current)}
        aria-expanded={isExpanded}
      >
        <div>
          <div className={styles.toggleMain}>
            <h3 className={styles.toggleTitle}>Журнал дій</h3>
            <span className={styles.countBadge}>{entries.length}</span>
          </div>
          <p className={styles.toggleHint}>{hint}</p>
        </div>
        <ChevronIcon expanded={isExpanded} />
      </button>

      <div
        className={[
          styles.bodyWrapper,
          isExpanded ? styles.bodyWrapperExpanded : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className={styles.bodyInner}>
          <div className={styles.body}>
            {entries.length === 0 ? (
              <p className={styles.empty}>Записів у журналі поки немає.</p>
            ) : (
              <div className={styles.scrollArea}>
                <ul className={styles.list}>
                  {entries.map((entry) => (
                    <li key={entry.id} className={styles.entry}>
                      <div className={styles.marker}>
                        <span
                          className={styles.dot}
                          style={{ backgroundColor: ACTIVITY_DOT_COLORS[entry.type] }}
                        />
                      </div>
                      <div className={styles.entryMain}>
                        <div className={styles.entryHeader}>
                          <p className={styles.entryTitle}>{entry.title}</p>
                          <time className={styles.entryTime} dateTime={entry.occurredAt}>
                            {formatEventDateTime(entry.occurredAt)}
                          </time>
                        </div>
                        <div className={styles.entryMeta}>
                          <span className={styles.actorName}>{entry.actorName}</span>
                          <span className={styles.actorRole}>
                            {ACTIVITY_ACTOR_ROLE_LABELS[entry.actorRole]}
                          </span>
                        </div>
                        {entry.description ? (
                          <p className={styles.entryDescription}>{entry.description}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
