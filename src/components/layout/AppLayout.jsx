import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../ui/Icon';
import LanguageSelector from '../ui/LanguageSelector';
import { useLanguage } from '../../context/LanguageContext';
import SiteFooter from './SiteFooter';

const links = [
  ['/dashboard','nav.overview','grid'], ['/athletes', 'nav.athletes', 'users'], ['/competitions', 'nav.competitions', 'calendar'],
  ['/staff', 'nav.staff', 'briefcase'], ['/sponsors', 'nav.sponsors', 'star'],
  ['/disciplines', 'nav.disciplines', 'grid'], ['/roles', 'nav.roles', 'briefcase'], ['/addresses', 'nav.addresses', 'grid'],
];

export default function AppLayout() {
  const { manager, signOut } = useAuth();
  const { t } = useLanguage();
  const team = manager?.team;
  return <div className="app-shell">
    <aside className="sidebar">
      <NavLink to="/dashboard" className="brand"><img src="/logo_teamsync.png" alt="TeamSync" /><span>Team<span>Sync</span></span></NavLink>
      <div className="team-switcher"><div className="team-mark">{team?.acronym?.[0] || team?.name?.[0] || 'T'}</div><div><strong>{team?.name || 'A minha equipa'}</strong><small>{team?.acronym || 'TeamSync'}</small></div></div>
      <div className="sidebar-nav"><nav><p className="nav-caption">{t('nav.teamManagement')}</p>{links.map(([to, label, icon]) => <NavLink key={to} to={to} end={to === '/dashboard'} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Icon name={icon} /><span>{t(label)}</span></NavLink>)}<p className="nav-caption nav-caption-spaced">{t('nav.account')}</p><NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Icon name="settings" /><span>{t('nav.settings')}</span></NavLink></nav></div>
      <div className="sidebar-bottom"><button className="logout" onClick={signOut}><Icon name="logout" size={16} /> {t('nav.logout')}</button></div>
    </aside>
    <main className="main-content"><header className="topbar"><div className="breadcrumbs">TeamSync <b>/</b> <strong>{t('nav.team')}</strong></div><div className="topbar-actions"><LanguageSelector compact /><div className="manager-chip"><div className="avatar">{manager?.name?.slice(0, 2).toUpperCase() || 'TM'}</div><span>{manager?.name || t('nav.team')}</span></div></div></header><Outlet /><SiteFooter /></main>
  </div>;
}
