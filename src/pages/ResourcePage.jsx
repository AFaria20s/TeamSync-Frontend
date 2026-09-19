import { useEffect, useState } from "react";
import { api } from "../services/api";
import Alert from "../components/ui/Alert";
import Loading from "../components/ui/Loading";
import Icon from "../components/ui/Icon";
import PageHeader from "../components/ui/PageHeader";
import ResourceForm from "../components/ui/ResourceForm";
import { useLanguage } from "../context/LanguageContext";

const defaults = {
  staff: [
    { name: "name", label: "fields.fullName" },
    {
      name: "birthDay",
      label: "fields.dateOfBirth",
      type: "date",
      required: false,
    },
    { name: "email", label: "fields.email", type: "email" },
    {
      name: "password",
      label: "fields.password",
      type: "password",
      required: false,
    },
    { name: "phone", label: "fields.phone", required: false },
    {
      name: "staffRoleId",
      label: "fields.role",
      type: "select",
      source: "staffroles",
      required: false,
    },
    {
      name: "addressId",
      label: "fields.address",
      type: "select",
      source: "addresses",
      required: false,
    },
  ],
  sponsors: [
    { name: "name", label: "fields.sponsorName" },
    { name: "email", label: "fields.email", type: "email", required: false },
    { name: "phone", label: "fields.phone", required: false },
    { name: "website", label: "fields.website", required: false },
    { name: "sponsorType", label: "fields.type", required: false },
    {
      name: "status",
      label: "fields.activeContract",
      type: "checkbox",
      required: false,
    },
    {
      name: "startDate",
      label: "fields.contractStart",
      type: "date",
      required: false,
    },
    {
      name: "endDate",
      label: "fields.contractEnd",
      type: "date",
      required: false,
    },
    {
      name: "addressId",
      label: "fields.address",
      type: "select",
      source: "addresses",
      required: false,
    },
  ],
  disciplines: [
    { name: "name", label: "fields.sponsorName" },
    {
      name: "description",
      label: "fields.description",
      type: "textarea",
      required: false,
    },
  ],
  staffroles: [
    { name: "name", label: "fields.sponsorName" },
    {
      name: "description",
      label: "fields.description",
      type: "textarea",
      required: false,
    },
  ],
  addresses: [
    { name: "street", label: "fields.street" },
    { name: "city", label: "fields.city" },
    { name: "district", label: "fields.district", required: false },
    { name: "postalCode", label: "fields.postalCode", required: false },
    { name: "country", label: "fields.country", required: false },
  ],
  results: [
    {
      name: "athleteId",
      label: "fields.athlete",
      type: "select",
      source: "athletes",
    },
    {
      name: "competitionId",
      label: "fields.competition",
      type: "select",
      source: "competitions",
    },
    {
      name: "position",
      label: "fields.position",
      type: "number",
      required: false,
    },
    { name: "finishTime", label: "fields.finishTime", required: false },
    { name: "points", label: "fields.points", type: "number", required: false },
    { name: "dnf", label: "fields.dnf", type: "checkbox", required: false },
  ],
};

