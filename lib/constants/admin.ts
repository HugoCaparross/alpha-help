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
 * NOTA DE SEGURIDAD: el correo real
 * de la cuenta de administración y la
 * función que lo resuelve viven ahora
 * exclusivamente en
 * "@/lib/auth/adminEmail.server" (un
 * módulo marcado "server-only"). Antes
 * estaban aquí bajo la variable
 * NEXT_PUBLIC_ADMIN_EMAIL, lo que hacía
 * que Next.js incrustara el correo real
 * del administrador en el bundle de
 * cliente — visible para cualquiera que
 * abriera las herramientas de
 * desarrollador del navegador. No
 * vuelvas a añadir ese dato aquí.
 */

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