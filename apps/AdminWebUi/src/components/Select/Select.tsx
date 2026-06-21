import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import styles from "./Select.module.css";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path
        d="M4 6L8 10L12 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = "Оберіть",
  disabled = false,
  id,
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listboxId = `${selectId}-listbox`;

  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const displayLabel = selectedOption?.label ?? placeholder;
  const isPlaceholder = !selectedOption;

  const close = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const open = () => {
    if (disabled) return;
    const selectedIndex = options.findIndex((option) => option.value === value);
    setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  };

  const selectOption = (option: SelectOption) => {
    onChange(option.value);
    close();
  };

  useEffect(() => {
    if (!isOpen) return;
    listboxRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen) {
        close();
      } else {
        open();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        open();
        return;
      }
      setFocusedIndex((current) => Math.min(current + 1, options.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        open();
        return;
      }
      setFocusedIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Escape") {
      close();
    }
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedIndex((current) => Math.min(current + 1, options.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = options[focusedIndex];
      if (option) {
        selectOption(option);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  return (
    <div className={styles.field} ref={containerRef}>
      {label ? (
        <label className={styles.label} htmlFor={selectId}>
          {label}
        </label>
      ) : null}

      <div className={styles.control}>
        <button
          id={selectId}
          type="button"
          className={[
            styles.trigger,
            isOpen ? styles.triggerOpen : "",
            disabled ? styles.triggerDisabled : "",
            isPlaceholder ? styles.triggerPlaceholder : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => (isOpen ? close() : open())}
          onKeyDown={handleTriggerKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
        >
          <span>{displayLabel}</span>
          <ChevronIcon open={isOpen} />
        </button>

        {isOpen ? (
          <div
            ref={listboxRef}
            id={listboxId}
            className={styles.dropdown}
            role="listbox"
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isFocused = index === focusedIndex;

              return (
                <button
                  key={option.value || "__empty__"}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={[
                    styles.option,
                    isSelected ? styles.optionSelected : "",
                    isFocused ? styles.optionFocused : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onClick={() => selectOption(option)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
