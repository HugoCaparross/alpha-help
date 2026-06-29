import { z } from "zod";

/* =========================
   PASO 1 · Cuenta
========================= */

export const accountSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Introduce un correo válido"),

    region: z
      .string()
      .min(
        1,
        "Selecciona tu región",
      ),

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

    acceptedPolicy: z
      .boolean()
      .refine(
        (value) => value === true,
        {
          message:
            "Debes aceptar la política de privacidad",
        },
      ),
  })
  .refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      message:
        "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    },
  );

/* =========================
   PASO 2 · Participante
========================= */

export const participantSchema = z.object({
  gender: z
    .string()
    .min(
      1,
      "Selecciona tu sexo",
    ),

  age: z.coerce
    .number()
    .min(
      18,
      "Debes tener al menos 18 años",
    )
    .max(
      99,
      "Edad no válida",
    ),

  educationLevel: z
    .string()
    .min(
      1,
      "Selecciona tu nivel de estudios",
    ),

  employmentStatus: z
    .string()
    .min(
      1,
      "Selecciona tu situación laboral",
    ),

  maritalStatus: z
    .string()
    .min(
      1,
      "Selecciona tu estado civil",
    ),
});

/* =========================
   PASO 3 · Hijos
========================= */

export const childSchema = z.object({
  children: z
    .array(
      z.object({
        age: z.coerce
          .number()
          .min(
            10,
            "La edad mínima es 10 años",
          )
          .max(
            17,
            "La edad máxima es 17 años",
          ),

        gender: z
          .string()
          .min(
            1,
            "Selecciona el sexo del menor",
          ),

        psychologicalSupport:
          z.boolean(),
      }),
    )
    .min(
      1,
      "Debes introducir al menos un hijo",
    ),
});

/* =========================
   PASO 4 · Familia
========================= */

export const familySchema = z.object({
  socioeconomicLevel: z
    .string()
    .min(
      1,
      "Selecciona el nivel socioeconómico familiar",
    ),

  schoolType: z
    .string()
    .min(
      1,
      "Selecciona el tipo de centro escolar",
    ),

  numberOfChildren: z.coerce
    .number()
    .min(
      1,
      "Debes indicar al menos un hijo",
    )
    .max(
      5,
      "El máximo permitido es 5 hijos",
    ),

  familyStructure: z
    .string()
    .min(
      1,
      "Selecciona la estructura familiar",
    ),
});