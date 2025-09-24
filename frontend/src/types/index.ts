export interface VoiceNote {
  _id: string;
  title: string;
  audioFilePath: string;
  transcript: string;
  summary: string;
  hasSummary: boolean;
  isTranscriptEdited: boolean;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  message: string;
  voiceNote?: T;
}