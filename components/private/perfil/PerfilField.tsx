interface PerfilFieldProps {
  label: string;
  value: string | number | null | undefined;
}

export default function PerfilField({
  label,
  value,
}: PerfilFieldProps) {
  return (
    <div className="perfil-field">
      <span className="perfil-label">
        {label}
      </span>

      <span className="perfil-value">
        {value ?? "No disponible"}
      </span>
    </div>
  );
}