import { supabase } from "./client";

export async function getUser() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch {
    return null;
  }
}