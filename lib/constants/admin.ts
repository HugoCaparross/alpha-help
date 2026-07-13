/**
 * Usuario especial reservado
 * para el acceso al panel
 * de administración.
 *
 * En el formulario de login,
 * el administrador escribe este
 * nombre de usuario en lugar de
 * un correo electrónico.
 */
export const ADMIN_USERNAME = "admin";

/**
 * Correo electrónico real
 * utilizado internamente por
 * Supabase Auth para la cuenta
 * de administración.
 *
 * Puede configurarse mediante
 * la variable de entorno
 * NEXT_PUBLIC_ADMIN_EMAIL. Si no
 * se define, se utiliza un valor
 * por defecto.
 */
export const ADMIN_LOGIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim() ||
  "admin@alpha-help.internal";

/**
 * Resuelve el correo electrónico
 * real que debe utilizarse para
 * autenticar contra Supabase a
 * partir de lo introducido por
 * el usuario en el formulario
 * de login.
 *
 * Si el usuario escribe "admin"
 * (con independencia de mayúsculas
 * o espacios), se sustituye por el
 * correo interno de administración.
 */
export function resolveLoginEmail(
  input: string,
): string {
  const normalized = input.trim().toLowerCase();

  if (normalized === ADMIN_USERNAME) {
    return ADMIN_LOGIN_EMAIL;
  }

  return normalized;
}

/**
 * Comprueba si lo introducido
 * por el usuario corresponde
 * al usuario administrador.
 */
export function isAdminLoginInput(
  input: string,
): boolean {
  return input.trim().toLowerCase() === ADMIN_USERNAME;
}