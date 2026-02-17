import { BaseUserMeta, User } from "@liveblocks/client";
import * as fabric from "fabric";
import { ReactNode } from "react";

type Presence = {
  cursor?: {
    x: number;
    y: number;
  } | null;
  message?: string | null;
};

export type LiveCursorsProps = {
  others: readonly User<Presence, BaseUserMeta>[];
};

export enum CursorMode {
  Hidden = "Hidden",
  Chat = "Chat",
  ReactionSelector = "ReactionSelector",
  Reaction = "Reaction",
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
  cursor: {
    x: number;
    y: number;
  };
  cursorState: CursorState;
  setCursorState: React.Dispatch<React.SetStateAction<CursorState>>;
  updateMyPresence: (presence: Partial<Presence>) => void;
};

export type Reaction = {
  value: string;
  timestamp: number;
  point: {
    x: number;
    y: number;
  };
};

export type ReactionEvent = {
  type: "reaction";
  x: number;
  y: number;
  value: string;
};

export type ShapeData = {
  type: string;
  width: number;
  height: number;
  fill: string | fabric.Pattern | unknown;
  left: number;
  top: number;
  objectId: string | undefined;
};

export type Attributes = {
  width: string;
  height: string;
  fill?: string;
  stroke?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
};

export type ActiveElement = {
  name: string;
  value: string;
  icon: string;
} | null;

export interface CustomFabricObject<T extends fabric.Object>
  extends fabric.Object {
  objectId?: string;
}

export type ModifyShape = {
  canvas: fabric.Canvas;
  property: string;
  value: unknown;
  activeObjectRef: React.MutableRefObject<fabric.Object | null>;
  syncShapeInStorage: (shape: fabric.Object) => void;
};

export type ElementDirection = {
  canvas: fabric.Canvas;
  direction: string;
  syncShapeInStorage: (shape: fabric.Object) => void;
};

export type ImageUpload = {
  file: File;
  canvas: React.MutableRefObject<fabric.Canvas>;
  shapeRef: React.MutableRefObject<fabric.Object | null>;
  syncShapeInStorage: (shape: fabric.Object) => void;
};

export type RightSidebarProps = {
  elementAttributes: Attributes;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
  fabricRef: React.RefObject<fabric.Canvas | null>;
  activeObjectRef: React.RefObject<fabric.Object | null>;
  isEditingRef: React.MutableRefObject<boolean>;
  syncShapeInStorage: (obj: unknown) => void;
};

export type NavbarProps = {
  activeElement: ActiveElement;
  imageInputRef: File | null;
};

export type ShapesMenuProps = {
  item?: {
    name: string;
    icon: string;
    value: Array<ActiveElement>;
  };
};

export type CanvasMouseDown = {
  options: fabric.TEvent;
  canvas: fabric.Canvas;
  selectedShapeRef: string;
  isDrawing: React.MutableRefObject<boolean>;
  shapeRef: React.MutableRefObject<fabric.Object | null>;
};

export type CanvasMouseMove = {
  options: fabric.TEvent;
  canvas: fabric.Canvas;
  isDrawing: React.MutableRefObject<boolean>;
  selectedShapeRef: string;
  shapeRef: React.MutableRefObject<fabric.Object | null>;
  syncShapeInStorage: (shape: fabric.Object) => void;
};

export type CanvasMouseUp = {
  canvas: fabric.Canvas;
  isDrawing: React.MutableRefObject<boolean>;
  shapeRef: React.MutableRefObject<fabric.Object | null>;
  activeObjectRef: React.MutableRefObject<fabric.Object | null>;
  selectedShapeRef: string | null;
  syncShapeInStorage: (shape: fabric.Object) => void;
  setActiveElement: (element: ActiveElement) => void;
};

export type CanvasObjectModified = {
  options: fabric.TEvent<MouseEvent> & {
    target: fabric.Object;
  };
  syncShapeInStorage: (shape: fabric.Object) => void;
};

export type CanvasPathCreated = {
  options: fabric.TEvent & {
    path?: CustomFabricObject<fabric.Path>;
  };
  syncShapeInStorage: (shape: fabric.Object) => void;
};

export type CanvasSelectionCreated = {
  options: fabric.TEvent<MouseEvent> & {
    selected?: fabric.Object[];
  };
  isEditingRef: React.MutableRefObject<boolean>;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};

export type CanvasObjectScaling = {
  options: fabric.TEvent<MouseEvent> & {
    target: fabric.Object;
  };
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};

export type RenderCanvas = {
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
  canvasObjects: Map<string, unknown>;
  activeObjectRef: React.MutableRefObject<fabric.Object | null>;
};

export type DropdownItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  route?: string;
  children?: DropdownItemPropsChildren[];
};

export type DropdownItemPropsChildren = {
  icon: React.ReactNode;
  label: string;
  route?: string;
  onClick?: () => void;
  children?: DropdownItemPropsChildren[];
};

export interface ToolbarButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  children?: ReactNode;
  active?: boolean;
  disabled?: boolean;
}
