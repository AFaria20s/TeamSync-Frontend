import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/ui/Loading";
import PageHeader from "../components/ui/PageHeader";
import { useLanguage } from "../context/LanguageContext";

export default function DashboardPage() {
  const { manager } = useAuth();
  const { t, language } = useLanguage();
  const [data, setData] = useState({
    athletes: [],
    competitions: [],
    sponsors: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all(
      ["athletes", "competitions", "sponsors"].map((resource) =>
        api.list(resource),
      ),
    )
      .then(([athletes, competitions, sponsors]) =>
        setData({ athletes, competitions, sponsors }),
      )
      .catch((reason) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingCompetitions = data.competitions
    .filter(
      (competition) =>
        competition.competitionDate &&
        new Date(`${competition.competitionDate}T00:00:00`) >= today,
    )
    .sort((left, right) =>
      left.competitionDate.localeCompare(right.competitionDate),
    );
  const dateFormatter = new Intl.DateTimeFormat(language, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (loading)
    return (
      <div className="page">
        <Loading />
      </div>
    );
  return (
    <div className="page dashboard-page">
      <PageHeader
        eyebrow={t("dashboard.eyebrow")}
        title={t("dashboard.greeting", {
          name: manager?.name?.split(" ")[0] || "manager",
        })}
        description={t("dashboard.description")}
        action={
          <Link className="primary-button" to="/athletes">
            {t("dashboard.manage")}
          </Link>
        }
      />
      {error && <div className="alert alert-error">{error}</div>}
      <div className="stats-grid">
        {[
          [t("dashboard.athletes"), data.athletes.length, "/athletes"],
          [
            t("dashboard.competitions"),
            upcomingCompetitions.length,
            "/competitions",
          ],
          [t("dashboard.sponsors"), data.sponsors.length, "/sponsors"],
        ].map(([label, value, to]) => (
          <Link className="stat-card" to={to} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{t("dashboard.viewInfo")}</small>
          </Link>
        ))}
      </div>
      <div className="dashboard-columns">
        <section className="content-card dashboard-panel">
          <div className="card-heading">
            <div>
              <span className="eyebrow">{t("dashboard.roster")}</span>
              <h3>{t("dashboard.teamAthletes")}</h3>
              <small>{t("dashboard.rosterDescription")}</small>
            </div>
            <Link className="text-button" to="/athletes">
              {t("dashboard.viewAll")}
            </Link>
          </div>
          {data.athletes.length ? (
            data.athletes.slice(0, 5).map((athlete) => (
              <div className="data-row" key={athlete.id}>
                <div className="avatar">
                  {athlete.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <strong>{athlete.name}</strong>
                  <small>{athlete.email}</small>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">{t("common.noRecords")}</div>
          )}
        </section>
        <section className="content-card dashboard-panel">
          <div className="card-heading">
            <div>
              <span className="eyebrow">{t("dashboard.calendar")}</span>
              <h3>{t("dashboard.nextCompetitions")}</h3>
              <small>{t("dashboard.upcomingDescription")}</small>
            </div>
            <Link className="text-button" to="/competitions">
              {t("dashboard.viewAll")}
            </Link>
          </div>
          {upcomingCompetitions.length ? (
            upcomingCompetitions.slice(0, 5).map((competition) => (
              <div className="data-row competition-row" key={competition.id}>
                <div className="date-block">
                  <strong>
                    {new Date(
                      `${competition.competitionDate}T12:00:00`,
                    ).getDate()}
                  </strong>
                  <small>
                    {new Intl.DateTimeFormat(language, {
                      month: "short",
                    }).format(
                      new Date(`${competition.competitionDate}T12:00:00`),
                    )}
                  </small>
                </div>
                <div>
                  <strong>{competition.name}</strong>
                  <small>
                    {dateFormatter.format(
                      new Date(`${competition.competitionDate}T12:00:00`),
                    )}{" "}
                    · {competition.location || t("dashboard.locationUnknown")}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">{t("dashboard.noUpcoming")}</div>
          )}
        </section>
      </div>
    </div>
  );
}
