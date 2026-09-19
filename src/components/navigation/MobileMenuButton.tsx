import { MaterialIcon } from '../ui/MaterialIcon';

export function MobileMenuButton({ open, onClick, label, controls }: { open: boolean; onClick: () => void; label: string; controls?: string }) {
  return (
    <button className="mobile-menu-button" type="button" aria-label={label} aria-expanded={open} aria-controls={controls} onClick={onClick}>
      <MaterialIcon name={open ? 'close' : 'menu'} />
    </button>
  );
}
