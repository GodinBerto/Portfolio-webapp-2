export type DocsDropdownItem = {
  id: string;
  slug: string;
  name: string;
};

export type DocsSection = {
  id: number;
  name: string;
  dropdowns: DocsDropdownItem[];
};

type DocsParagraphBlock = {
  type: "paragraph";
  text: string;
};

type DocsListBlock = {
  type: "list";
  items: string[];
};

type DocsCodeBlock = {
  type: "code";
  code: string;
};

type DocsTableBlock = {
  type: "table";
  headers: [string, string];
  rows: Array<{ key: string; value: string }>;
};

export type DocsContentBlock =
  | DocsParagraphBlock
  | DocsListBlock
  | DocsCodeBlock
  | DocsTableBlock;

export type DocsPage = {
  slug: string;
  name: string;
  sectionName: string;
  description: string;
  blocks: DocsContentBlock[];
};

export const DocsData: DocsSection[] = [
  {
    id: 0,
    name: "Getting Started",
    dropdowns: [
      { id: "introduction", slug: "introduction", name: "Introduction" },
      { id: "installation", slug: "installation", name: "Installation" },
      { id: "quickstart", slug: "quickstart", name: "Quickstart" },
    ],
  },
  {
    id: 1,
    name: "Builder",
    dropdowns: [
      { id: "builder-tools", slug: "builder-tools", name: "Builder Tools" },
      {
        id: "live-collaboration",
        slug: "live-collaboration",
        name: "Live Collaboration",
      },
      { id: "shortcuts", slug: "shortcuts", name: "Keyboard Shortcuts" },
    ],
  },
];

export const docsPages: DocsPage[] = [
  {
    slug: "introduction",
    name: "Introduction",
    sectionName: "Getting Started",
    description: "Overview of the Figma-style collaborative builder experience.",
    blocks: [
      {
        type: "paragraph",
        text:
          "BertoStudio Builder supports frame-based design, nested layers, and live collaboration for multi-user editing.",
      },
      {
        type: "paragraph",
        text:
          "You can create desktop/tablet/mobile frames and design directly inside them with shape, text, image, and free-draw tools.",
      },
    ],
  },
  {
    slug: "installation",
    name: "Installation",
    sectionName: "Getting Started",
    description: "Set up and run the project locally.",
    blocks: [
      {
        type: "paragraph",
        text: "Install dependencies and start the development server:",
      },
      {
        type: "code",
        code: "npm install\nnpm run dev",
      },
      {
        type: "paragraph",
        text:
          "Open `/builder` to access the collaborative builder canvas with tools and sidebars.",
      },
    ],
  },
  {
    slug: "quickstart",
    name: "Quickstart",
    sectionName: "Getting Started",
    description: "Fast path to creating your first framed design.",
    blocks: [
      {
        type: "list",
        items: [
          "Pick a frame preset (desktop/tablet/mobile).",
          "Add text, shapes, or images inside the frame.",
          "Use Layers to select nested frame children quickly.",
          "Use Properties to adjust position, size, typography, and colors.",
          "Use history actions (Undo/Redo) while iterating.",
        ],
      },
    ],
  },
  {
    slug: "builder-tools",
    name: "Builder Tools",
    sectionName: "Builder",
    description: "Core tools available in the tools subnavbar.",
    blocks: [
      {
        type: "table",
        headers: ["Tool", "Action"],
        rows: [
          { key: "Select", value: "Select and transform existing objects." },
          { key: "Hand", value: "Pan canvas by dragging." },
          { key: "Text", value: "Insert editable text layers." },
          { key: "Rectangle", value: "Draw rectangles." },
          { key: "Circle", value: "Draw circles/ellipses." },
          { key: "Triangle", value: "Draw triangles." },
          { key: "Line", value: "Draw line segments." },
          { key: "Diamond", value: "Draw diamond shapes." },
          { key: "Star", value: "Draw star shapes." },
          { key: "Arrow", value: "Draw arrow shapes." },
          { key: "Image", value: "Upload image files into canvas." },
          { key: "Free Draw", value: "Sketch freeform paths." },
          { key: "Desktop Frame", value: "Create desktop-sized frames." },
          { key: "Tablet Frame", value: "Create tablet-sized frames." },
          { key: "Mobile Frame", value: "Create mobile-sized frames." },
          { key: "Bring Front", value: "Move selected layer to front." },
          { key: "Send Back", value: "Move selected layer to back." },
        ],
      },
    ],
  },
  {
    slug: "live-collaboration",
    name: "Live Collaboration",
    sectionName: "Builder",
    description: "Cursor chat and reaction controls for real-time sessions.",
    blocks: [
      {
        type: "table",
        headers: ["Shortcut", "Action"],
        rows: [
          { key: "/", value: "Open cursor chat input." },
          { key: "E", value: "Open reaction selector." },
          { key: "Esc", value: "Close chat/reaction modes." },
        ],
      },
    ],
  },
  {
    slug: "shortcuts",
    name: "Keyboard Shortcuts",
    sectionName: "Builder",
    description: "Builder and collaboration shortcuts.",
    blocks: [
      {
        type: "table",
        headers: ["Shortcut", "Action"],
        rows: [
          { key: "V", value: "Select tool" },
          { key: "H", value: "Hand/Pan tool" },
          { key: "X", value: "Text tool" },
          { key: "R", value: "Rectangle tool" },
          { key: "C", value: "Circle tool" },
          { key: "T", value: "Triangle tool" },
          { key: "L", value: "Line tool" },
          { key: "O", value: "Diamond tool" },
          { key: "S", value: "Star tool" },
          { key: "A", value: "Arrow tool" },
          { key: "P", value: "Free draw tool" },
          { key: "D", value: "Desktop frame tool" },
          { key: "B", value: "Tablet frame tool" },
          { key: "M", value: "Mobile frame tool" },
          { key: "Delete / Backspace", value: "Delete selected object(s)" },
          { key: "Ctrl/Cmd + Z", value: "Undo" },
          { key: "Ctrl/Cmd + Y", value: "Redo" },
          { key: "Ctrl/Cmd + Shift + Z", value: "Redo (alternate)" },
          { key: "Alt + Drag", value: "Pan canvas" },
          { key: "Ctrl/Cmd + Wheel", value: "Zoom to cursor" },
          { key: "Wheel", value: "Smooth zoom (mouse wheel)" },
          { key: "/", value: "Live cursor chat" },
          { key: "E", value: "Reaction selector" },
          { key: "Esc", value: "Close collaboration overlays" },
        ],
      },
    ],
  },
];

export const docsOrder = docsPages.map((page) => ({
  slug: page.slug,
  name: page.name,
}));

export const getDocBySlug = (slug: string) =>
  docsPages.find((page) => page.slug === slug) ?? null;

export const getDocNavigation = (slug: string) => {
  const index = docsPages.findIndex((page) => page.slug === slug);
  if (index < 0) {
    return { previous: null, next: null };
  }

  return {
    previous: index > 0 ? docsPages[index - 1] : null,
    next: index < docsPages.length - 1 ? docsPages[index + 1] : null,
  };
};
