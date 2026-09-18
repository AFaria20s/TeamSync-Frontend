import { useLanguage } from '../../context/LanguageContext';

export default function SiteFooter({ dark = false }) {
  const { t } = useLanguage();
  return <footer className={`site-footer${dark ? ' site-footer-dark' : ''}`}>
    <div className="footer-brand"><img src="/logo_teamsync.png" alt="TeamSync" /><strong>Team<span>Sync</span></strong></div>
    <p>{t('footer.tagline')}</p>
    <div className="footer-links">
      <a href="https://github.com/AFaria20s/TeamSync-Backend" target="_blank" rel="noreferrer">{t('footer.source')}</a>
      <a href="https://github.com/AFaria20s" target="_blank" rel="noreferrer">{t('footer.credits')}</a>
      <span>{t('footer.license')}</span>
    </div>
    <small>© {new Date().getFullYear()} TeamSync · {t('footer.madeBy')} <a href="https://github.com/AFaria20s" target="_blank" rel="noreferrer">AFaria20s</a></small>
  </footer>;
}
