"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from "react";
import { useRouter } from "next/navigation";
import ThemeToggler from "@/components/pageComponents/theme-toggle";
import { ThemeProvider, useTheme } from "@/context/themeContext";
import {
  Bell,
  ChevronDown,
  Clock3,
  Copy,
  FileStack,
  Filter,
  FolderOpen,
  Grid2x2,
  LayoutGrid,
  Layers,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

type BuilderProject = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  roomId?: string;
  thumbnailDataUrl?: string;
};

const BUILDER_PROJECTS_STORAGE_KEY = "builder-projects";

const themeStyles: {
  [key: string]: {
    accentText: string;
    accentBg: string;
    accentBorder: string;
    accentButton: string;
    accentButtonHover: string;
    accentSoftText: string;
  };
} = {
  red: {
    accentText: "text-red-600 dark:text-red-400",
    accentBg: "bg-red-50 dark:bg-red-900/20",
    accentBorder: "border-red-300 dark:border-red-800",
    accentButton: "bg-red-600",
    accentButtonHover: "hover:bg-red-700",
    accentSoftText: "text-red-700 dark:text-red-300",
  },
  yellow: {
    accentText: "text-yellow-600 dark:text-yellow-400",
    accentBg: "bg-yellow-50 dark:bg-yellow-900/20",
    accentBorder: "border-yellow-300 dark:border-yellow-800",
    accentButton: "bg-yellow-500",
    accentButtonHover: "hover:bg-yellow-600",
    accentSoftText: "text-yellow-700 dark:text-yellow-300",
  },
  blue: {
    accentText: "text-blue-600 dark:text-blue-400",
    accentBg: "bg-blue-50 dark:bg-blue-900/20",
    accentBorder: "border-blue-300 dark:border-blue-800",
    accentButton: "bg-blue-600",
    accentButtonHover: "hover:bg-blue-700",
    accentSoftText: "text-blue-700 dark:text-blue-300",
  },
  green: {
    accentText: "text-green-600 dark:text-green-400",
    accentBg: "bg-green-50 dark:bg-green-900/20",
    accentBorder: "border-green-300 dark:border-green-800",
    accentButton: "bg-green-600",
    accentButtonHover: "hover:bg-green-700",
    accentSoftText: "text-green-700 dark:text-green-300",
  },
};

