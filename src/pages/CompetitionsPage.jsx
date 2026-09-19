import { useEffect, useMemo, useState } from "react";
import ResourcePage from "./ResourcePage";
import { api } from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import Icon from "../components/ui/Icon";
import Alert from "../components/ui/Alert";
import { useLanguage } from "../context/LanguageContext";

const fields = [
  { name: "name", label: "fields.sponsorName" },
  { name: "location", label: "settings.location", required: false },
  { name: "competitionDate", label: "fields.contractStart", type: "date" },
  {
    name: "disciplineId",
    label: "fields.discipline",
    type: "select",
    source: "disciplines",
  },
];

export default function CompetitionsPage() {
  const [view, setView] = useState("list");
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [competitionFilter, setCompetitionFilter] = useState("upcoming");
  const [monthCursor, setMonthCursor] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const { t, language } = useLanguage();
  useEffect(() => {
    api
      .list("competitions")
      .then(setEvents)
      .catch((reason) =>
        setError(
          `Erro do backend: ${reason.message}${reason.status ? ` (HTTP ${reason.status})` : ""}`,
        ),
      );
  }, []);
  const grouped = useMemo(
    () =>
      events.reduce((acc, event) => {
        if (event.competitionDate)
          acc[event.competitionDate] = [
            ...(acc[event.competitionDate] || []),
            event,
          ];
        return acc;
      }, {}),
    [events],
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const filterCompetition = (competition) => {
    if (!competition.competitionDate || competitionFilter === "all")
      return competitionFilter === "all";
    const date = new Date(`${competition.competitionDate}T00:00:00`);
    return competitionFilter === "past" ? date < today : date >= today;
  };
  if (view === "list")
    return (
      <div className="page">
        <PageHeader
          eyebrow={t("resource.management")}
          title={t("nav.competitions")}
          description={t("calendar.description")}
          action={
            <div className="view-toggle">
              <button className="active" onClick={() => setView("list")}>
                {t("common.list")}
              </button>
              <button onClick={() => setView("calendar")}>
                <Icon name="calendar" size={14} /> {t("common.calendar")}
              </button>
            </div>
          }
        />
        <div className="competition-filters">
          <label>
            {t("calendar.filterLabel")}
            <select
              value={competitionFilter}
              onChange={(event) => setCompetitionFilter(event.target.value)}
            >
              <option value="upcoming">{t("calendar.filterUpcoming")}</option>
              <option value="all">{t("calendar.filterAll")}</option>
              <option value="past">{t("calendar.filterPast")}</option>
            </select>
          </label>
        </div>
        <ResourcePage
          resource="competitions"
          title={t("nav.competitions")}
          singular="competition"
          fields={fields}
          embedded
          itemFilter={filterCompetition}
        />
      </div>
    );
  const year = monthCursor.getFullYear();
  const monthNumber = monthCursor.getMonth();
  const days = new Date(year, monthNumber + 1, 0).getDate();
  const firstDay = (new Date(year, monthNumber, 1).getDay() + 6) % 7;
  const monthFormatter = new Intl.DateTimeFormat(language, {
    month: "long",
    year: "numeric",
  });
  const weekdayFormatter = new Intl.DateTimeFormat(language, {
    weekday: "short",
  });
  const todayKey = new Date().toISOString().slice(0, 10);
  const selectedEvents = selectedDate ? grouped[selectedDate] || [] : [];
  const changeMonth = (offset) => {
    setMonthCursor(new Date(year, monthNumber + offset, 1));
    setSelectedDate(null);
  };
  const goToday = () => {
    const today = new Date();
    setMonthCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(todayKey);
  };
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    weekdayFormatter.format(new Date(2024, 0, index + 1)),
  );
  return (
    <div className="page">
      <PageHeader
        eyebrow={t("calendar.eyebrow")}
        title={t("calendar.title")}
        description={t("calendar.description")}
        action={
          <div className="view-toggle">
            <button onClick={() => setView("list")}>{t("common.list")}</button>
            <button className="active" onClick={() => setView("calendar")}>
              <Icon name="calendar" size={14} /> {t("common.calendar")}
            </button>
          </div>
        }
      />
      {error && <Alert message={error} />}
      <section className="content-card calendar-card">
        <div className="calendar-title">
          <button
            aria-label={t("calendar.previous")}
            onClick={() => changeMonth(-1)}
          >
            ‹
          </button>
          <div>
            <h2>{monthFormatter.format(monthCursor)}</h2>
            <button className="calendar-today" onClick={goToday}>
              {t("calendar.today")}
            </button>
          </div>
          <button
            aria-label={t("calendar.next")}
            onClick={() => changeMonth(1)}
          >
            ›
          </button>
        </div>
        <div className="calendar-weekdays">
          {weekdays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="calendar-grid">
          {Array.from({ length: firstDay + days }, (_, index) => {
            const day = index - firstDay + 1;
            const date =
              day > 0
                ? `${year}-${String(monthNumber + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                : null;
            const dayEvents = date ? grouped[date] || [] : [];
            return (
              <button
                type="button"
                className={`calendar-day${dayEvents.length ? " has-events" : ""}${date === selectedDate ? " selected" : ""}${date === todayKey ? " today" : ""}`}
                key={index}
                disabled={!date}
                onClick={() => date && setSelectedDate(date)}
              >
                {day > 0 && (
                  <>
                    <b>{day}</b>
                    {dayEvents.map((event) => (
                      <span title={event.name} key={event.id}>
                        {event.name}
                      </span>
                    ))}
                  </>
                )}
              </button>
            );
          })}
        </div>
        {selectedDate && (
          <div className="calendar-selection">
            <div className="calendar-selection-heading">
              <div>
                <span className="eyebrow">{t("calendar.selectedDay")}</span>
                <h3>
                  {new Intl.DateTimeFormat(language, {
                    dateStyle: "full",
                  }).format(new Date(`${selectedDate}T12:00:00`))}
                </h3>
              </div>
              <button
                className="text-button"
                onClick={() => setSelectedDate(null)}
              >
                {t("common.cancel")}
              </button>
            </div>
            {selectedEvents.length ? (
              selectedEvents.map((event) => (
                <div className="calendar-event-row" key={event.id}>
                  <div className="date-block">
                    <strong>{event.competitionDate?.slice(-2) || "—"}</strong>
                  </div>
                  <div>
                    <strong>{event.name}</strong>
                    <small>
                      {event.location || t("dashboard.locationUnknown")}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">{t("calendar.noEvents")}</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
