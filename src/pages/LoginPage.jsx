import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/ui/Alert';
import LanguageSelector from '../components/ui/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import SiteFooter from '../components/layout/SiteFooter';

export default function LoginPage() {
  const { token, signIn } = useAuth();
  const { t } = useLanguage();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  if (token) return <Navigate to="/dashboard" replace />;
  async function submit(event) {
    event.preventDefault(); setLoading(true); setError('');
    const form = new FormData(event.currentTarget);
    try { await signIn({ email: form.get('email'), password: form.get('password') }); } catch (reason) { setError(reason.message || 'Não foi possível iniciar sessão.'); } finally { setLoading(false); }
  }
  return <><div className="login-shell"><div className="login-visual"><div className="brand"><img src="/logo_teamsync.png" alt="TeamSync" /><span>Team<span>Sync</span></span></div><div className="visual-content"><span className="eyebrow light">{t('login.eyebrow')}</span><h1 dangerouslySetInnerHTML={{ __html: t('login.title') }} /><p>{t('login.description')}</p></div></div><div className="login-form-area"><div className="login-language"><LanguageSelector /></div><form className="login-form" onSubmit={submit}><span className="eyebrow">{t('login.welcome')}</span><h2>{t('login.heading')}</h2><p>{t('login.subheading')}</p><Alert message={error} /><label>{t('login.email')}<input name="email" type="email" required placeholder="name@team.com" /></label><label>{t('login.password')}<input name="password" type="password" required placeholder="••••••••" /></label><button className="primary-button login-button" disabled={loading}>{loading ? t('login.validating') : t('login.submit')}</button></form></div></div><SiteFooter /></>;
}