const readProjectsFromStorage = (): BuilderProject[] => {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(BUILDER_PROJECTS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as BuilderProject[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((project) => project && typeof project.id === "string")
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
};

const formatEditedTime = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "recently";

  const now = Date.now();
  const deltaMs = now - date.getTime();
  const dayMs = 1000 * 60 * 60 * 24;
  const monthMs = dayMs * 30;

  if (deltaMs >= monthMs) {
    const months = Math.max(1, Math.floor(deltaMs / monthMs));
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  const days = Math.max(1, Math.floor(deltaMs / dayMs));
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const createProjectId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `project-${Date.now()}`;
};

const createRoomId = () => {
  const base = createProjectId().replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);
  return `room-${base || Date.now()}`;
};

const buildEditorRoute = (projectId: string, roomId?: string) => {
  if (!roomId) {
    return `/builder/project/${projectId}`;
  }

  const query = new URLSearchParams();
  query.set("roomId", roomId);

  return `/builder/project/${projectId}?${query.toString()}`;
};

function BuilderHomeContent() {
  const router = useRouter();
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.blue;

  const [projects, setProjects] = useState<BuilderProject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roomFeedback, setRoomFeedback] = useState("");

  useEffect(() => {
    if (!roomFeedback) return;
    const timeout = window.setTimeout(() => setRoomFeedback(""), 3600);
    return () => window.clearTimeout(timeout);
  }, [roomFeedback]);

  useEffect(() => {
    setProjects(readProjectsFromStorage());
  }, []);

  const persistProjects = useCallback((nextProjects: BuilderProject[]) => {
    setProjects(nextProjects);
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      BUILDER_PROJECTS_STORAGE_KEY,
      JSON.stringify(nextProjects)
    );
  }, []);

  const openProject = useCallback(
    (projectId: string) => {
      const now = new Date().toISOString();
      let resolvedRoomId: string | undefined;
      const nextProjects = projects
        .map((project) => {
          if (project.id !== projectId) return project;
          resolvedRoomId = project.roomId || createRoomId();
          return {
            ...project,
            updatedAt: now,
            roomId: resolvedRoomId,
          };
        })
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

      persistProjects(nextProjects);
      router.push(buildEditorRoute(projectId, resolvedRoomId));
    },
    [persistProjects, projects, router]
  );

  const createProject = useCallback(() => {
    const now = new Date().toISOString();
    const roomId = createRoomId();
    const nextProject: BuilderProject = {
      id: createProjectId(),
      name: `Project ${projects.length + 1}`,
      createdAt: now,
      updatedAt: now,
      roomId,
    };

    const nextProjects = [nextProject, ...projects];
    persistProjects(nextProjects);
    router.push(buildEditorRoute(nextProject.id, roomId));
  }, [persistProjects, projects, router]);

  const copyRoomLink = useCallback(async (project: BuilderProject) => {
    if (!project.roomId || typeof window === "undefined") return;

    const joinLink = `${window.location.origin}${buildEditorRoute(
      project.id,
      project.roomId
    )}`;

    const payload = [
      `Room ID: ${project.roomId}`,
      `Join Link: ${joinLink}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(payload);
      setRoomFeedback(`Room link copied for ${project.roomId}`);
    } catch {
      setRoomFeedback("Could not copy room link. Copy manually.");
    }
  }, []);

  const filteredProjects = useMemo(() => {
    const value = searchQuery.trim().toLowerCase();
    if (!value) return projects;

    return projects.filter((project) =>
      project.name.toLowerCase().includes(value)
    );
  }, [projects, searchQuery]);

  return (
    <div className="min-h-screen bg-[#eff0f3] dark:bg-semiblack">
      <div className="flex min-h-screen">
        <aside className="w-[260px] shrink-0 border-r border-gray-300 bg-white p-3 text-gray-700 dark:border-gray-800 dark:bg-semiblack dark:text-gray-200">
          <div className="mb-3 flex items-center justify-between px-2">
            <button className="flex items-center gap-2 text-sm font-semibold">
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${currentTheme.accentButton}`}
              >
                B
              </span>
              <span>Berto&apos;s Studio</span>
              <ChevronDown size={13} className="text-gray-400" />
            </button>
            <button className="relative rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white">
              <Bell size={15} />
              <span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-red-500" />
            </button>
          </div>

          <div className="relative mb-4">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search"
              className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-gray-500 dark:border-gray-700 dark:bg-semiblack dark:text-gray-200 dark:placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-1 border-b border-gray-200 pb-4 dark:border-gray-800">
            <SidebarRow icon={Clock3} label="Recents" />
            <SidebarRow icon={Users} label="Community" />
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center gap-2 px-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Studio</p>
              <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-blue-300">
                Free
              </span>
            </div>
            <div className="space-y-1">
              <SidebarRow icon={FileStack} label="Drafts" />
              <SidebarRow icon={Grid2x2} label="All projects" />
              <SidebarRow icon={Layers} label="Resources" />
              <SidebarRow icon={Star} label="Starred" />
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-semiblack">
            <p className="text-[11px] leading-5 text-gray-500 dark:text-gray-300">
              You&apos;re running out of files in your free team. Upgrade to keep creating.
            </p>
            <button
              type="button"
              className={`mt-3 w-full rounded-md px-3 py-2 text-xs font-semibold text-white transition ${currentTheme.accentButton} ${currentTheme.accentButtonHover}`}
            >
              View plans
            </button>
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-semiblack">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Projects Started
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
              Every project opens as a live room.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-6 py-5 text-gray-800 dark:text-gray-100">
          <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Studio</p>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  Team project
                </h1>
                <ChevronDown size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${currentTheme.accentBorder} ${currentTheme.accentBg} ${currentTheme.accentSoftText}`}
                >
                  <Sparkles size={12} />
                  Live Collaboration
                </span>
                {roomFeedback && (
                  <span className="text-gray-600 dark:text-gray-300">{roomFeedback}</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={createProject}
                className={`inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold text-white transition ${currentTheme.accentButton} ${currentTheme.accentButtonHover}`}
              >
                <Plus size={16} />
                Create
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-semiblack dark:text-gray-200 dark:hover:bg-gray-900"
              >
                Share
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-semiblack dark:text-gray-300 dark:hover:bg-gray-900"
              >
                <Settings2 size={15} />
              </button>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white dark:border-gray-700 dark:bg-semiblack">
                <ThemeToggler />
              </div>
            </div>
          </header>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-semiblack dark:text-gray-300 dark:hover:bg-gray-900">
                All files
                <ChevronDown size={12} />
              </button>
              <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-semiblack dark:text-gray-300 dark:hover:bg-gray-900">
                Last modified
                <ChevronDown size={12} />
              </button>
              <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-semiblack dark:text-gray-300 dark:hover:bg-gray-900">
                <Filter size={12} />
                Filters
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-semiblack dark:text-gray-300 dark:hover:bg-gray-900">
                <LayoutGrid size={14} />
              </button>
              <button className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-semiblack dark:text-gray-300 dark:hover:bg-gray-900">
                <List size={14} />
              </button>
              <button className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-semiblack dark:text-gray-300 dark:hover:bg-gray-900">
                <MoreHorizontal size={14} />
              </button>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-16 text-center dark:border-gray-700 dark:bg-semiblack">
              <FolderOpen className="mx-auto mb-4 text-gray-400 dark:text-gray-500" size={34} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No projects yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create your first project to launch a live collaborative room.
              </p>
              <button
                type="button"
                onClick={createProject}
                className={`mt-6 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white transition ${currentTheme.accentButton} ${currentTheme.accentButtonHover}`}
              >
                <Plus size={16} />
                Create Project
              </button>
            </div>
          ) : (
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
              {filteredProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => openProject(project.id)}
                  className="group overflow-hidden rounded-2xl border border-gray-300 bg-white text-left shadow-[0_10px_40px_rgba(15,23,42,0.12)] transition hover:-translate-y-1 hover:border-gray-400 dark:border-gray-700 dark:bg-semiblack dark:hover:border-gray-500"
                >
                  <div className="relative h-40 overflow-hidden border-b border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-semiblack">
                    {project.thumbnailDataUrl ? (
                      <div
                        className="h-full w-full bg-cover bg-top bg-no-repeat"
                        style={{ backgroundImage: `url(${project.thumbnailDataUrl})` }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                        No preview yet
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {project.name}
                      </h4>
                      {project.roomId && (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            void copyRoomLink(project);
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-0.5 text-[11px] text-gray-600 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-900"
                        >
                          <Copy size={11} />
                          Share
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Edited {formatEditedTime(project.updatedAt)}
                    </p>
                  </div>
                </button>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarRow({
  icon: Icon,
  label,
  active = false,
}: {
  icon: ComponentType<{ size?: string | number }>;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition ${
        active
          ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

export default function BuilderHomePage() {
  return (
    <ThemeProvider>
      <BuilderHomeContent />
    </ThemeProvider>
  );
}
