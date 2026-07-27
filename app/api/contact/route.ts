import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/admin";
import { getClientIp, isAllowedByRateLimit } from "@/lib/utils/rateLimit";

const MESSAGES = {
  invalidContentType:
    "La petición debe enviarse en formato JSON.",

  requiredFields:
    "Todos los campos son obligatorios.",

  invalidEmail:
    "El correo electrónico no es válido.",

  invalidCategory:
    "La categoría seleccionada no es válida.",

  invalidName:
    "El nombre no es válido.",

  invalidSubject:
    "El asunto no es válido.",

  invalidMessage:
    "El mensaje no es válido.",

  rateLimited:
    "Se han enviado demasiadas solicitudes. Inténtalo de nuevo en unos minutos.",

  saveError:
    "No se ha podido guardar el mensaje.",

  internalError:
    "Error interno del servidor.",
} as const;

const VALID_CATEGORIES = [
  "Consulta general",
  "Participación",
  "Privacidad",
  "Soporte",
] as const;

const MAX_MESSAGE_LENGTH = 1000;

/**
 * Máximo de envíos permitidos por IP
 * dentro de la ventana de tiempo
 * definida abajo.
 */
const RATE_LIMIT_MAX_REQUESTS = 5;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

interface ContactRequest {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;

  /**
   * Campo trampa ("honeypot"): no se
   * muestra a personas reales en el
   * formulario (se oculta por CSS),
   * así que solo un bot que rellene
   * todos los inputs del DOM lo
   * completará. Si llega con contenido,
   * se descarta la petición en
   * silencio, como si se hubiera
   * guardado correctamente, para no
   * darle pistas al bot.
   */
  website?: string;
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

    const clientIp = getClientIp(request);

    if (
      !isAllowedByRateLimit(
        `contact:${clientIp}`,
        RATE_LIMIT_MAX_REQUESTS,
        RATE_LIMIT_WINDOW_MS,
      )
    ) {
      return NextResponse.json(
        {
          error: MESSAGES.rateLimited,
        },
        {
          status: 429,
        },
      );
    }

    const body: ContactRequest =
      await request.json();

    if (body.website) {
      return NextResponse.json(
        {
          success: true,
        },
        {
          status: 201,
        },
      );
    }

    const name =
      body.name?.trim();

    const email =
      body.email
        ?.trim()
        .toLowerCase();

    const category =
      body.category?.trim();

    const subject =
      body.subject?.trim();

    const message =
      body.message?.trim();

    if (
      !name ||
      !email ||
      !category ||
      !subject ||
      !message
    ) {
      return NextResponse.json(
        {
          error:
            MESSAGES.requiredFields,
        },
        {
          status: 400,
        },
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          error:
            MESSAGES.invalidName,
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          error:
            MESSAGES.invalidEmail,
        },
        {
          status: 400,
        },
      );
    }

    if (
      !VALID_CATEGORIES.includes(
        category as (typeof VALID_CATEGORIES)[number],
      )
    ) {
      return NextResponse.json(
        {
          error:
            MESSAGES.invalidCategory,
        },
        {
          status: 400,
        },
      );
    }

    if (subject.length < 5) {
      return NextResponse.json(
        {
          error:
            MESSAGES.invalidSubject,
        },
        {
          status: 400,
        },
      );
    }

    if (
      message.length < 20 ||
      message.length >
        MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json(
        {
          error:
            MESSAGES.invalidMessage,
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
          error:
            MESSAGES.saveError,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (
      process.env.NODE_ENV ===
      "development"
    ) {
      console.error(error);
    }

    return NextResponse.json(
      {
        error:
          MESSAGES.internalError,
      },
      {
        status: 500,
      },
    );
  }
}