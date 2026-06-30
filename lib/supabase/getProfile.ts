import { supabase } from "./client";

import type { UserProfile } from "@/types/user";

export async function getProfile(): Promise<UserProfile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      email,
      region,
      role,
      gender,
      age,
      school_center
    `)
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ?? null;
}