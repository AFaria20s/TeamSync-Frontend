import { useEffect, useState } from "react";
import { api } from "../services/api";
import Alert from "../components/ui/Alert";
import Loading from "../components/ui/Loading";
import PageHeader from "../components/ui/PageHeader";
import { useLanguage } from "../context/LanguageContext";

export default function TeamSettingsPage() {
  const [team, setTeam] = useState(null);
  const [manager, setManager] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    district: "",
    postalCode: "",
    country: "",
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const { t } = useLanguage();
  useEffect(() => {
    Promise.all([api.team(), api.manager(), api.list("addresses")])
      .then(([currentTeam, currentManager, currentAddresses]) => {
        setTeam(currentTeam);
        setManager(currentManager);
        setAddresses(currentAddresses);
      })
      .catch((reason) =>
        setError(
          `Erro do backend: ${reason.message}${reason.status ? ` (HTTP ${reason.status})` : ""}`,
        ),
      );
  }, []);
  if (!team || !manager)
    return (
      <div className="page">
        <Loading />
        {error && <Alert message={error} />}
      </div>
    );
  async function save(event) {
    event.preventDefault();
    try {
      let addressId = manager.address?.id || manager.addressId || null;
      if (addressId === "__new__") {
        const createdAddress = await api.create("addresses", newAddress);
        addressId = createdAddress?.id;
        setAddresses((current) => [...current, createdAddress]);
      }
      const [updatedTeam, updatedManager] = await Promise.all([
        api.updateTeam(team),
        api.updateManager({
          name: manager.name,
          birthDay: manager.birthDay,
          email: manager.email,
          password: manager.password,
          phone: manager.phone,
          addressId,
        }),
      ]);
      if (updatedTeam) setTeam(updatedTeam);
      if (updatedManager) setManager(updatedManager);
      setError("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (reason) {
      setError(
        `Erro do backend: ${reason.message}${reason.status ? ` (HTTP ${reason.status})` : ""}`,
      );
    }
  }
  return (
    <div className="page">
      <PageHeader
        eyebrow={t("settings.eyebrow")}
        title={t("settings.title")}
        description={t("settings.description")}
      />
      <form className="content-card settings-card" onSubmit={save}>
        <h3 className="settings-section-title">{t("settings.team")}</h3>
        <div className="settings-fields">
          <label>
            {t("settings.name")}
            <input
              value={team.name || ""}
              onChange={(event) =>
                setTeam({ ...team, name: event.target.value })
              }
              required
            />
          </label>
          <label>
            {t("settings.acronym")}
            <input
              value={team.acronym || ""}
              onChange={(event) =>
                setTeam({ ...team, acronym: event.target.value })
              }
            />
          </label>
          <label>
            {t("settings.phone")}
            <input
              value={team.phone || ""}
              onChange={(event) =>
                setTeam({ ...team, phone: event.target.value })
              }
            />
          </label>
          <label>
            {t("settings.foundedYear")}
            <input
              type="number"
              value={team.foundedYear || ""}
              onChange={(event) =>
                setTeam({ ...team, foundedYear: event.target.value })
              }
            />
          </label>
          <label>
            {t("settings.license")}
            <input
              value={team.license || ""}
              onChange={(event) =>
                setTeam({ ...team, license: event.target.value })
              }
            />
          </label>
          <label>
            {t("settings.location")}
            <input
              value={team.location || ""}
              onChange={(event) =>
                setTeam({ ...team, location: event.target.value })
              }
            />
          </label>
          <label className="wide">
            {t("settings.descriptionField")}
            <textarea
              value={team.description || ""}
              onChange={(event) =>
                setTeam({ ...team, description: event.target.value })
              }
            />
          </label>
        </div>
        <h3 className="settings-section-title">{t("settings.manager")}</h3>
        <div className="settings-fields">
          <label>
            {t("settings.name")}
            <input
              value={manager.name || ""}
              onChange={(event) =>
                setManager({ ...manager, name: event.target.value })
              }
              required
            />
          </label>
          <label>
            {t("settings.birthDay")}
            <input
              type="date"
              value={manager.birthDay || ""}
              onChange={(event) =>
                setManager({ ...manager, birthDay: event.target.value })
              }
            />
          </label>
          <label>
            {t("settings.email")}
            <input
              type="email"
              value={manager.email || ""}
              onChange={(event) =>
                setManager({ ...manager, email: event.target.value })
              }
              required
            />
          </label>
          <label>
            {t("settings.phone")}
            <input
              value={manager.phone || ""}
              onChange={(event) =>
                setManager({ ...manager, phone: event.target.value })
              }
            />
          </label>
          <label>
            {t("settings.newPassword")}
            <input
              type="password"
              placeholder={t("settings.passwordHint")}
              onChange={(event) =>
                setManager({ ...manager, password: event.target.value })
              }
            />
          </label>
          <label>
            {t("settings.address")}
            <select
              value={manager.address?.id || manager.addressId || ""}
              onChange={(event) =>
                setManager({
                  ...manager,
                  addressId: event.target.value,
                  address: addresses.find(
                    (address) => address.id === event.target.value,
                  ),
                })
              }
            >
              <option value="">{t("common.noAddress")}</option>
              {addresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {[address.street, address.city, address.postalCode]
                    .filter(Boolean)
                    .join(", ")}
                </option>
              ))}
              <option value="__new__">{t("common.createAddress")}</option>
            </select>
          </label>
        </div>
        {manager.addressId === "__new__" && (
          <div className="inline-address">
            <strong>{t("common.newAddress")}</strong>
            <div className="settings-fields">
              {["street", "city", "district", "postalCode", "country"].map(
                (name) => (
                  <label key={name}>
                    {t(`fields.${name}`)}
                    <input
                      value={newAddress[name]}
                      required={name === "street" || name === "city"}
                      onChange={(event) =>
                        setNewAddress({
                          ...newAddress,
                          [name]: event.target.value,
                        })
                      }
                    />
                  </label>
                ),
              )}
            </div>
          </div>
        )}
        {error && <Alert message={error} />}
        {saved && <Alert message={t("settings.saved")} tone="success" />}
        <div className="settings-actions">
          <span>{t("settings.persisted")}</span>
          <button className="primary-button">{t("common.save")}</button>
        </div>
      </form>
    </div>
  );
}
