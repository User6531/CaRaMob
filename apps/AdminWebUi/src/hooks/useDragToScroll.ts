import { useEffect, useRef, type RefObject } from "react";

const INTERACTIVE_SELECTOR =
  "button, a, input, textarea, select, [role='listbox'], [role='option'], [data-no-drag]";

interface DragState {
  isActive: boolean;
  startX: number;
  scrollLeft: number;
}

export function useDragToScroll<T extends HTMLElement>(
  draggingClassName?: string,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const dragState = useRef<DragState>({
    isActive: false,
    startX: 0,
    scrollLeft: 0,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const stopDragging = () => {
      if (!dragState.current.isActive) return;
      dragState.current.isActive = false;
      if (draggingClassName) {
        element.classList.remove(draggingClassName);
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return;

      const target = event.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) return;

      dragState.current = {
        isActive: true,
        startX: event.pageX,
        scrollLeft: element.scrollLeft,
      };

      if (draggingClassName) {
        element.classList.add(draggingClassName);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!dragState.current.isActive) return;

      event.preventDefault();
      const deltaX = event.pageX - dragState.current.startX;
      element.scrollLeft = dragState.current.scrollLeft - deltaX;
    };

    element.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopDragging);

    return () => {
      element.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, [draggingClassName]);

  return ref;
}
