import { type ReactNode } from 'react';
import { MaterialIcon } from './MaterialIcon';

export interface TabItem<T extends string = string> {
  id: T;
  label: ReactNode;
  icon?: string;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps<T extends string = string> {
  tabs: Array<TabItem<T>>;
  activeTab: T;
  onChange: (tabId: T) => void;
  variant?: 'pills' | 'underline' | 'segmented';
  size?: 'sm' | 'md';
  className?: string;
}

export function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  variant = 'segmented',
  size = 'md',
  className = '',
}: TabsProps<T>) {
  return (
    <div className={`ui-tabs ui-tabs--${variant} ui-tabs--${size} ${className}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            className={`ui-tab ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.icon && <MaterialIcon name={tab.icon} className="ui-tab__icon" />}
            <span className="ui-tab__label">{tab.label}</span>
            {tab.badge && <span className="ui-tab__badge">{tab.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}

