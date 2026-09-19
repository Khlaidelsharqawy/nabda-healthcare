import { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { authMessages } from '../../i18n/messages';
import { MaterialIcon, Button, FormField, Input, Select, Textarea, Badge } from '../../components/ui';

export function AuthRequestAccessPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? authMessages.ar : authMessages.en;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [role, setRole] = useState('physician');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [notes, setNotes] = useState('');
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fullName.trim() || !email.trim() || !facilityName.trim() || !phone.trim()) {
      setNotice({ text: copy.requestAccessValidation, error: true });
      return;
    }

    setSubmitted(true);
    setNotice({ text: copy.requestAccessSuccess, error: false });
  };

  return (
    <div className="auth-flow-container">
      <div className="auth-callout">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <Badge variant="brand" icon="verified_user">
            {copy.credentialNoticeTitle}
          </Badge>
        </div>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>
          {copy.credentialNoticeBody}
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: '1.25rem' }}>
        <FormField label={copy.fullName} required>
          <Input
            type="text"
            iconStart="person"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={copy.fullNamePlaceholder}
            required
            disabled={submitted}
          />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <FormField label={copy.identifier} required>
            <Input
              type="email"
              iconStart="mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={copy.emailPlaceholder}
              required
              disabled={submitted}
            />
          </FormField>
          <FormField label={copy.phoneNumber} required>
            <Input
              type="tel"
              iconStart="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={copy.phoneNumberPlaceholder}
              required
              disabled={submitted}
            />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <FormField label={copy.facilityName} required>
            <Input
              type="text"
              iconStart="local_hospital"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              placeholder={copy.facilityPlaceholder}
              required
              disabled={submitted}
            />
          </FormField>

          <FormField label={copy.clinicalRole} required>
            <Select
              iconStart="badge"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={submitted}
            >
              <option value="physician">{copy.rolePhysician}</option>
              <option value="assistant">{copy.roleAssistant}</option>
              <option value="administrator">{copy.roleAdministrator}</option>
            </Select>
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <FormField label={copy.licenseNumber}>
            <Input
              type="text"
              iconStart="assignment"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder={copy.licensePlaceholder}
              disabled={submitted}
            />
          </FormField>

          <FormField label={copy.specialty}>
            <Input
              type="text"
              iconStart="medical_services"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder={copy.specialtyPlaceholder}
              disabled={submitted}
            />
          </FormField>
        </div>

        <FormField label={copy.requestNotes}>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={copy.requestNotesPlaceholder}
            disabled={submitted}
            rows={3}
          />
        </FormField>

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitted} icon="send">
          {copy.submitRequestAccess}
        </Button>

        {notice && (
          <div
            className={`auth-alert ${notice.error ? 'auth-alert--error' : 'auth-alert--success'}`}
            role="status"
          >
            <MaterialIcon name={notice.error ? 'error' : 'check_circle'} />
            <span>{notice.text}</span>
          </div>
        )}

        <div className="auth-divider">
          <span>{copy.returnToLogin}</span>
        </div>

        <div className="auth-inline-row" style={{ gap: '0.75rem' }}>
          <a href="/login" className="ui-btn ui-btn--secondary ui-btn--md" style={{ flex: 1 }}>
            <MaterialIcon name="login" />
            <span>{copy.signInAction}</span>
          </a>
          <a href="/signup" className="ui-btn ui-btn--outline ui-btn--md" style={{ flex: 1 }}>
            <MaterialIcon name="person_add" />
            <span>{copy.createPatientAccount}</span>
          </a>
        </div>
      </form>
    </div>
  );
}
