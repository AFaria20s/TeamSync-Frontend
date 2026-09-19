import ResourcePage from "./ResourcePage";
export default function AthletesPage() {
  return (
    <ResourcePage
      resource="athletes"
      title="Atletas"
      singular="athlete"
      fields={[
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
        { name: "license", label: "fields.license", required: false },
        { name: "nationality", label: "fields.nationality", required: false },
        {
          name: "addressId",
          label: "fields.address",
          type: "select",
          source: "addresses",
          required: false,
        },
      ]}
    />
  );
}
