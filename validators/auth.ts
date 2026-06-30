import { z } from "zod";

/* =========================
   LOGIN
========================= */

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Introduce un correo electrónico válido"),

  password: z
    .string()
    .min(
      8,
      "La contraseña debe tener al menos 8 caracteres",
    ),
});

/* =========================
   RECUPERAR CONTRASEÑA
========================= */

export const recoverPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Introduce un correo electrónico válido"),
});

/* =========================
   RESTABLECER CONTRASEÑA
========================= */

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(
        8,
        "La contraseña debe tener al menos 8 caracteres",
      )
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
        "Debe incluir mayúsculas, minúsculas y números",
      ),

    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message:
        "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    },
  );