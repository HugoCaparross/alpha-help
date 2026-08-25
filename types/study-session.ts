import type { YoutubeBroadcastStatus } from "@/lib/utils/youtube";

export type SessionStatus = "available" | "locked";

export interface Session {
  readonly id: string;

  readonly title: string;

  readonly description: string;

  readonly youtubeUrl: string;

  readonly thumbnailUrl: string;

  readonly sessionOrder: number;

  readonly releaseDateSpain: string;

  readonly releaseDateLatam: string;

  readonly isLive: boolean;

  readonly youtubeStatus: YoutubeBroadcastStatus | null;

  readonly youtubeCheckedAt: string | null;
}

export interface SessionWithStatus extends Session {
  readonly releaseDate: string;

  readonly status: SessionStatus;
}
