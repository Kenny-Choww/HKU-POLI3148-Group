import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BadgeDollarSign,
  BookMarked,
  Building2,
  FileText,
  GraduationCap,
  Landmark,
  MonitorCheck,
  Network,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { useState } from "react";
import { formatNumber, formatWhole, groupConfig, metricConfig } from "../utils/data";
import { CaveatBox, StoryButton } from "./Layout";

const barrierItems = [
  "School planning",
  "Teacher training",
  "Infrastructure and tools",
  "Responsible-AI governance",
  "Public reporting and monitoring"
];

export function OpeningHero() {
  const [revealed, setRevealed] = useState(false);
  const fundingSourceUrl = "https://www.info.gov.hk/gia/general/202512/16/P2025121600261.htm";

  return (
    <div className="grid w-full gap-4 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex min-h-[420px] flex-col justify-between rounded-md border border-blue-200 bg-blue-50 p-6 sm:p-8"
      >
        <div>
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-blue-600 text-white">
            <Landmark size={24} />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">
            Policy ambition
          </p>
          <h2 className="mt-3 text-5xl font-black text-blue-950 sm:text-7xl">
            AI for All
          </h2>
        </div>
        <div className="grid gap-3 text-lg font-semibold text-blue-950">
          <a
            href={fundingSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 text-blue-800 underline decoration-blue-500 underline-offset-4 transition hover:text-blue-950"
          >
            <BadgeDollarSign className="text-blue-700" size={22} />
            HK$2 billion digital education support
          </a>
          <a
            href={fundingSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 text-blue-800 underline decoration-blue-500 underline-offset-4 transition hover:text-blue-950"
          >
            <Building2 className="text-blue-700" size={22} />
            HK$500,000 school-level AI grant
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.08 }}
        className="flex min-h-[420px] flex-col justify-between rounded-md border border-amber-200 bg-white p-6 shadow-soft sm:p-8"
      >
        <div>
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-amber-500 text-white">
            <MonitorCheck size={24} />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-700">
            Implementation reality
          </p>
          <h2 className="mt-3 text-4xl font-black text-ink sm:text-6xl">
            AI for ready schools?
          </h2>
          <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-muted">
            But schools differ in planning, teacher capacity, infrastructure,
            governance, and public reporting.
          </p>
        </div>

        <div className="mt-6">
          <StoryButton
            onClick={() => setRevealed((value) => !value)}
            icon={<Sparkles size={18} />}
          >
            What could go wrong?
          </StoryButton>
          {revealed && (
            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 grid gap-2 sm:grid-cols-2"
            >
              {barrierItems.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-950"
                >
                  {item}
                </li>
              ))}
            </motion.ul>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const chainSteps = [
  {
    label: "Government funding",
    icon: Landmark,
    risk: "Can schools convert funding into implementation?",
    detail:
      "The same school-level AI grant can land in very different organisational contexts. The project treats funding as the starting point, not the outcome."
  },
  {
    label: "School planning and leadership",
    icon: BookMarked,
    risk: "Does the school have a clear plan for AI education?",
    detail:
      "Foundational capacity includes visible leadership, planning, resource mobilisation, and the ability to turn a broad policy into local priorities."
  },
  {
    label: "Digital infrastructure and tools",
    icon: Network,
    risk: "Are platforms, devices, networks, and learning systems ready?",
    detail:
      "Broad digital indicators such as e-learning platforms, STEM, coding, robotics, and digital systems are treated as foundations for absorbing future AI funding."
  },
  {
    label: "Teacher development and human capacity",
    icon: GraduationCap,
    risk: "Are teachers trained and confident enough to use AI pedagogically?",
    detail:
      "Teacher capacity is central because AI tools do not become learning opportunities without subject-level examples, time, confidence, and professional support."
  },
  {
    label: "Governance and responsible use",
    icon: ShieldCheck,
    risk: "Are rules clear for privacy, ethics, integrity, and safe AI use?",
    detail:
      "Responsible use is not a side issue. Schools may need guidance on privacy, academic integrity, safe use, assessment, and documentation before AI practice scales."
  },
  {
    label: "Curriculum and classroom implementation",
    icon: MonitorCheck,
    risk: "Can AI be integrated into subjects, teaching, assessment, and activities?",
    detail:
      "The Early AI-Specific Signal Index looks for direct AI-related evidence, but gives it cautious weight because the policy has not fully started yet."
  },
  {
    label: "Student opportunity",
    icon: Users,
    risk: "Do students actually gain meaningful AI learning experiences?",
    detail:
      "The equity concern is practical: equal grants do not guarantee equal student opportunity if some schools need more foundational support first."
  },
  {
    label: "Monitoring and support",
    icon: Sparkles,
    risk: "Is implementation reviewed, improved, and supported over time?",
    detail:
      "The updated index is an early-warning support-prioritisation tool. It identifies candidates for validation and support, not school grades."
  }
];

export function PolicyChain() {
  const [active, setActive] = useState(chainSteps[0]);

  return (
    <div className="grid w-full gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-md border border-ink/10 bg-white p-6 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
          Project problem
        </p>
        <h3 className="mt-3 text-3xl font-black leading-tight text-ink">
          Funding does not automatically become classroom practice.
        </h3>
        <p className="mt-4 text-lg font-medium leading-relaxed text-muted">
          Even if schools receive the same AI education grant, they may not
          benefit equally. Some schools already have strong e-learning
          infrastructure, digital platforms, STEM or coding experience, teacher
          development resources, and planning capacity. Other schools may need
          more support before they can convert the same funding into meaningful
          AI-assisted teaching and student learning opportunities.
        </p>
        <div className="mt-6 rounded-md border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-bold text-blue-950">
            The updated index follows this chain as an early-warning and
            support-prioritisation tool.
          </p>
        </div>
        <div className="mt-5 rounded-md border border-ink/10 bg-paper p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
            Hover explanation
          </p>
          <h4 className="mt-2 text-xl font-black text-ink">{active.label}</h4>
          <p className="mt-2 text-base font-semibold leading-relaxed text-muted">
            {active.detail}
          </p>
        </div>
      </div>

      <div className="rounded-md border border-ink/10 bg-white p-5 shadow-soft">
        <div className="grid gap-2">
          {chainSteps.map((step, index) => {
            const Icon = step.icon;
            const selected = active.label === step.label;
            return (
              <div key={step.label}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(step)}
                  onFocus={() => setActive(step)}
                  onClick={() => setActive(step)}
                  className={`grid w-full grid-cols-[44px_1fr] gap-3 rounded-md border p-3 text-left transition ${
                    selected
                      ? "border-ink bg-ink text-white"
                      : "border-ink/10 bg-paper text-ink hover:border-ink/30"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-md ${
                      selected ? "bg-white/15" : "bg-white"
                    }`}
                  >
                    <Icon size={22} />
                  </span>
                  <span>
                    <span className="block text-base font-black leading-tight">
                      {step.label}
                    </span>
                    <span
                      className={`mt-1 block text-sm font-semibold leading-snug ${
                        selected ? "text-white/72" : "text-muted"
                      }`}
                    >
                      {step.risk}
                    </span>
                  </span>
                </button>
                {index < chainSteps.length - 1 && (
                  <ArrowDown className="mx-auto my-1 text-muted" size={18} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const publicEvidenceAreas = [
  {
    key: "infrastructure",
    title: "E-learning infrastructure",
    short: "Platforms, devices, networks, and learning systems that make later AI adoption easier.",
    icon: MonitorCheck,
    explanation:
      "This is treated as foundational capacity, not proof of AI implementation. Schools with visible e-learning systems may be better positioned to absorb future AI funding.",
    examples: [
      "E-learning platforms or learning management systems",
      "BYOD, tablets, computer rooms, smart classrooms, or network upgrades",
      "Digital learning policies, online homework, or blended-learning practice"
    ]
  },
  {
    key: "teacherResources",
    title: "Teacher AI development resources",
    short: "Professional learning and staff capacity signals related to AI or digital pedagogy.",
    icon: GraduationCap,
    explanation:
      "Teacher development matters because AI tools do not become learning opportunities without confident teachers, subject examples, and implementation time.",
    examples: [
      "AI or digital-pedagogy teacher workshops",
      "Staff development days, training records, or professional-learning communities",
      "Published teaching resources, lesson-sharing, or subject-team support"
    ]
  },
  {
    key: "governance",
    title: "AI governance readiness",
    short: "Visible rules and routines for responsible use, privacy, safety, and integrity.",
    icon: ShieldCheck,
    explanation:
      "Governance evidence helps identify whether schools appear prepared to use AI safely and sustainably, especially around privacy, ethics, procurement, and assessment integrity.",
    examples: [
      "Responsible-use, privacy, or acceptable-use guidance",
      "Academic-integrity or assessment policies mentioning AI-related concerns",
      "Procurement, data protection, or safe-use documentation"
    ]
  },
  {
    key: "pedagogy",
    title: "Pedagogical integration (STEM)",
    short: "STEM, coding, robotics, project learning, and subject integration as implementation foundations.",
    icon: BookMarked,
    explanation:
      "Broad STEM and digital-learning signals are not counted as direct AI implementation. They are used as public evidence that the school may have pedagogical foundations for future AI-assisted teaching.",
    examples: [
      "STEM, coding, robotics, maker, or innovation activities",
      "Cross-subject digital projects or inquiry-based learning",
      "AI literacy activities or subject examples where explicitly published"
    ]
  }
];

export function DataPipeline({ metadata }) {
  const [active, setActive] = useState(publicEvidenceAreas[0].key);
  const activeArea = publicEvidenceAreas.find((area) => area.key === active);
  const stats = metadata.sourceStats;
  const steps = [
    { label: "Schools", value: stats.schoolsInAnalysis, icon: Building2 },
    { label: "Websites collected", value: stats.schoolsWithCollectedWebsites, icon: Network },
    { label: "HTML pages", value: stats.htmlPages, icon: FileText },
    { label: "PDFs", value: stats.pdfs, icon: FileText },
    { label: "Usable documents", value: stats.usableDocuments, icon: BookMarked },
    { label: "Evidence items", value: stats.cleanedEvidenceItems, icon: Sparkles }
  ];

  return (
    <div className="grid w-full gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-md border border-ink/10 bg-white p-5 shadow-soft">
        <div className="grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="relative rounded-md border border-ink/10 bg-paper p-4">
                <Icon size={22} className="text-ink" />
                <p className="mt-3 text-3xl font-black text-ink">
                  {formatWhole(step.value)}
                </p>
                <p className="text-sm font-semibold text-muted">{step.label}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-muted md:block" />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex items-center justify-center text-muted">
          <ArrowDown size={24} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {publicEvidenceAreas.map((area) => {
            const Icon = area.icon;
            return (
            <button
              key={area.key}
              type="button"
              onClick={() => setActive(area.key)}
              className={`rounded-md border p-4 text-left transition ${
                active === area.key
                  ? "border-ink bg-ink text-white"
                  : "border-ink/10 bg-white hover:border-ink/35"
              }`}
            >
              <Icon size={22} />
              <p className="mt-3 text-lg font-black">{area.title}</p>
              <p className={`mt-2 text-sm ${active === area.key ? "text-white/75" : "text-muted"}`}>
                {area.short}
              </p>
            </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-md border border-ink/10 bg-white p-5 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
            Selected evidence area
          </p>
          <h3 className="mt-2 text-3xl font-black text-ink">{activeArea.title}</h3>
          <p className="mt-3 text-lg font-medium leading-relaxed text-muted">
            {activeArea.explanation}
          </p>
          <div className="mt-5 rounded-md border border-ink/10 bg-paper p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
              Public evidence examples
            </p>
            <ul className="mt-3 grid gap-2 text-sm font-semibold text-ink">
              {activeArea.examples.map((example) => (
                <li key={example} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <CaveatBox>
          Public website evidence can miss activity that schools do not publish.
        </CaveatBox>
      </div>
    </div>
  );
}

export function MetricCard({ metric, data, schoolData, onClick, active }) {
  const config = metricConfig[metric.key] || {
    field: metric.key,
    color: "#64748b"
  };
  const values = schoolData.map((row) => Number(row[config.field]));
  const max = Math.max(...values, 1);
  const spark = values
    .slice()
    .sort((a, b) => a - b)
    .filter((_, index) => index % 18 === 0)
    .map((value) => `${(value / max) * 100}%`);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border bg-white p-5 text-left shadow-soft transition hover:-translate-y-0.5 ${
        active ? "border-ink" : "border-ink/10"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
            {metric.label}
          </p>
          <p className="mt-3 text-5xl font-black text-ink sm:text-6xl">
            {formatNumber(metric.value, 2)}
          </p>
          <p className="text-sm font-bold text-muted">{metric.suffix}</p>
        </div>
        <span
          className="mt-1 h-4 w-4 rounded-full"
          style={{ backgroundColor: config.color }}
        />
      </div>
      <div className="mt-5 flex h-10 items-end gap-1">
        {spark.map((height, index) => (
          <span
            key={`${metric.key}-${index}`}
            className="flex-1 rounded-t-sm"
            style={{ height, backgroundColor: config.color, opacity: 0.25 + index / spark.length / 2 }}
          />
        ))}
      </div>
      <p className="mt-4 text-sm font-semibold text-muted">
        Median: {formatNumber(metric.median, 2)}
      </p>
    </button>
  );
}

export function HeadlineMetricGrid({ metadata, schoolData }) {
  const [active, setActive] = useState(metadata.headlineMetrics[0]);

  return (
    <div className="grid w-full gap-5 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-4 md:grid-cols-2">
        {metadata.headlineMetrics.map((metric) => (
          <MetricCard
            key={metric.key}
            metric={metric}
            data={metadata}
            schoolData={schoolData}
            active={active.key === metric.key}
            onClick={() => setActive(metric)}
          />
        ))}
      </div>
      <aside className="rounded-md border border-ink/10 bg-ink p-6 text-white shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">
          Clicked card
        </p>
        <h3 className="mt-3 text-3xl font-black">{active.label}</h3>
        <dl className="mt-6 grid gap-4">
          <div>
            <dt className="text-sm text-white/60">Mean</dt>
            <dd className="text-2xl font-black">{formatNumber(active.value, 2)} / 100</dd>
          </div>
          <div>
            <dt className="text-sm text-white/60">Median</dt>
            <dd className="text-2xl font-black">{formatNumber(active.median, 2)} / 100</dd>
          </div>
        </dl>
        <p className="mt-6 text-lg font-semibold leading-relaxed text-white/85">
          {active.meaning}
        </p>
      </aside>
    </div>
  );
}

export function FinalChain({ onExplore }) {
  const items = [
    "Funding alone is not enough",
    "School capacity shapes implementation",
    "Public evidence shows uneven foundational capacity and thin early AI signals",
    "Publication visibility is useful but incomplete",
    "Percentile support tiers plus validation can make AI education more equitable"
  ];

  return (
    <div className="grid w-full gap-5 lg:grid-cols-[1fr_360px]">
      <div className="rounded-md border border-ink/10 bg-white p-6 shadow-soft">
        <div className="grid gap-3">
          {items.map((item, index) => (
            <div key={item}>
              <div className="flex items-center gap-4 rounded-md border border-ink/10 bg-paper p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink text-sm font-black text-white">
                  {index + 1}
                </span>
                <p className="text-xl font-black text-ink">{item}</p>
              </div>
              {index < items.length - 1 && (
                <ArrowDown className="mx-auto my-2 text-muted" size={22} />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-between rounded-md border border-green-200 bg-green-50 p-6">
        <div>
          <ShieldCheck className="text-green-700" size={36} />
          <h3 className="mt-4 text-3xl font-black text-green-950">
            Capacity for All
          </h3>
          <p className="mt-4 text-lg font-medium leading-relaxed text-green-950/80">
            The purpose is not to label schools as successful or unsuccessful.
            The purpose is to identify where validation and implementation
            support may need to arrive first, so that AI for all does not
            quietly become AI for ready schools.
          </p>
        </div>
        <StoryButton
          onClick={onExplore}
          className="mt-6"
          icon={<BookMarked size={18} />}
        >
          Explore the evidence
        </StoryButton>
      </div>
    </div>
  );
}

export function GroupLegend() {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(groupConfig).map(([key, config]) => (
        <span
          key={key}
          className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-2 py-1 text-xs font-semibold text-muted"
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          {config.label}
        </span>
      ))}
    </div>
  );
}
