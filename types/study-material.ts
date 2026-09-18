export type MaterialType = "support" | "extended";

export type MaterialStatus = "available" | "locked";

export type MaterialLockReason = "release-date";

export interface StudyMaterial {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly pdfUrl: string;
  readonly thumbnailUrl: string;
  readonly materialOrder: number;
  readonly materialType: MaterialType;
  readonly releaseDateSpain: string | null;
  readonly releaseDateLatam: string | null;
}

export interface StudyMaterialWithStatus extends StudyMaterial {
  readonly releaseDate: string | null;
  readonly status: MaterialStatus;
  readonly lockReason: MaterialLockReason | null;
}
