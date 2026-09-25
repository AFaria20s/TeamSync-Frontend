import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Alert from "../components/ui/Alert";
import LanguageSelector from "../components/ui/LanguageSelector";
import SiteFooter from "../components/layout/SiteFooter";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";

const verificationRequests = new Map();

export default function VerifyEmailPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [status, setStatus] = useState(token ? "loading" : "waiting");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    let active = true;
    if (!verificationRequests.has(token)) {
      verificationRequests.set(token, api.verifyEmail(token));
    }

    verificationRequests
      .get(token)
      .then(() => {
        if (active) setStatus("success");
      })
      .catch((reason) => {
        if (active) {
          setError(reason.message || t("verification.error"));
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, [token, t]);

  const content = {
    loading: {
      title: t("verification.loadingTitle"),
      description: t("verification.loadingDescription"),
    },
    waiting: {
      title: t("verification.waitingTitle"),
      description: email
        ? t("verification.waitingDescription", { email })
        : t("verification.waitingDescriptionGeneric"),
    },
    success: {
      title: t("verification.successTitle"),
      description: t("verification.successDescription"),
    },
  }[status];

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
          <div className="login-form">
            <span className="eyebrow">{t("verification.eyebrow")}</span>
            <h2>{status === "error" ? t("verification.errorTitle") : content.title}</h2>
            {status === "error" ? (
              <>
                <Alert message={error} />
                <p>{t("verification.errorDescription")}</p>
              </>
            ) : (
              <p>{content.description}</p>
            )}
            {status === "waiting" && <Alert message={t("verification.checkInbox")} tone="success" />}
            {(status === "success" || status === "error") && (
              <Link className="primary-button login-button" to="/login">
                {t("verification.goToLogin")}
              </Link>
            )}
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
