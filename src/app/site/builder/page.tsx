"use client";

import Link from "next/link";
import PageContainerWithFooter from "@/components/pageComponents/site/pageContainerWithFooter";
import { useTheme } from "@/context/themeContext";
import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  LayoutTemplate,
  MessageSquareMore,
  MonitorSmartphone,
  MousePointer2,
  Sparkles,
  Users2,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";

type ThemeStyle = {
  accentText: string;
  accentBg: string;
  accentBorder: string;
  accentButton: string;
  accentButtonHover: string;
  accentSoftText: string;
  spotlightGradient: string;
  previewGradient: string;
  softGradient: string;
  glow: string;
  shadow: string;
};

type FeatureCard = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
};

const themeStyles: Record<string, ThemeStyle> = {
  red: {
    accentText: "text-red-600 dark:text-red-300",
    accentBg: "bg-red-50/80 dark:bg-red-500/10",
    accentBorder: "border-red-200/90 dark:border-red-500/30",
    accentButton: "bg-red-600",
    accentButtonHover: "hover:bg-red-700",
    accentSoftText: "text-red-700 dark:text-red-200",
    spotlightGradient:
      "linear-gradient(135deg, #dc2626 0%, #fb7185 55%, #fdba74 100%)",
    previewGradient:
      "linear-gradient(135deg, #fff5f5 0%, #ffe4e6 52%, #ffedd5 100%)",
    softGradient:
      "linear-gradient(135deg, rgba(220, 38, 38, 0.16), rgba(251, 113, 133, 0.08))",
    glow: "rgba(251, 113, 133, 0.22)",
    shadow: "rgba(220, 38, 38, 0.2)",
  },
  yellow: {
    accentText: "text-yellow-600 dark:text-yellow-300",
    accentBg: "bg-yellow-50/80 dark:bg-yellow-500/10",
    accentBorder: "border-yellow-200/90 dark:border-yellow-500/30",
    accentButton: "bg-yellow-500",
    accentButtonHover: "hover:bg-yellow-600",
    accentSoftText: "text-yellow-700 dark:text-yellow-200",
    spotlightGradient:
      "linear-gradient(135deg, #ca8a04 0%, #f59e0b 55%, #facc15 100%)",
    previewGradient:
      "linear-gradient(135deg, #fffbeb 0%, #fef3c7 52%, #fde68a 100%)",
    softGradient:
      "linear-gradient(135deg, rgba(202, 138, 4, 0.18), rgba(250, 204, 21, 0.1))",
    glow: "rgba(250, 204, 21, 0.24)",
    shadow: "rgba(202, 138, 4, 0.2)",
  },
  blue: {
    accentText: "text-blue-600 dark:text-blue-300",
    accentBg: "bg-blue-50/80 dark:bg-blue-500/10",
    accentBorder: "border-blue-200/90 dark:border-blue-500/30",
    accentButton: "bg-blue-600",
    accentButtonHover: "hover:bg-blue-700",
    accentSoftText: "text-blue-700 dark:text-blue-200",
    spotlightGradient:
      "linear-gradient(135deg, #2563eb 0%, #6366f1 55%, #7dd3fc 100%)",
    previewGradient:
      "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 52%, #cffafe 100%)",
    softGradient:
      "linear-gradient(135deg, rgba(37, 99, 235, 0.16), rgba(99, 102, 241, 0.08))",
    glow: "rgba(99, 102, 241, 0.22)",
    shadow: "rgba(37, 99, 235, 0.2)",
  },
  green: {
    accentText: "text-green-600 dark:text-green-300",
    accentBg: "bg-green-50/80 dark:bg-green-500/10",
    accentBorder: "border-green-200/90 dark:border-green-500/30",
    accentButton: "bg-green-600",
    accentButtonHover: "hover:bg-green-700",
    accentSoftText: "text-green-700 dark:text-green-200",
    spotlightGradient:
      "linear-gradient(135deg, #16a34a 0%, #10b981 55%, #67e8f9 100%)",
    previewGradient:
      "linear-gradient(135deg, #f0fdf4 0%, #d1fae5 52%, #cffafe 100%)",
    softGradient:
      "linear-gradient(135deg, rgba(22, 163, 74, 0.16), rgba(16, 185, 129, 0.08))",
    glow: "rgba(16, 185, 129, 0.22)",
    shadow: "rgba(22, 163, 74, 0.2)",
  },
};

