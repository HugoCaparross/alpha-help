import { supabase } from "./client";

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}