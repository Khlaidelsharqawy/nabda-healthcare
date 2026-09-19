import { useEffect, useRef, useState } from 'react';

export function useMobileNavigation() {
  const [open, setOpen] = useState(false);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      if (lastFocusedRef.current) {
        requestAnimationFrame(() => lastFocusedRef.current?.focus());
      }
      return;
    }

    lastFocusedRef.current = document.activeElement instanceof HTMLElement && document.activeElement.matches('button[aria-controls]')
      ? document.activeElement
      : document.querySelector<HTMLElement>('button[aria-controls]');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;
      const drawer = document.querySelector('.is-nav-open aside');
      if (!(drawer instanceof HTMLElement)) return;

      const focusable = Array.from(drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return {
    open,
    toggle: () => setOpen((current) => !current),
    close: () => setOpen(false),
  };
}
