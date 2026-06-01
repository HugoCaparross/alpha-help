import { z } from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  region: z.enum(["España", "Latinoamérica"]),
  acceptedPolicy: z.literal(true),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});