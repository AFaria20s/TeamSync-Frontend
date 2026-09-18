import { Link } from 'react-router-dom';
import LanguageSelector from '../components/ui/LanguageSelector';
import SiteFooter from '../components/layout/SiteFooter';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
  return <div className="marketing-shell">
    <header className="marketing-header">
      <Link to="/" className="marketing-brand"><img src="/logo_teamsync.png" alt="TeamSync" /><strong>Team<span>Sync</span></strong></Link>
      <nav><a href="#platform">{t('home.platform')}</a><a href="#features">{t('home.features')}</a><a href="#about">{t('home.about')}</a></nav>
      <div className="marketing-actions"><LanguageSelector compact /><Link className="header-login" to="/login">{t('home.signIn')}</Link><Link className="primary-button header-cta" to="/login">{t('home.getStarted')}</Link></div>
    </header>
    <main>
      <section className="hero-section" id="platform">
        <div className="hero-copy"><span className="eyebrow">{t('home.eyebrow')}</span><h1>{t('home.title')} <em>{t('home.titleAccent')}</em></h1><p>{t('home.description')}</p><div className="hero-actions"><Link className="primary-button" to="/login">{t('home.cta')}</Link><a className="hero-link" href="#features">{t('home.explore')} <span>↗</span></a></div><div className="hero-proof"><div className="proof-avatars"><span>R</span><span>M</span><span>A</span><span>+</span></div><p>{t('home.proof')}</p></div></div>
        <div className="hero-art" aria-hidden="true"><div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div><div className="hero-panel"><div className="hero-panel-top"><span className="live-dot"></span>{t('home.liveOverview')}<b>•••</b></div><div className="hero-panel-title"><span>{t('home.teamPerformance')}</span><strong>+24.8%</strong></div><div className="chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div className="hero-panel-footer"><span><b>12</b>{t('home.riders')}</span><span><b>08</b>{t('home.races')}</span><span><b>94%</b>{t('home.readiness')}</span></div></div><div className="floating-badge badge-top"><span>↗</span><div><b>+18%</b><small>{t('home.growth')}</small></div></div><div className="floating-badge badge-bottom"><span>✓</span><div><b>{t('home.nextRace')}</b><small>Porto · 24 Sep</small></div></div></div>
      </section>
      <section className="feature-section" id="features"><div className="section-intro"><span className="eyebrow">{t('home.why')}</span><h2>{t('home.featuresTitle')}</h2><p>{t('home.featuresDescription')}</p></div><div className="feature-grid"><article><span className="feature-number">01</span><h3>{t('home.featureOneTitle')}</h3><p>{t('home.featureOneDescription')}</p></article><article><span className="feature-number">02</span><h3>{t('home.featureTwoTitle')}</h3><p>{t('home.featureTwoDescription')}</p></article><article><span className="feature-number">03</span><h3>{t('home.featureThreeTitle')}</h3><p>{t('home.featureThreeDescription')}</p></article></div></section>
      <section className="closing-section" id="about"><div><span className="eyebrow light">{t('home.readyEyebrow')}</span><h2>{t('home.readyTitle')}</h2></div><Link className="primary-button" to="/login">{t('home.enterWorkspace')} <span>↗</span></Link></section>
    </main>
    <SiteFooter dark />
  </div>;
}
