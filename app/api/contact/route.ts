import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/admin";

const MESSAGES = {
  invalidContentType:
    "La petición debe enviarse en formato JSON.",

  requiredFields:
    "Todos los campos son obligatorios.",

  invalidEmail:
    "El correo electrónico no es válido.",

  saveError:
    "No se ha podido guardar el mensaje.",

  internalError:
    "Error interno del servidor.",
} as const;

interface ContactRequest {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const contentType =
      request.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        {
          error: MESSAGES.invalidContentType,
        },
        {
          status: 415,
        },
      );
    }

    const body: ContactRequest =
      await request.json();

    const name = body.name?.trim();
    const email = body.email?.trim();
    const category = body.category?.trim();
    const subject = body.subject?.trim();
    const message = body.message?.trim();

    if (
      !name ||
      !email ||
      !category ||
      !subject ||
      !message
    ) {
      return NextResponse.json(
        {
          error: MESSAGES.requiredFields,
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          error: MESSAGES.invalidEmail,
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      createServerClient();

    const { error } =
      await supabase
        .from("contact_messages")
        .insert({
          name,
          email,
          category,
          subject,
          message,
        });

    if (error) {
      if (
        process.env.NODE_ENV ===
        "development"
      ) {
        console.error(error);
      }

      return NextResponse.json(
        {
          error: MESSAGES.saveError,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    if (
      process.env.NODE_ENV ===
      "development"
    ) {
      console.error(error);
    }

    return NextResponse.json(
      {
        error: MESSAGES.internalError,
      },
      {
        status: 500,
      },
    );
  }
}