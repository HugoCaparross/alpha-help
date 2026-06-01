export const REGIONS = [
  "España",
  "Latinoamérica",
] as const;

export type Region = (typeof REGIONS)[number];