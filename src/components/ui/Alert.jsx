export default function Alert({ message, tone = "error" }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${tone}`} role="alert">
      {message}
    </div>
  );
}
