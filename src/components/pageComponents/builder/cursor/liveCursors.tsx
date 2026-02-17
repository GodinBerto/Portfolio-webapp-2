import { LiveCursorsProps } from "@/types/builder";
import Cursor from "./cursor";

export default function LiveCursor({ others }: LiveCursorsProps) {
  return others.map(({ connectionId, presence }) => {
    if (!presence?.cursor) return null;
    return (
      <Cursor
        key={connectionId}
        colors="black"
        x={presence.cursor.x}
        y={presence.cursor.y}
        message={presence.message ?? undefined}
      />
    );
  });
}
