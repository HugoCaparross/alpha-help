export type SessionStatus = "upcoming" | "live" | "ended";

export interface Session {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly zoomUrl: string;
  readonly zoomRecordingUrl: string | null;
  readonly thumbnailUrl: string;
  readonly sessionOrder: number;
  readonly releaseDateSpain: string;
  readonly releaseDateLatam: string;
  readonly liveEndedAt: string | null;
}

export interface SessionWithStatus extends Session {
  readonly releaseDate: string;
  readonly status: SessionStatus;
  readonly canJoinLive: boolean;
  readonly canWatchRecording: boolean;
}
