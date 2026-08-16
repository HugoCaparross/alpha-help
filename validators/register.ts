import { z } from "zod";

/* =========================
   CONSTANTES
========================= */

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/;

const MIN_PARENT_AGE = 18;
const MAX_PARENT_AGE = 99;

const MIN_CHILD_AGE = 10;
const MAX_CHILD_AGE = 16;

const MIN_CHILDREN = 1;
const MAX_CHILDREN = 5;

/* =========================
   ESQUEMAS BASE
========================= */

const requiredString = (message: string) => z.string().trim().min(1, message);

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
   PASO 1 · CUENTA
========================= */

export const accountSchema = z
  .object({
    email: z.string().trim().email("Introduce un correo válido"),

    region: z.enum(["spain", "latam"], {
      message: "Selecciona tu región",
    }),

    password: passwordSchema,

    confirmPassword: z.string(),

    acceptedPolicy: z.boolean().refine((value) => value === true, {
      message: "Debes aceptar la política de privacidad",
    }),

    acceptedInformedConsent: z.boolean().refine((value) => value === true, {
      message: "Debes aceptar el Registro Informado",
    }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

/* =========================
   PASO 2 · PARTICIPANTE
========================= */

export const participantSchema = z.object({
  gender: requiredString("Selecciona tu sexo"),

  age: z.coerce
    .number()
    .int("La edad debe ser un número entero")
    .min(MIN_PARENT_AGE, `Debes tener al menos ${MIN_PARENT_AGE} años`)
    .max(MAX_PARENT_AGE, "Edad no válida"),

  educationLevel: requiredString("Selecciona tu nivel de estudios"),

  employmentStatus: requiredString("Selecciona tu situación laboral"),

  maritalStatus: requiredString("Selecciona tu estado civil"),
});

/* =========================
   PASO 3 · FAMILIA
========================= */

export const familySchema = z.object({
  socioeconomicLevel: requiredString(
    "Selecciona el nivel socioeconómico familiar",
  ),

  schoolType: requiredString("Selecciona el tipo de centro escolar"),

  numberOfChildren: z.coerce
    .number()
    .int("El número de hijos debe ser entero")
    .min(MIN_CHILDREN, "Debes indicar al menos un hijo")
    .max(MAX_CHILDREN, `El máximo permitido es ${MAX_CHILDREN} hijos`),

  familyStructure: requiredString("Selecciona la estructura familiar"),
});

/* =========================
   PASO 4 · CENTRO ESCOLAR
========================= */

export const schoolSchema = z.object({
  schoolCenter: requiredString("Selecciona un centro escolar"),
});

/* =========================
   PASO 5 · HIJOS
========================= */

export const childSchema = z.object({
  children: z
    .array(
      z.object({
        age: z.coerce
          .number()
          .int("La edad del menor debe ser un número entero")
          .min(MIN_CHILD_AGE, `La edad mínima es ${MIN_CHILD_AGE} años`)
          .max(MAX_CHILD_AGE, `La edad máxima es ${MAX_CHILD_AGE} años`),

        gender: requiredString("Selecciona el sexo del menor"),

        psychologicalSupport: z.boolean(),
      }),
    )
    .min(MIN_CHILDREN, "Debes introducir al menos un hijo")
    .max(MAX_CHILDREN, `El máximo permitido es ${MAX_CHILDREN} hijos`),
});

/* =========================
   REGISTRO COMPLETO
========================= */

export const registerSchema = z
  .object({
    email: z.string().trim().email("Introduce un correo válido"),

    region: z.enum(["spain", "latam"], {
      message: "Selecciona tu región",
    }),

    password: passwordSchema,

    confirmPassword: z.string(),

    acceptedPolicy: z.boolean().refine((value) => value === true, {
      message: "Debes aceptar la política de privacidad",
    }),

    acceptedInformedConsent: z.boolean().refine((value) => value === true, {
      message: "Debes aceptar el Registro Informado",
    }),

    gender: requiredString("Selecciona tu sexo"),

    age: z.coerce
      .number()
      .int("La edad debe ser un número entero")
      .min(MIN_PARENT_AGE, `Debes tener al menos ${MIN_PARENT_AGE} años`)
      .max(MAX_PARENT_AGE, "Edad no válida"),

    educationLevel: requiredString("Selecciona tu nivel de estudios"),

    employmentStatus: requiredString("Selecciona tu situación laboral"),

    maritalStatus: requiredString("Selecciona tu estado civil"),

    socioeconomicLevel: requiredString(
      "Selecciona el nivel socioeconómico familiar",
    ),

    schoolType: requiredString("Selecciona el tipo de centro escolar"),

    numberOfChildren: z.coerce
      .number()
      .int("El número de hijos debe ser entero")
      .min(MIN_CHILDREN, "Debes indicar al menos un hijo")
      .max(MAX_CHILDREN, `El máximo permitido es ${MAX_CHILDREN} hijos`),

    familyStructure: requiredString("Selecciona la estructura familiar"),

    schoolCenter: requiredString("Selecciona un centro escolar"),

    children: z
      .array(
        z.object({
          age: z.coerce
            .number()
            .int("La edad del menor debe ser un número entero")
            .min(MIN_CHILD_AGE, `La edad mínima es ${MIN_CHILD_AGE} años`)
            .max(MAX_CHILD_AGE, `La edad máxima es ${MAX_CHILD_AGE} años`),

          gender: requiredString("Selecciona el sexo del menor"),

          psychologicalSupport: z.boolean(),
        }),
      )
      .min(MIN_CHILDREN, "Debes introducir al menos un hijo")
      .max(MAX_CHILDREN, `El máximo permitido es ${MAX_CHILDREN} hijos`),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  })
  .refine(
    ({ numberOfChildren, children }) =>
      Number(numberOfChildren) === children.length,
    {
      path: ["children"],
      message: "El número de hijos no coincide con los datos introducidos.",
    },
  );
