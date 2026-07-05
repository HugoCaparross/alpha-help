import { z } from "zod";

/* =========================
   CONSTANTES
========================= */

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/;

const MIN_PARENT_AGE = 18;
const MAX_PARENT_AGE = 99;

const MIN_CHILD_AGE = 10;
const MAX_CHILD_AGE = 17;

const MIN_CHILDREN = 1;
const MAX_CHILDREN = 5;

/* =========================
   ESQUEMAS BASE
========================= */

const requiredString = (message: string) =>
  z.string().trim().min(1, message);

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
   PASO 1 · Cuenta
========================= */

export const accountSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Introduce un correo válido"),

    region: z.enum(["spain", "latam"], {
      message: "Selecciona tu región",
    }),

    password: passwordSchema,

    confirmPassword: z.string(),

    acceptedPolicy: z
      .boolean()
      .refine((value) => value === true, {
        message:
          "Debes aceptar la política de privacidad",
      }),
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

/* =========================
   PASO 2 · Participante
========================= */

export const participantSchema =
  z.object({
    gender: requiredString(
      "Selecciona tu sexo",
    ),

    age: z.coerce
      .number()
      .min(
        MIN_PARENT_AGE,
        `Debes tener al menos ${MIN_PARENT_AGE} años`,
      )
      .max(
        MAX_PARENT_AGE,
        "Edad no válida",
      ),

    educationLevel:
      requiredString(
        "Selecciona tu nivel de estudios",
      ),

    employmentStatus:
      requiredString(
        "Selecciona tu situación laboral",
      ),

    maritalStatus:
      requiredString(
        "Selecciona tu estado civil",
      ),
  });

/* =========================
   PASO 3 · Familia
========================= */

export const familySchema =
  z.object({
    socioeconomicLevel:
      requiredString(
        "Selecciona el nivel socioeconómico familiar",
      ),

    schoolType:
      requiredString(
        "Selecciona el tipo de centro escolar",
      ),

    numberOfChildren:
      z.coerce
        .number()
        .min(
          MIN_CHILDREN,
          "Debes indicar al menos un hijo",
        )
        .max(
          MAX_CHILDREN,
          `El máximo permitido es ${MAX_CHILDREN} hijos`,
        ),

    familyStructure:
      requiredString(
        "Selecciona la estructura familiar",
      ),
  });

/* =========================
   PASO 4 · Centro escolar
========================= */

export const schoolSchema =
  z.object({
    schoolCenter:
      requiredString(
        "Selecciona un centro escolar",
      ),
  });

/* =========================
   PASO 5 · Hijos
========================= */

export const childSchema =
  z.object({
    children: z
      .array(
        z.object({
          age: z.coerce
            .number()
            .min(
              MIN_CHILD_AGE,
              `La edad mínima es ${MIN_CHILD_AGE} años`,
            )
            .max(
              MAX_CHILD_AGE,
              `La edad máxima es ${MAX_CHILD_AGE} años`,
            ),

          gender:
            requiredString(
              "Selecciona el sexo del menor",
            ),

          psychologicalSupport:
            z.boolean(),
        }),
      )
      .min(
        MIN_CHILDREN,
        "Debes introducir al menos un hijo",
      )
      .max(MAX_CHILDREN),
  });