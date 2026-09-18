import { useLanguage } from '../../context/LanguageContext';

export default function LanguageSelector({ compact = false }) {
  const { language, changeLanguage, languages } = useLanguage();
  return <label className={compact ? 'language-selector compact' : 'language-selector'} aria-label="Language">
    <span>文</span>
    <select value={language} onChange={(event) => changeLanguage(event.target.value)}>
      {languages.map((item) => <option value={item.code} key={item.code}>{compact ? item.short : item.label}</option>)}
    </select>
  </label>;
}
