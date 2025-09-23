import { BaseUserMeta, User } from "@liveblocks/client";

type Presence = any; // Replace 'any' with the actual shape if known

export type LiveCursorsProps = {
  others: readonly User<Presence, BaseUserMeta>[];
};

// type CursorMode = {
//   Hidden;
//   Chat;
//   ReactionSelector;
//   Reaction;
// };

// Define CursorMode enum if not imported from elsewhere
export enum CursorMode {
  Hidden = "Hidden",
  Chat = "Chat",
  ReactionSelector = "ReactionSelector",
  Reaction = "Reaction",
  // Add other modes if needed
}

export type CursorState =
  | {
      mode: CursorMode.Hidden;
    }
  | {
      mode: CursorMode.Chat;
      message: string;
      previousMessage: string | null;
    }
  | {
      mode: CursorMode.ReactionSelector;
    }
  | {
      mode: CursorMode.Reaction;
      reaction: string;
      isPressed: boolean;
    };

export type CursorChatProps = {
  cursor: any;
  cursorState: any;
  setCursorState: (state: any) => void;
  updateMyPresence: (presence: any) => void;
};

export type Reaction = {
  value: string;
  timestamp: number;
  point: { x: number; y: number };
};

export type ReactionEvent = {
  x: number;
  y: number;
  value: string;
};
