"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getBuilderRuntime } from "@/lib/builder/runtime";

const asNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toHex = (value: number) => value.toString(16).padStart(2, "0");

const normalizeColorToHex = (value: string | undefined, fallback: string) => {
  if (!value) return fallback;
  const normalized = value.trim();

  if (/^#[0-9a-f]{6}$/i.test(normalized)) {
    return normalized.toLowerCase();
  }

  if (/^#[0-9a-f]{3}$/i.test(normalized)) {
    const r = normalized[1];
    const g = normalized[2];
    const b = normalized[3];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  const rgbMatch = normalized.match(/^rgba?\((.+)\)$/i);
  if (!rgbMatch) return fallback;

  const channels = rgbMatch[1]
    .split(",")
    .slice(0, 3)
    .map((channel) => Number(channel.trim()));

  if (channels.length !== 3 || channels.some((channel) => !Number.isFinite(channel))) {
    return fallback;
  }

  const [r, g, b] = channels.map((channel) =>
    Math.max(0, Math.min(255, Math.round(channel)))
  );

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export default function BuilderRightSidebar() {
  const runtime = getBuilderRuntime();
  const activeObject = useSelector((state: RootState) => state.canvas.activeObject);
  const canUndo = useSelector((state: RootState) => state.canvas.canUndo);
  const canRedo = useSelector((state: RootState) => state.canvas.canRedo);
  const [fillDraft, setFillDraft] = useState("#2563eb");
  const [strokeDraft, setStrokeDraft] = useState("#2563eb");

  useEffect(() => {
    setFillDraft(normalizeColorToHex(activeObject?.fill, "#2563eb"));
    setStrokeDraft(normalizeColorToHex(activeObject?.stroke, "#2563eb"));
  }, [activeObject?.id, activeObject?.fill, activeObject?.stroke]);

  const objectType = useMemo(() => {
    if (!activeObject?.type) return "";
    return activeObject.type
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }, [activeObject?.type]);

  return (
    <aside className="h-full w-full overflow-y-auto border-l border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-semiblack">
      <h2 className="mb-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
        Properties
      </h2>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={runtime.undo}
          disabled={!canUndo}
          className="rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={runtime.redo}
          disabled={!canRedo}
          className="rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Redo
        </button>
      </div>

      {!activeObject && (
        <p className="rounded-md border border-dashed border-gray-300 px-3 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
          Select an element on the canvas to view and edit its properties.
        </p>
      )}

      {activeObject && (
        <div className="space-y-4">
          <div className="rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-[#101010]">
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Type</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{objectType}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <LabeledField label="X">
              <input
                type="number"
                value={Math.round(activeObject.left)}
                onChange={(event) => {
                  const value = asNumber(event.target.value);
                  if (value == null) return;
                  runtime.updateActiveObject({ left: value });
                }}
                className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-[#0f0f0f] dark:text-gray-100"
              />
            </LabeledField>
            <LabeledField label="Y">
              <input
                type="number"
                value={Math.round(activeObject.top)}
                onChange={(event) => {
                  const value = asNumber(event.target.value);
                  if (value == null) return;
                  runtime.updateActiveObject({ top: value });
                }}
                className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-[#0f0f0f] dark:text-gray-100"
              />
            </LabeledField>
            <LabeledField label="Width">
              <input
                type="number"
                min={1}
                value={Math.round(activeObject.width)}
                onChange={(event) => {
                  const value = asNumber(event.target.value);
                  if (value == null || value <= 0) return;
                  runtime.updateActiveObject({ width: value });
                }}
                className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-[#0f0f0f] dark:text-gray-100"
              />
            </LabeledField>
            <LabeledField label="Height">
              <input
                type="number"
                min={1}
                value={Math.round(activeObject.height)}
                onChange={(event) => {
                  const value = asNumber(event.target.value);
                  if (value == null || value <= 0) return;
                  runtime.updateActiveObject({ height: value });
                }}
                className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-[#0f0f0f] dark:text-gray-100"
              />
            </LabeledField>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <LabeledField label="Fill">
              <input
                type="color"
                value={fillDraft}
                onInput={(event) => {
                  const nextColor = event.currentTarget.value;
                  setFillDraft(nextColor);
                  runtime.updateActiveObject(
                    { fill: nextColor },
                    { commitHistory: false, syncStore: false }
                  );
                }}
                onChange={(event) => {
                  const nextColor = event.target.value;
                  setFillDraft(nextColor);
                  runtime.updateActiveObject(
                    { fill: nextColor },
                    { commitHistory: true, syncStore: true }
                  );
                }}
                className="h-9 w-full cursor-pointer rounded-md border border-gray-300 bg-white p-1 dark:border-gray-600 dark:bg-[#0f0f0f]"
              />
            </LabeledField>
            <LabeledField label="Stroke">
              <input
                type="color"
                value={strokeDraft}
                onInput={(event) => {
                  const nextColor = event.currentTarget.value;
                  setStrokeDraft(nextColor);
                  runtime.updateActiveObject(
                    { stroke: nextColor },
                    { commitHistory: false, syncStore: false }
                  );
                }}
                onChange={(event) => {
                  const nextColor = event.target.value;
                  setStrokeDraft(nextColor);
                  runtime.updateActiveObject(
                    { stroke: nextColor },
                    { commitHistory: true, syncStore: true }
                  );
                }}
                className="h-9 w-full cursor-pointer rounded-md border border-gray-300 bg-white p-1 dark:border-gray-600 dark:bg-[#0f0f0f]"
              />
            </LabeledField>
            <LabeledField label="Stroke Width">
              <input
                type="number"
                min={0}
                value={activeObject.strokeWidth}
                onChange={(event) => {
                  const value = asNumber(event.target.value);
                  if (value == null || value < 0) return;
                  runtime.updateActiveObject({ strokeWidth: value });
                }}
                className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-[#0f0f0f] dark:text-gray-100"
              />
            </LabeledField>
            <LabeledField label="Angle">
              <input
                type="number"
                value={Math.round(activeObject.angle)}
                onChange={(event) => {
                  const value = asNumber(event.target.value);
                  if (value == null) return;
                  runtime.updateActiveObject({ angle: value });
                }}
                className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-[#0f0f0f] dark:text-gray-100"
              />
            </LabeledField>
          </div>

          <LabeledField label={`Opacity (${Math.round(activeObject.opacity * 100)}%)`}>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(activeObject.opacity * 100)}
              onChange={(event) => {
                const value = asNumber(event.target.value);
                if (value == null) return;
                runtime.updateActiveObject({ opacity: value / 100 });
              }}
              className="w-full"
            />
          </LabeledField>

          {typeof activeObject.text === "string" && (
            <>
              <LabeledField label="Text">
                <textarea
                  value={activeObject.text}
                  onChange={(event) =>
                    runtime.updateActiveObject({ text: event.target.value })
                  }
                  className="w-full min-h-[80px] resize-y rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-[#0f0f0f] dark:text-gray-100"
                />
              </LabeledField>

              <div className="grid grid-cols-2 gap-2">
                <LabeledField label="Font Size">
                  <input
                    type="number"
                    min={8}
                    value={activeObject.fontSize ?? 16}
                    onChange={(event) => {
                      const value = asNumber(event.target.value);
                      if (value == null || value < 8) return;
                      runtime.updateActiveObject({ fontSize: value });
                    }}
                    className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-[#0f0f0f] dark:text-gray-100"
                  />
                </LabeledField>

                <LabeledField label="Weight">
                  <select
                    value={activeObject.fontWeight ?? "400"}
                    onChange={(event) =>
                      runtime.updateActiveObject({ fontWeight: event.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-[#0f0f0f] dark:text-gray-100"
                  >
                    <option value="300">Light</option>
                    <option value="400">Regular</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                  </select>
                </LabeledField>
              </div>

              <LabeledField label="Font Family">
                <select
                  value={activeObject.fontFamily ?? "Helvetica"}
                  onChange={(event) =>
                    runtime.updateActiveObject({ fontFamily: event.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-[#0f0f0f] dark:text-gray-100"
                >
                  <option value="Helvetica">Helvetica</option>
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </LabeledField>
            </>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={runtime.bringToFront}
              className="rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Bring Front
            </button>
            <button
              type="button"
              onClick={runtime.sendToBack}
              className="rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Send Back
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

function LabeledField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase text-gray-500 dark:text-gray-400">
        {label}
      </span>
      {children}
    </label>
  );
}
