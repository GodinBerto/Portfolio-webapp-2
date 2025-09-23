import { CursorChatProps, CursorMode } from "@/types/builder";

export default function CursorChat({
  cursor,
  cursorState,
  setCursorState,
  updateMyPresence,
}: CursorChatProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const message = event.target.value;
    updateMyPresence({ message });
    setCursorState({
      mode: CursorMode.Chat as CursorMode.Chat,
      previousMessage: null,
      message: message,
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      if (cursorState.mode === CursorMode.Chat) {
        setCursorState({
          mode: CursorMode.Chat as CursorMode.Chat,
          previousMessage: cursorState.message,
          message: "",
        });
      }
    } else if (event.key === "Escape") {
      setCursorState({
        mode: CursorMode.Hidden as CursorMode.Hidden,
      });
      updateMyPresence({ message: undefined });
    }
  };
  return (
    <div
      className="absolute top-0 left-0"
      style={{
        transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
      }}
    >
      {cursorState.mode === CursorMode.Chat && (
        <>
          {/* <MousePointer2 /> */}

          <div
            className="absolute left-2 top-5 bg-blue-500 px-4 py-2 text-sm leading-relaxed text-white rounded-[20px]"
            onKeyUp={(e) => e.stopPropagation()}
          >
            {cursorState.previousMessage && (
              <div>{cursorState.previousMessage}</div>
            )}
            <input
              type="text"
              className="z-10 w-60 border-none bg-transparent text-white placeholder-blue-300 
             outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-none focus:shadow-none"
              autoFocus={true}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={
                cursorState.previousMessage ? "" : "Type a message..."
              }
              value={cursorState.message}
              maxLength={100}
            />
          </div>
        </>
      )}
    </div>
  );
}
