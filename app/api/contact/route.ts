import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      category,
      subject,
      message,
    } = body;

    if (
      !name ||
      !email ||
      !category ||
      !subject ||
      !message
    ) {
      return NextResponse.json(
        {
          error: "Todos los campos son obligatorios.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase = createServerClient();

    const { error } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email,
        category,
        subject,
        message,
      });

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error:
            "No se ha podido guardar el mensaje.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Error interno del servidor.",
      },
      {
        status: 500,
      }
    );
  }
}