export default function ResourcePage({
  resource,
  title,
  singular,
  fields = defaults[resource],
  embedded = false,
  onView,
  itemFilter,
}) {
  const [items, setItems] = useState([]);
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const { t } = useLanguage();
  const translatedTitle = t(
    `nav.${resource === "staffroles" ? "roles" : resource === "addresses" ? "addresses" : resource}`,
  );
  const translatedSingular =
    t(`resource.${singular}`) === `resource.${singular}`
      ? singular
      : t(`resource.${singular}`);
  const addressLabel = (address) =>
    [
      address.street,
      address.city,
      address.district,
      address.postalCode,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");
  const relationLabel = (option) =>
    option.name ||
    (option.street ? addressLabel(option) : option.email) ||
    option.id;
  function load() {
    setLoading(true);
    const sources = [
      ...new Set(
        fields.filter((field) => field.source).map((field) => field.source),
      ),
    ];
    Promise.all([
      api.list(resource),
      ...sources.map((source) => api.list(source)),
    ])
      .then(([records, ...related]) => {
        setItems(records);
        setOptions(
          Object.fromEntries(
            sources.map((source, index) => [source, related[index]]),
          ),
        );
      })
      .catch((reason) =>
        setError(
          t("resource.backendError", {
            message: reason.message,
            status: reason.status ? ` (HTTP ${reason.status})` : "",
          }),
        ),
      )
      .finally(() => setLoading(false));
  }
  useEffect(load, [resource]);
  async function save(values, newAddress) {
    try {
      if (values.addressId === "__new__") {
        const createdAddress = await api.create("addresses", newAddress);
        values = { ...values, addressId: createdAddress?.id };
      }
      if (modal?.id) await api.update(resource, modal.id, values);
      else await api.create(resource, values);
      setModal(null);
      load();
    } catch (reason) {
      setError(
        t("resource.backendError", {
          message: reason.message,
          status: reason.status ? ` (HTTP ${reason.status})` : "",
        }),
      );
    }
  }
  async function remove(id) {
    if (
      !window.confirm(t("resource.deleteConfirm", { item: translatedSingular }))
    )
      return;
    try {
      await api.remove(resource, id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (reason) {
      setError(
        t("resource.backendError", {
          message: reason.message,
          status: reason.status ? ` (HTTP ${reason.status})` : "",
        }),
      );
    }
  }
  const initialValues = modal?.item
    ? Object.fromEntries(
        fields.map((field) => [
          field.name,
          modal.item[field.name] ??
            modal.item[field.name.replace("Id", "")]?.id ??
            "",
        ]),
      )
    : {};
  const formFields = fields.map((field) => ({
    ...field,
    label: t(field.label),
    ...(field.source
      ? {
          options: (options[field.source] || []).map((option) => ({
            value: option.id,
            label: relationLabel(option),
          })),
        }
      : {}),
  }));
  const visibleItems = itemFilter ? items.filter(itemFilter) : items;
  const itemTitle = (item) =>
    item.name ||
    item.athlete?.name ||
    item.competition?.name ||
    (resource === "addresses" ? addressLabel(item) : item.id);
  const itemSubtitle = (item) =>
    resource === "addresses"
      ? [item.city, item.country].filter(Boolean).join(", ")
      : item.email || item.location || item.description || "—";
  return (
    <div className={embedded ? "" : "page"}>
      {!embedded && (
        <PageHeader
          eyebrow={t("resource.management")}
          title={translatedTitle}
          description={t("resource.description")}
          action={
            <button className="primary-button" onClick={() => setModal({})}>
              <Icon name="plus" size={16} />{" "}
              {t("resource.add", { item: translatedSingular })}
            </button>
          }
        />
      )}
      {error && <Alert message={error} />}
      {loading ? (
        <Loading />
      ) : (
        <section className="content-card full-card">
          <div className="table-toolbar">
            <div>
              <h3>
                {visibleItems.length} {t("common.records")}
              </h3>
              <span>{t("resource.saved")}</span>
            </div>
            {embedded && (
              <button className="primary-button" onClick={() => setModal({})}>
                <Icon name="plus" size={16} />{" "}
                {t("resource.add", { item: translatedSingular })}
              </button>
            )}
          </div>
          <div className="resource-list">
            {visibleItems.length === 0 && (
              <div className="empty-state">{t("common.noRecords")}</div>
            )}
            {visibleItems.map((item) => (
              <div className="resource-row" key={item.id}>
                <div>
                  <strong>{itemTitle(item)}</strong>
                  <small>{itemSubtitle(item)}</small>
                </div>
                <div className="row-actions">
                  {onView && (
                    <button
                      className="edit-button"
                      onClick={() => onView(item)}
                    >
                      {t("common.view")}
                    </button>
                  )}
                  <button
                    className="edit-button"
                    onClick={() => setModal({ id: item.id, item })}
                  >
                    {t("common.edit")}
                  </button>
                  <button
                    className="danger-button"
                    onClick={() => remove(item.id)}
                  >
                    {t("common.delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {modal && (
        <ResourceForm
          fields={formFields}
          initial={initialValues}
          submitLabel={
            modal.id
              ? t("resource.save", { item: translatedSingular })
              : t("resource.create", { item: translatedSingular })
          }
          onSubmit={save}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
