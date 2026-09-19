import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel, PanelHeader, PanelBody, PanelFooter } from '../../components/ui/Panel';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { FormField, Input } from '../../components/ui/FormControls';
import { useTheme } from '../../theme/ThemeProvider';
import { profileMessages } from '../../i18n/messages';

export type UserRole = 'doctor' | 'assistant' | 'admin';

export function UserProfilePage({ role }: { role: UserRole }) {
  const { direction, setDirection, theme, setTheme } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? profileMessages.ar : profileMessages.en;
  const roleDefaults = copy.defaults[role];

  // Local state for profile fields
  const [displayName, setDisplayName] = useState<string>(roleDefaults.name);
  const [username, setUsername] = useState<string>(roleDefaults.username);
  const [email, setEmail] = useState<string>(roleDefaults.email);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Local state for password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Local save notice
  const [profileNotice, setProfileNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePasswordUpdate = (e: FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordNotice({ text: copy.passwordEmptyNotice, type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordNotice({ text: copy.passwordMismatchNotice, type: 'error' });
      return;
    }
    setPasswordNotice({ text: copy.passwordUpdatedNotice, type: 'success' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleProfileSave = (e: FormEvent) => {
    e.preventDefault();
    setProfileNotice(copy.changesSaved);
    setTimeout(() => setProfileNotice(null), 4000);
  };

  return (
    <div className="user-profile-page" data-direction={isRtl ? 'rtl' : 'ltr'} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <PageHeader
        title={copy.title}
        subtitle={copy.subtitle}
        badge={
          <Badge variant="brand" icon="verified_user">
            {roleDefaults.role}
          </Badge>
        }
      />

      {profileNotice && (
        <div
          role="status"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-success-bg, #f0fdf4)',
            color: 'var(--color-success, #166534)',
            border: '1px solid var(--color-success-border, #bbf7d0)',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          <MaterialIcon name="check_circle" style={{ color: 'var(--color-success, #16a34a)', fontSize: '20px' }} />
          <span>{profileNotice}</span>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Identity & Profile */}
        <form onSubmit={handleProfileSave}>
          <Panel>
            <PanelHeader title={copy.profileSection} icon="badge" />

            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-subtle, #f8fafc)',
                  border: '1px solid var(--border-color, #e2e8f0)',
                }}
              >
                <div
                  style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--bg-surface, #ffffff)',
                    border: '2px solid var(--border-color, #e2e8f0)',
                    flexShrink: 0,
                  }}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={displayName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <MaterialIcon name="person" style={{ fontSize: '36px', color: 'var(--text-muted, #94a3b8)' }} />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-image-upload"
                    onChange={handleImageChange}
                  />
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      icon="photo_camera"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {copy.changePhoto}
                    </Button>
                    {profileImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon="delete"
                        onClick={handleRemoveImage}
                        style={{ color: 'var(--color-error, #dc2626)' }}
                      >
                        {copy.removePhoto}
                      </Button>
                    )}
                  </div>
                  <small style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.75rem', lineHeight: '1.4' }}>
                    {copy.photoNote}
                  </small>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <FormField label={copy.displayName} htmlFor="profile-display-name" required>
                  <Input
                    id="profile-display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    prefixIcon="person"
                    required
                  />
                </FormField>

                <FormField label={copy.username} htmlFor="profile-username" required>
                  <Input
                    id="profile-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    prefixIcon="alternate_email"
                    required
                  />
                </FormField>

                <FormField label={copy.email} htmlFor="profile-email" required>
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    prefixIcon="mail"
                    required
                  />
                </FormField>

                <FormField label={copy.role} htmlFor="profile-role">
                  <Input
                    id="profile-role"
                    type="text"
                    value={roleDefaults.role}
                    disabled
                    readOnly
                    prefixIcon="verified_user"
                  />
                </FormField>

                <FormField label={copy.clinic} htmlFor="profile-clinic">
                  <Input
                    id="profile-clinic"
                    type="text"
                    value={roleDefaults.clinic}
                    disabled
                    readOnly
                    prefixIcon="local_hospital"
                  />
                </FormField>
              </div>
            </PanelBody>

            <PanelFooter style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px' }}>
              <Button type="submit" variant="primary" icon="save">
                {copy.saveChanges}
              </Button>
            </PanelFooter>
          </Panel>
        </form>

        {/* Right Column: Password & Preferences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Password Settings */}
          <form onSubmit={handlePasswordUpdate}>
            <Panel>
              <PanelHeader title={copy.passwordSection} icon="lock" />

              <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {passwordNotice && (
                  <div
                    role="status"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      backgroundColor:
                        passwordNotice.type === 'success'
                          ? 'var(--color-success-bg, #f0fdf4)'
                          : 'var(--color-error-bg, #fef2f2)',
                      color:
                        passwordNotice.type === 'success'
                          ? 'var(--color-success, #166534)'
                          : 'var(--color-error, #991b1b)',
                      border: `1px solid ${
                        passwordNotice.type === 'success'
                          ? 'var(--color-success-border, #bbf7d0)'
                          : 'var(--color-error-border, #fecaca)'
                      }`,
                    }}
                  >
                    <MaterialIcon
                      name={passwordNotice.type === 'success' ? 'check_circle' : 'error'}
                      style={{ fontSize: '18px' }}
                    />
                    <span>{passwordNotice.text}</span>
                  </div>
                )}

                <FormField label={copy.currentPassword} htmlFor="current-password">
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    prefixIcon="key"
                  />
                </FormField>

                <FormField label={copy.newPassword} htmlFor="new-password">
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    prefixIcon="lock_reset"
                  />
                </FormField>

                <FormField label={copy.confirmPassword} htmlFor="confirm-password">
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    prefixIcon="check"
                  />
                </FormField>
              </PanelBody>

              <PanelFooter style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px' }}>
                <Button type="submit" variant="secondary" icon="key">
                  {copy.updatePassword}
                </Button>
              </PanelFooter>
            </Panel>
          </form>

          {/* Regional & Interface Preferences */}
          <Panel>
            <PanelHeader title={copy.preferencesSection} icon="tune" />

            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color)' }}>
                  {copy.language}
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <Button
                    type="button"
                    variant={direction === 'ltr' ? 'primary' : 'outline'}
                    icon="translate"
                    onClick={() => setDirection('ltr')}
                    size="sm"
                    style={{ justifyContent: 'center' }}
                  >
                    {copy.english}
                  </Button>
                  <Button
                    type="button"
                    variant={direction === 'rtl' ? 'primary' : 'outline'}
                    icon="translate"
                    onClick={() => setDirection('rtl')}
                    size="sm"
                    style={{ justifyContent: 'center' }}
                  >
                    {copy.arabic}
                  </Button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color)' }}>
                  {copy.theme}
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <Button
                    type="button"
                    variant={theme === 'light' ? 'primary' : 'outline'}
                    icon="light_mode"
                    onClick={() => setTheme('light')}
                    size="sm"
                    style={{ justifyContent: 'center' }}
                  >
                    {copy.lightTheme}
                  </Button>
                  <Button
                    type="button"
                    variant={theme === 'dark' ? 'primary' : 'outline'}
                    icon="dark_mode"
                    onClick={() => setTheme('dark')}
                    size="sm"
                    style={{ justifyContent: 'center' }}
                  >
                    {copy.darkTheme}
                  </Button>
                </div>
              </div>
            </PanelBody>
          </Panel>

          {/* Account Status */}
          <Panel>
            <PanelHeader title={copy.accountSection} icon="security" />

            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-subtle, #f8fafc)',
                  border: '1px solid var(--border-color, #e2e8f0)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--text-color)' }}>
                    {copy.sessionStatus}
                  </strong>
                  <small style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.75rem' }}>
                    {copy.activeSecure}
                  </small>
                </div>
                <Badge variant="success" icon="check_circle">
                  {copy.activeSecure}
                </Badge>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-subtle, #f8fafc)',
                  border: '1px solid var(--border-color, #e2e8f0)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--text-color)' }}>
                    {copy.twoFactor}
                  </strong>
                  <small style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.75rem' }}>
                    {copy.twoFactorEnabled}
                  </small>
                </div>
                <Badge variant="success" icon="verified">
                  {copy.twoFactorEnabled}
                </Badge>
              </div>
            </PanelBody>
          </Panel>
        </div>
      </div>
    </div>
  );
}
