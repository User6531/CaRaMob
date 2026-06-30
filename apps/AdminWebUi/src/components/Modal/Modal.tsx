import { useEffect, type ReactNode } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: "default" | "large";
  hideHeader?: boolean;
}

export function Modal({
  isOpen,
  title,
  onClose,
  children,
  size = "default",
  hideHeader = false,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={[styles.modal, size === "large" ? styles.modalLarge : ""]
          .filter(Boolean)
          .join(" ")}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {hideHeader ? null : (
          <div className={styles.header}>
            <h2 id="modal-title" className={styles.title}>
              {title}
            </h2>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Закрити"
            >
              ×
            </button>
          </div>
        )}
        <div className={[styles.body, size === "large" ? styles.bodyLarge : ""]
          .filter(Boolean)
          .join(" ")}>
          {children}
        </div>
      </div>
    </div>
  );
}
