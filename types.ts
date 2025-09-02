// types.ts (The Final, Definitive Version)

export enum MessageAuthor {
  Operator = 'Operator',
  RescueAI = 'RescueAI',
}

export interface Message {
  author: MessageAuthor;
  text: string;
}

// This is our new, professional type for a single detection event.
export interface DetectionEvent {
  timestamp: number;
  box: number[];
  confidence: number;
}