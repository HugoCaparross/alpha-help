import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";
import { registerSchema } from "@/validators/register";

const ERRORS = {
  invalidBody: "Los datos enviados no son válidos.",

  rateLimit:
    "Se han realizado demasiadas solicitudes recientemente. Inténtalo de nuevo dentro de unos minutos.",

  alreadyRegistered:
    "Ya existe una cuenta registrada con este correo electrónico.",

  unexpected: "Se ha producido un error inesperado. Inténtalo de nuevo.",
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error.issues[0]?.message ?? ERRORS.invalidBody,
        },
        {
          status: 400,
        },
      );
    }

    const data = result.data;

    const supabase = await createServerClient();

    const origin = request.headers.get("origin") ?? new URL(request.url).origin;

    const { error } = await supabase.auth.signUp({
      email: data.email.trim().toLowerCase(),

      password: data.password,

      options: {
        emailRedirectTo: `${origin}/verify-email`,

        data: {
          region: data.region,

          gender: data.gender,

          age: String(data.age),

          education_level: data.educationLevel,

          employment_status: data.employmentStatus,

          marital_status: data.maritalStatus,

          socioeconomic_level: data.socioeconomicLevel,

          school_type: data.schoolType,

          number_of_children: String(data.numberOfChildren),

          family_structure: data.familyStructure,

          school_center: data.schoolCenter,

          children: data.children,

          accepted_policy: data.acceptedPolicy,

          accepted_informed_consent: data.acceptedInformedConsent,
        },
      },
    });

    if (error) {
      const message = error.message.toLowerCase();

      if (message.includes("rate") || message.includes("too many")) {
        return NextResponse.json(
          {
            ok: false,
            error: ERRORS.rateLimit,
          },
          {
            status: 429,
          },
        );
      }

      if (
        message.includes("already registered") ||
        message.includes("already exists")
      ) {
        return NextResponse.json(
          {
            ok: false,
            error: ERRORS.alreadyRegistered,
          },
          {
            status: 409,
          },
        );
      }

      if (process.env.NODE_ENV === "development") {
        console.error("Supabase registration error:", error);
      }

      return NextResponse.json(
        {
          ok: false,
          error: ERRORS.unexpected,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        ok: true,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Registration error:", error);
    }

    return NextResponse.json(
      {
        ok: false,
        error: ERRORS.unexpected,
      },
      {
        status: 500,
      },
    );
  }
}