const featureCards: FeatureCard[] = [
  {
    icon: MonitorSmartphone,
    eyebrow: "Responsive Frames",
    title: "Design desktop, tablet, and mobile views together",
    description:
      "Start with frame presets so the layout system already thinks across breakpoints.",
  },
  {
    icon: MousePointer2,
    eyebrow: "Canvas Editing",
    title: "Shape sections visually with text, layers, and drawing tools",
    description:
      "Map interfaces quickly with a builder that stays flexible while ideas are still moving.",
  },
  {
    icon: Users2,
    eyebrow: "Live Rooms",
    title: "Share work instantly with collaborative project rooms",
    description:
      "Bring feedback into the same workspace instead of bouncing between static screenshots and links.",
  },
  {
    icon: MessageSquareMore,
    eyebrow: "Review Flow",
    title: "Keep comments, reactions, and iteration close to the canvas",
    description:
      "Review the work in context so changes feel faster and decisions stay grounded in the design.",
  },
];

export default function Builder() {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.blue;
  const spotlightStyle = { backgroundImage: currentTheme.spotlightGradient };
  const primaryShadow = `0 22px 50px ${currentTheme.shadow}`;

  return (
    <PageContainerWithFooter fullWidth={true}>
      <div className="relative overflow-hidden  pt-28 text-slate-900 dark:text-white">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:88px_88px] opacity-60 [mask-image:radial-gradient(circle_at_top,black,transparent_78%)] dark:opacity-20" />

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mt-7 text-5xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              Easy.{" "}
              <span
                className="bg-clip-text text-transparent"
                style={spotlightStyle}
              >
                Collaborative.
              </span>
              <br />
              Built for Your Next Site.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              Build sections on a live canvas, switch across responsive frames,
              and move from concept to shared review without leaving the
              workspace.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/builder"
                className={`inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition ${currentTheme.accentButton} ${currentTheme.accentButtonHover}`}
                style={{ boxShadow: primaryShadow }}
              >
                Start Building
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/site/docs"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-slate-300/80 bg-white/85 px-6 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Explore Docs
              </Link>
            </div>
          </div>

          <div className="relative mx-auto mt-16 container overflow-hidden rounded-[38px]  p-5 shadow-[0_40px_120px_rgba(15,23,42,0.12)]  sm:p-6 lg:px-8 lg:py-10">
            {/* <div className="pointer-events-none absolute inset-x-[10%] bottom-0 top-16 rounded-[999px] border border-slate-200/80 dark:border-white/10" />
            <div className="pointer-events-none absolute inset-x-[18%] bottom-8 top-28 rounded-[999px] border border-slate-200/70 dark:border-white/10" />
            <div className="pointer-events-none absolute inset-x-[28%] bottom-16 top-36 rounded-[999px] border border-slate-200/60 dark:border-white/10" /> */}

            <div className="relative grid gap-4 lg:grid-cols-[0.9fr_1.05fr_0.9fr] lg:items-end">
              <div className="grid gap-4">
                <div className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Responsive Frames
                  </p>
                  <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">
                    Desktop, tablet, and mobile presets built in
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Desktop", "Tablet", "Mobile"].map((item) => (
                      <span
                        key={item}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${currentTheme.accentBorder} ${currentTheme.accentBg} ${currentTheme.accentSoftText}`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className="rounded-[24px] p-5 text-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
                  style={{ backgroundImage: currentTheme.spotlightGradient }}
                >
                  <BadgeCheck size={18} />
                  <p className="mt-6 text-lg font-semibold">Room Sync Ready</p>
                  <p className="mt-2 text-sm text-white/80">
                    Every builder project is ready to share when the next review
                    is needed.
                  </p>
                </div>
              </div>

              <div
                className="relative overflow-hidden rounded-[32px] border border-white/70 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.14)] dark:border-white/10 sm:p-8"
                style={{
                  backgroundImage: currentTheme.spotlightGradient,
                  boxShadow: `0 28px 80px ${currentTheme.shadow}`,
                }}
              >
                <div className="absolute -bottom-10 -right-8 h-48 w-48 rounded-full border border-white/20" />
                <div className="absolute -bottom-2 left-10 h-56 w-56 rounded-full border border-white/20" />

                <div className="relative flex min-h-[24rem] flex-col justify-between text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
                        Live Builder Workspace
                      </p>
                      <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                        Website Builder
                      </h2>
                    </div>
                    <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                      Room Ready
                    </span>
                  </div>

                  <p className="max-w-xs text-sm leading-7 text-white/85 sm:text-base">
                    Turn ideas into a responsive layout system with frames,
                    layers, comments, and a shared workflow around the same
                    canvas.
                  </p>

                  <div className="space-y-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[22px] border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                          Active stack
                        </p>
                        <p className="mt-2 text-xl font-semibold">
                          Frames + Layers
                        </p>
                      </div>
                      <div className="rounded-[22px] border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                          Review flow
                        </p>
                        <p className="mt-2 text-xl font-semibold">
                          Comments + Reactions
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[
                        "Responsive",
                        "Canvas",
                        "Shareable",
                        "Collaborative",
                      ].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Tool Stack
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                        Made for quick iteration
                      </p>
                    </div>
                    <Blocks size={18} className="text-slate-400" />
                  </div>
                  <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <p>Shape sections with text and drawing tools</p>
                    <p>Organize interfaces with layers and frames</p>
                    <p>Share work instantly through live project rooms</p>
                  </div>
                </div>

                <div
                  className="rounded-[28px] border border-white/80 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] dark:border-white/10"
                  style={{ backgroundImage: currentTheme.previewGradient }}
                >
                  <div className="rounded-[22px] border border-white/70 bg-white/85 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#0b1220]/70">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-300">
                      <span>Canvas Preview</span>
                      <span>Live</span>
                    </div>
                    <div className="mt-3 grid grid-cols-[1.15fr_0.85fr] gap-2">
                      <div className="rounded-2xl bg-white p-3 dark:bg-white/10">
                        <div className="h-2 w-16 rounded-full bg-slate-200 dark:bg-white/20" />
                        <div className="mt-3 h-20 rounded-[18px] border border-dashed border-slate-200 dark:border-white/15" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-10 rounded-2xl bg-white/90 dark:bg-white/10" />
                        <div className="h-16 rounded-2xl bg-white/80 dark:bg-white/10" />
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                    Built to feel visual before the first pixel-perfect pass.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                label: "Responsive by default",
                value: "3 frame modes",
                detail:
                  "Start with structure that already considers desktop, tablet, and mobile.",
                icon: LayoutTemplate,
              },
              {
                label: "Built for feedback",
                value: "Live review flow",
                detail:
                  "Keep reactions, comments, and iteration around the same shared workspace.",
                icon: Users2,
              },
              {
                label: "Fast visual editing",
                value: "Canvas-first builder",
                detail:
                  "Create sections and explore ideas without getting buried in setup friction.",
                icon: WandSparkles,
              },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {card.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                    style={spotlightStyle}
                  >
                    <card.icon size={18} />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {card.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-24 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[30px] border border-white/80 bg-white/85 p-6 shadow-[0_24px_65px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]"
              >
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                  style={spotlightStyle}
                >
                  <feature.icon size={20} />
                </div>
                <p
                  className={`mt-5 text-xs font-semibold uppercase tracking-[0.18em] ${currentTheme.accentText}`}
                >
                  {feature.eyebrow}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-24 overflow-hidden rounded-[36px] border border-white/80 bg-white/85 shadow-[0_30px_90px_rgba(15,23,42,0.1)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="p-8 sm:p-10">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${currentTheme.accentBorder} ${currentTheme.accentBg} ${currentTheme.accentSoftText}`}
                >
                  <Sparkles size={14} />
                  Builder Flow
                </span>
                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                  Move from blank space to shared review with less friction.
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
                  The builder is set up to help you create structure quickly,
                  refine it visually, and bring others into the process at the
                  right moment.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/builder"
                    className={`inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition ${currentTheme.accentButton} ${currentTheme.accentButtonHover}`}
                    style={{ boxShadow: primaryShadow }}
                  >
                    Open Builder
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/site/docs"
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-slate-300/80 bg-white/85 px-6 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    Read the Docs
                  </Link>
                </div>
              </div>

              <div className="border-t border-slate-200/80 p-8 dark:border-white/10 lg:border-l lg:border-t-0 lg:p-10">
                <div className="grid gap-4">
                  {[
                    {
                      step: "01",
                      title: "Start with a room-backed project",
                      description:
                        "Open the builder and begin inside a workspace that is already ready to be shared.",
                    },
                    {
                      step: "02",
                      title: "Build visually across responsive frames",
                      description:
                        "Lay out sections with frames, text, layers, and direct canvas tools while the idea is still fresh.",
                    },
                    {
                      step: "03",
                      title: "Review and iterate together",
                      description:
                        "Use live rooms, comments, and reactions to keep the feedback loop close to the design.",
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="rounded-[28px] border border-slate-200/80 p-5 dark:border-white/10"
                      style={{ backgroundImage: currentTheme.softGradient }}
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold text-white"
                          style={spotlightStyle}
                        >
                          {item.step}
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageContainerWithFooter>
  );
}
