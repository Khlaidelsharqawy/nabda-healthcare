import { MaterialIcon } from '../ui/MaterialIcon';
import { doctorShellMessages } from '../../i18n/messages';
import { useTheme } from '../../theme/ThemeProvider';

export function DoctorHeader({ arabic, onLanguageToggle }: { arabic: boolean; onLanguageToggle: () => void }) {
  const messages = arabic ? doctorShellMessages.ar : doctorShellMessages.en;
  const { theme, setTheme } = useTheme();

  return (
    <header className="doctor-header">
      <a className="doctor-header__identity" href="/doctor/dashboard" aria-label="AegisHealth Doctor Workspace">
        <img className="doctor-header__logo-image" alt="AegisHealth Medical Ecosystem Logo" src="https://lh3.googleusercontent.com/aida/AEtjO1UEMpHAmy_b9yBHfzExArIuQj82YVE-kkqyeDvtD00jBeKzLXeXpgqV3eT1NASrEi2GtjgkIAK55KV5DKhcz-Jt09PUFsGU1G3bAMIdhAvRV-HdhJoWdIqbq1K363gW0DBSK6vUrtej3gTIYEVb_nZ2ec5D1q3j-MzQASH0wVJQF2ckdum9eYTuCnvJ79ranTbcitlt7U-qTCgDVSYjj4Qg3rg4lzCjattDy3ghgBiD3rhiNCLTHpDlMhU" />
        <span className="doctor-header__wordmark">
          <strong>AegisHealth</strong>
          <small>CLINICAL AI PLATFORM</small>
        </span>
      </a>
      <div className="doctor-header__context">
        <div className="doctor-header__clinic">
          <strong>{messages.clinic}</strong>
          <small>{messages.department}</small>
        </div>
        <span className="doctor-header__role"><MaterialIcon name="shield_person" />{messages.role}</span>
      </div>
      <div className="doctor-header__actions">
        <button className="doctor-header__language" type="button" onClick={onLanguageToggle} aria-label={messages.language}>
          <MaterialIcon name="translate" />
          <span>{messages.language}</span>
        </button>
        <button className="doctor-header__icon-button" type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={messages.theme}>
          <MaterialIcon name={theme === 'light' ? 'dark_mode' : 'light_mode'} />
        </button>
        <button className="doctor-header__icon-button doctor-header__notification" type="button" aria-label={messages.notifications}>
          <MaterialIcon name="notifications" />
          <span />
        </button>
        <div className="doctor-header__profile">
          <div><strong>{messages.doctor}</strong><small>{messages.specialty}</small></div>
          <span className="doctor-header__avatar"><MaterialIcon name="person" /></span>
        </div>
      </div>
    </header>
  );
}
