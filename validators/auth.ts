import { z } from "zod";

/* =========================
   CONSTANTES
========================= */

const PASSWORD_MIN_LENGTH = 8;

const PASSWORD_MAX_LENGTH = 128;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/;

/* =========================
   ESQUEMA BASE CONTRASEÑA
========================= */

const passwordSchema = z
  .string()
  .min(
    PASSWORD_MIN_LENGTH,
    `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`,
  )
  .max(
    PASSWORD_MAX_LENGTH,
    `La contraseña no puede superar los ${PASSWORD_MAX_LENGTH} caracteres`,
  )
  .regex(
    PASSWORD_REGEX,
    "Debe incluir al menos una letra mayúscula, una minúscula y un número",
  );

/* =========================
   LOGIN
========================= */

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email(
      "Introduce un correo electrónico válido",
    ),

  password: z
    .string()
    .min(
      PASSWORD_MIN_LENGTH,
      `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`,
    )
    .max(
      PASSWORD_MAX_LENGTH,
      `La contraseña no puede superar los ${PASSWORD_MAX_LENGTH} caracteres`,
    ),
});

/* =========================
   RECUPERAR CONTRASEÑA
========================= */

export const recoverPasswordSchema =
  z.object({
    email: z
      .string()
      .trim()
      .email(
        "Introduce un correo electrónico válido",
      ),
  });

/* =========================
   RESTABLECER CONTRASEÑA
========================= */

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,

    confirmPassword: z.string(),
  })
  .refine(
    ({ password, confirmPassword }) =>
      password === confirmPassword,
    {
      path: ["confirmPassword"],
      message:
        "Las contraseñas no coinciden",
    },
  );