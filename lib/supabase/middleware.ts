import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ERROR_MISSING_ENV = (variable: string) =>
  `Falta la variable de entorno ${variable}.`;

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(ERROR_MISSING_ENV(name));
  }

  return value;
}

const SUPABASE_URL = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");

const SUPABASE_ANON_KEY = getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

export function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },

      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);

          response.cookies.set(name, value, options);
        });
      },
    },
  });

  return {
    supabase,
    response,
  };
}
