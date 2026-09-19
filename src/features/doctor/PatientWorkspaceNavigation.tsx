import type { MouseEvent } from 'react';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

export function PatientWorkspaceNavigation({ patientId, pathname }: { patientId: string; pathname: string }) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? doctorMessages.ar.workspace.tabs : doctorMessages.en.workspace.tabs;
  const basePath = `/doctor/patients/${patientId}`;

  const tabs = [
    { label: copy.overview, href: basePath, icon: 'analytics', match: (current: string) => current === basePath },
    { label: copy.history, href: `${basePath}/history`, icon: 'history_edu', match: (current: string) => current === `${basePath}/history` || current.startsWith(`${basePath}/history/`) },
    { label: copy.timeline, href: `${basePath}/timeline`, icon: 'timeline', match: (current: string) => current === `${basePath}/timeline` || current.startsWith(`${basePath}/timeline/`) },
    { label: copy.notes, href: `${basePath}/notes`, icon: 'description', match: (current: string) => current === `${basePath}/notes` || current.startsWith(`${basePath}/notes/`) },
    { label: copy.documents, href: `${basePath}/documents`, icon: 'folder', match: (current: string) => current === `${basePath}/documents` || current.startsWith(`${basePath}/documents/`) },
    { label: copy.prescriptions, href: `${basePath}/prescriptions`, icon: 'prescriptions', match: (current: string) => current === `${basePath}/prescriptions` || current.startsWith(`${basePath}/prescriptions/`) },
  ];

  const navigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <nav
      aria-label="patient section navigation"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '2px',
        overflowX: 'auto',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.match(pathname);
        return (
          <a
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            onClick={(event) => navigate(event, tab.href)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1rem',
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              fontSize: '0.875rem',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
              textDecoration: 'none',
              borderBottom: isActive ? '2px solid var(--brand-primary)' : '2px solid transparent',
              backgroundColor: isActive ? 'var(--brand-primary-light)' : 'transparent',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <MaterialIcon
              name={tab.icon}
              style={{
                fontSize: '1.125rem',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-tertiary)',
              }}
            />
            <span>{tab.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
