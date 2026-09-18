import type { MouseEvent } from 'react';
import { MaterialIcon } from '../../components/ui/MaterialIcon';

export function PatientWorkspaceNavigation({ patientId, pathname }: { patientId: string; pathname: string }) {
  const basePath = `/doctor/patients/${patientId}`;
  const tabs = [
    { label: 'Overview / نظرة عامة', href: basePath, icon: 'analytics', match: (current: string) => current === basePath },
    { label: 'Medical History / التاريخ المرضي', href: `${basePath}/history`, icon: 'history_edu', match: (current: string) => current === `${basePath}/history` || current.startsWith(`${basePath}/history/`) },
    { label: 'Clinical Timeline / التسلسل الزمني', href: `${basePath}/timeline`, icon: 'timeline', match: (current: string) => current === `${basePath}/timeline` || current.startsWith(`${basePath}/timeline/`) },
    { label: 'Clinical Notes / الملاحظات السريرية', href: `${basePath}/notes`, icon: 'description', match: (current: string) => current === `${basePath}/notes` || current.startsWith(`${basePath}/notes/`) },
    { label: 'Documents / الوثائق', href: `${basePath}/documents`, icon: 'folder', match: (current: string) => current === `${basePath}/documents` || current.startsWith(`${basePath}/documents/`) },
    { label: 'Prescriptions / الوصفات', href: `${basePath}/prescriptions`, icon: 'prescriptions', match: (current: string) => current === `${basePath}/prescriptions` || current.startsWith(`${basePath}/prescriptions/`) },
  ];

  const navigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <nav className="doctor-patient-tabs" aria-label="patient section navigation">
      {tabs.map((tab) => {
        const isActive = tab.match(pathname);
        return (
          <a
            aria-current={isActive ? 'page' : undefined}
            className={isActive ? 'is-active' : ''}
            href={tab.href}
            key={tab.label}
            onClick={(event) => navigate(event, tab.href)}
          >
            <MaterialIcon name={tab.icon} className="doctor-patient-tabs__icon" />
            <span>{tab.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
