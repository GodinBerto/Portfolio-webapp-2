import DocsFrame from "@/components/pageComponents/site/docsFrame";
import PageContainerWithFooter from "@/components/pageComponents/site/pageContainerWithFooter";
import { Info, Keyboard, Sparkles } from "lucide-react";

const toolRows = [
  { tool: "Select", action: "Select and edit existing elements" },
  { tool: "Text", action: "Add editable text blocks" },
  { tool: "Rectangle", action: "Draw rectangle shapes" },
  { tool: "Circle", action: "Draw circle/ellipse shapes" },
  { tool: "Triangle", action: "Draw triangle shapes" },
  { tool: "Line", action: "Draw line shapes" },
  { tool: "Free Draw", action: "Sketch directly on canvas" },
  { tool: "Image", action: "Upload and place images" },
  { tool: "Desktop Frame", action: "Create desktop design frame" },
  { tool: "Tablet Frame", action: "Create tablet design frame" },
  { tool: "Mobile Frame", action: "Create mobile design frame" },
];

const liveRows = [
  { key: "/", action: "Open chat input at your cursor" },
  { key: "E", action: "Open reaction selector" },
  { key: "Esc", action: "Close chat/reaction mode" },
];

const shortcutRows = [
  { key: "V", action: "Switch to Select tool" },
  { key: "X", action: "Switch to Text tool" },
  { key: "R", action: "Switch to Rectangle tool" },
  { key: "C", action: "Switch to Circle tool" },
  { key: "T", action: "Switch to Triangle tool" },
  { key: "L", action: "Switch to Line tool" },
  { key: "P", action: "Switch to Free Draw tool" },
  { key: "D", action: "Switch to Desktop Frame tool" },
  { key: "B", action: "Switch to Tablet Frame tool" },
  { key: "M", action: "Switch to Mobile Frame tool" },
  { key: "Delete / Backspace", action: "Delete selected layer(s)" },
  { key: "Ctrl/Cmd + Z", action: "Undo" },
  { key: "Ctrl/Cmd + Y", action: "Redo" },
  { key: "Ctrl/Cmd + Shift + Z", action: "Redo" },
  { key: "Alt + Drag", action: "Pan canvas with mouse" },
  { key: "Ctrl + Mouse Wheel", action: "Zoom to cursor position" },
  { key: "Mouse Wheel", action: "Zoom canvas center" },
];

export default function Docs() {
  return (
    <div>
      <DocsFrame>
        <PageContainerWithFooter fullWidth={false}>
          <div className="mx-auto max-w-4xl px-4 py-12 text-white">
            <h1 className="mb-2 text-4xl font-bold">Berto&apos;Studio - Builder Docs</h1>
            <p className="mb-8 text-lg text-gray-300">
              Everything you need for the live builder workflow, frames, and collaboration.
            </p>

            <section id="introduction" className="mb-10 scroll-mt-24">
              <h2 className="mb-2 text-2xl font-bold">Introduction</h2>
              <p className="text-gray-300">
                Berto&apos;Studio includes a Figma-style builder with frames, nested layers,
                canvas editing, and multiplayer collaboration tools.
              </p>
            </section>

            <section id="installation" className="mb-10 scroll-mt-24">
              <h2 className="mb-2 text-2xl font-bold">Installations</h2>
              <p className="text-gray-300">Install dependencies and run the dev server:</p>
              <pre className="mt-3 rounded-lg border border-gray-700 bg-gray-900 p-4 text-sm text-gray-200">
                npm install{"\n"}npm run dev
              </pre>
            </section>

            <section id="quickstart" className="mb-10 scroll-mt-24">
              <h2 className="mb-2 text-2xl font-bold">Quickstart</h2>
              <ol className="list-decimal space-y-2 pl-6 text-gray-300">
                <li>Create a frame (desktop/tablet/mobile).</li>
                <li>Add shapes/text/images inside the frame.</li>
                <li>Use the Layers panel to select nested items.</li>
                <li>Use the Properties panel to style and position elements.</li>
              </ol>
            </section>

            <section id="builder-tools" className="mb-12 scroll-mt-24">
              <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold">
                <Sparkles size={20} /> Builder Tools
              </h2>
              <table className="w-full overflow-hidden rounded-lg border border-gray-700 text-left">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-sm font-semibold">Tool</th>
                    <th className="px-4 py-2 text-sm font-semibold">What It Does</th>
                  </tr>
                </thead>
                <tbody>
                  {toolRows.map((row) => (
                    <tr key={row.tool} className="border-t border-gray-700">
                      <td className="px-4 py-2 text-sm text-gray-200">{row.tool}</td>
                      <td className="px-4 py-2 text-sm text-gray-300">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section id="live-collaboration" className="mb-12 scroll-mt-24">
              <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold">
                <Info size={20} /> Live Collaboration
              </h2>
              <table className="w-full overflow-hidden rounded-lg border border-gray-700 text-left">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-sm font-semibold">Key</th>
                    <th className="px-4 py-2 text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {liveRows.map((row) => (
                    <tr key={row.key} className="border-t border-gray-700">
                      <td className="px-4 py-2 text-sm text-gray-200">{row.key}</td>
                      <td className="px-4 py-2 text-sm text-gray-300">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section id="shortcuts" className="scroll-mt-24">
              <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold">
                <Keyboard size={20} /> Keyboard Shortcuts
              </h2>
              <table className="w-full overflow-hidden rounded-lg border border-gray-700 text-left">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-sm font-semibold">Shortcut</th>
                    <th className="px-4 py-2 text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shortcutRows.map((row) => (
                    <tr key={row.key} className="border-t border-gray-700">
                      <td className="px-4 py-2 text-sm text-gray-200">{row.key}</td>
                      <td className="px-4 py-2 text-sm text-gray-300">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </PageContainerWithFooter>
      </DocsFrame>
    </div>
  );
}
