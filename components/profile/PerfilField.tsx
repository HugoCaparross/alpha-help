interface PerfilFieldProps {
  label: string;

  value: string | number | null | undefined;
}

export default function PerfilField({ label, value }: PerfilFieldProps) {
  const displayValue =
    value === null || value === undefined || value === ""
      ? "No disponible"
      : value;

  return (
    <div className="perfil-field">
      <p className="perfil-label">{label}</p>

      <p className="perfil-value">{displayValue}</p>
    </div>
  );
}
