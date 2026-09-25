import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/ui/Alert";
import LanguageSelector from "../components/ui/LanguageSelector";
import { useLanguage } from "../context/LanguageContext";
import SiteFooter from "../components/layout/SiteFooter";

export default function RegisterPage() {
  const { token, signUp } = useAuth();
  const { t } = useLanguage();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/dashboard" replace />;

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await signUp({
        managerName: form.get("managerName"),
        email: form.get("email"),
        password: form.get("password"),
        teamName: form.get("teamName"),
      });
    } catch (reason) {
      setError(reason.message || t("register.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="login-shell">
        <div className="login-visual">
          <div className="brand">
            <img src="/logo_teamsync.png" alt="TeamSync" />
            <span>
              Team<span>Sync</span>
            </span>
          </div>
          <div className="visual-content">
            <span className="eyebrow light">{t("login.eyebrow")}</span>
            <h1 dangerouslySetInnerHTML={{ __html: t("login.title") }} />
            <p>{t("login.description")}</p>
          </div>
        </div>
        <div className="login-form-area">
          <div className="login-language">
            <LanguageSelector />
          </div>
          <form className="login-form" onSubmit={submit}>
            <span className="eyebrow">{t("register.welcome")}</span>
            <h2>{t("register.heading")}</h2>
            <p>{t("register.subheading")}</p>
            <Alert message={error} />
            <label>
              {t("register.managerName")}
              <input
                name="managerName"
                type="text"
                required
                autoComplete="name"
              />
            </label>
            <label>
              {t("register.teamName")}
              <input
                name="teamName"
                type="text"
                required
                autoComplete="organization"
              />
            </label>
            <label>
              {t("login.email")}
              <input
                name="email"
                type="email"
                required
                placeholder="name@team.com"
                autoComplete="email"
              />
            </label>
            <label>
              {t("login.password")}
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </label>
            <button className="primary-button login-button" disabled={loading}>
              {loading ? t("register.creating") : t("register.submit")}
            </button>
            <p className="auth-switch">
              {t("register.hasAccount")}{" "}
              <Link to="/login">{t("register.signIn")}</Link>
            </p>
          </form>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
