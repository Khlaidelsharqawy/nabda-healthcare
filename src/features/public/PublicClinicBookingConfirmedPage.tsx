import { PublicClinicShell } from '../../layouts/PublicClinicShell';
import { useTheme } from '../../theme/ThemeProvider';
import { publicMessages } from '../../i18n/messages';
import { MaterialIcon, Badge, Panel, PanelBody } from '../../components/ui';

export function PublicClinicBookingConfirmedPage() {
  const { direction } = useTheme();
  const copy = direction === 'rtl' ? publicMessages.ar : publicMessages.en;

  return (
    <PublicClinicShell>
      <div className="public-clinic-page">
        <div className="public-clinic-confirmation-wrap">
          <Panel variant="elevated" padding="lg" className="public-clinic-confirmation">
            <div className="public-clinic-confirmation__badge-wrap">
              <span className="public-clinic-confirmation__icon">
                <MaterialIcon name="check_circle" />
              </span>
              <Badge variant="success" size="md">
                {copy.bookingKicker}
              </Badge>
            </div>

            <h1 className="public-clinic-confirmation__title">{copy.confirmation}</h1>
            <p className="public-clinic-confirmation__text">{copy.bookingText}</p>

            <div className="public-clinic-confirmation__box">
              <span className="public-clinic-confirmation__ref-label">{copy.reference}</span>
              <strong className="public-clinic-confirmation__ref-code">ALN-0001</strong>
              <small className="public-clinic-confirmation__note">{copy.notCreated}</small>
            </div>

            <div className="public-clinic-actions">
              <a href="/clinic/al-nour" className="ui-btn ui-btn--secondary ui-btn--md">
                <MaterialIcon name="arrow_back" />
                <span>{copy.backClinic}</span>
              </a>
              <a href="/login" className="ui-btn ui-btn--primary ui-btn--md">
                <MaterialIcon name="login" />
                <span>{copy.login}</span>
              </a>
            </div>
          </Panel>
        </div>
      </div>
    </PublicClinicShell>
  );
}
