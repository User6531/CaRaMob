import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={styles.field}>
      {label ? (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={[styles.input, error ? styles.inputError : "", className]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error ? <span className={styles.error}>{error}</span> : null}
    </div>
  );
}
