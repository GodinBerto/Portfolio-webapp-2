"use client";
import {
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
  useOthers,
} from "@liveblocks/react";
import LiveCursor from "./cursor/liveCursors";
import { useCallback, useEffect, useState } from "react";
import CursorChat from "./cursor/cursorChat";
import {
  CursorMode,
  CursorState,
  Reaction,
  ReactionEvent,
} from "@/types/builder";
import ReactionSelector from "./reaction/reactionButton";
import FlyingReaction from "./reaction/flyingReaction";
import useInterval from "@/hooks/useInterval";
import Canvas from "./canvas";
import { getBuilderRuntime } from "@/lib/builder/runtime";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
};

type ContextMenuState = {
  x: number;
  y: number;
} | null;

export default function Live({ canvasRef }: Props) {
  const others = useOthers();
  const runtime = getBuilderRuntime();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });
  const [reaction, setReaction] = useState<Reaction[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  const activeObject = useSelector((state: RootState) => state.canvas.activeObject);
  const canUndo = useSelector((state: RootState) => state.canvas.canUndo);
  const canRedo = useSelector((state: RootState) => state.canvas.canRedo);

  const broadcast = useBroadcastEvent();

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleContextAction = useCallback(
    (action: () => void) => {
      action();
      closeContextMenu();
    },
    [closeContextMenu]
  );

  useInterval(() => {
    setReaction((reactions) =>
      reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000)
    );
  }, 1000);

  useInterval(() => {
    if (
      cursorState.mode === CursorMode.Reaction &&
      cursorState.isPressed &&
      cursor
    ) {
      setReaction((reactions) =>
        reactions.concat([
          {
            value: cursorState.reaction,
            timestamp: Date.now(),
            point: { x: cursor.x, y: cursor.y },
          },
        ])
      );
      broadcast({
        type: "reaction",
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
    }
  }, 100);

  useEventListener((eventData) => {
    const event = eventData.event as Partial<ReactionEvent>;
    if (event.type !== "reaction") return;
    if (typeof event.x !== "number" || typeof event.y !== "number") return;
    if (typeof event.value !== "string") return;
    const x = event.x;
    const y = event.y;
    const value = event.value;

    setReaction((reactions) => {
      return reactions.concat([
        {
          point: { x, y },
          value,
          timestamp: Date.now(),
        },
      ]);
    });
  });

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault();

      if (cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
        updateMyPresence({ cursor: { x, y } });
      }
    },
    [cursor, cursorState.mode, updateMyPresence]
  );

  const handlePointerLeave = useCallback(
    (event: React.PointerEvent) => {
      setCursorState({ mode: CursorMode.Hidden });

      updateMyPresence({ cursor: null, message: null });
    },
    [updateMyPresence]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (contextMenu) {
        closeContextMenu();
      }

      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
      updateMyPresence({ cursor: { x, y } });

      setCursorState((state: CursorState) => {
        return cursorState.mode === CursorMode.Reaction
          ? {
              ...state,
              isPressed: true,
            }
          : state;
      });
    },
    [closeContextMenu, contextMenu, cursorState.mode, setCursorState, updateMyPresence]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent) => {
      setCursorState((state: CursorState) => {
        return cursorState.mode === CursorMode.Reaction
          ? {
              ...state,
              isPressed: false,
            }
          : state;
      });
    },
    [cursorState.mode, setCursorState]
  );

  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (event.key === "Escape") {
        setCursorState({ mode: CursorMode.Hidden });
        updateMyPresence({ message: "" });
      } else if (event.key === "e") {
        setCursorState({ mode: CursorMode.ReactionSelector });
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/") {
        event.preventDefault();
      }
    };
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);

  const setReactions = useCallback((reaction: string) => {
    setCursorState({
      mode: CursorMode.Reaction,
      reaction,
      isPressed: false,
    });
  }, []);

  const handleContextMenu = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    const rect = event.currentTarget.getBoundingClientRect();
    const rawX = event.clientX - rect.left;
    const rawY = event.clientY - rect.top;
    const menuWidth = 224;
    const menuHeight = 252;

    setContextMenu({
      x: Math.max(8, Math.min(rawX, rect.width - menuWidth - 8)),
      y: Math.max(8, Math.min(rawY, rect.height - menuHeight - 8)),
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeContextMenu();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeContextMenu]);

  return (
    <div
      id="canvas-container"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onContextMenu={handleContextMenu}
      className="h-full w-full bg-white dark:bg-semiblack relative"
    >
      <Canvas canvasRef={canvasRef} />

      {reaction.map((reaction, index) => (
        <FlyingReaction
          key={`${reaction.timestamp}-${index}`}
          x={reaction.point.x}
          y={reaction.point.y}
          timestamp={reaction.timestamp}
          value={reaction.value}
        />
      ))}

      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}

      {cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector setReaction={setReactions} />
      )}

      {contextMenu && (
        <div className="absolute inset-0 z-50" onMouseDown={closeContextMenu}>
          <div
            className="absolute w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-[#161616]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Canvas Menu
            </p>

            <button
              type="button"
              onClick={() => handleContextAction(runtime.undo)}
              disabled={!canUndo}
              className="mb-1 w-full rounded-md px-2 py-1.5 text-left text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={() => handleContextAction(runtime.redo)}
              disabled={!canRedo}
              className="mb-1 w-full rounded-md px-2 py-1.5 text-left text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Redo
            </button>
            <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
            <button
              type="button"
              onClick={() => handleContextAction(runtime.bringToFront)}
              disabled={!activeObject}
              className="mb-1 w-full rounded-md px-2 py-1.5 text-left text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Bring To Front
            </button>
            <button
              type="button"
              onClick={() => handleContextAction(runtime.sendToBack)}
              disabled={!activeObject}
              className="mb-1 w-full rounded-md px-2 py-1.5 text-left text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Send To Back
            </button>
            <button
              type="button"
              onClick={() => handleContextAction(() => void runtime.duplicateSelected())}
              disabled={!activeObject}
              className="mb-1 w-full rounded-md px-2 py-1.5 text-left text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Duplicate
            </button>
            <button
              type="button"
              onClick={() => handleContextAction(runtime.deleteSelected)}
              disabled={!activeObject}
              className="w-full rounded-md px-2 py-1.5 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <LiveCursor others={others} />
    </div>
  );
}
