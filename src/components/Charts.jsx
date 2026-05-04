import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useMemo, useState } from "react";
import {
  formatNumber,
  formatWhole,
  groupConfig,
  makeHistogram,
  metricConfig
} from "../utils/data";
import { CaveatBox, StoryButton } from "./Layout";
import { GroupLegend } from "./Visuals";

function ChartFrame({ title, annotation, children, controls }) {
  return (
    <div className="w-full rounded-md border border-ink/10 bg-white p-4 shadow-soft">
      <div className="mb-4 grid gap-3 xl:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] xl:items-start">
        <div className="min-w-0">
          <h3 className="text-xl font-black text-ink">{title}</h3>
          <p className="mt-1 text-sm font-semibold text-muted">{annotation}</p>
        </div>
        {controls && (
          <div className="flex min-w-0 flex-wrap gap-2 xl:justify-end">
            {controls}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function SmallTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-ink/10 bg-white p-3 text-sm shadow-soft">
      <p className="font-black text-ink">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="font-semibold text-muted">
          {item.name}: {formatNumber(item.value, 2)}
        </p>
      ))}
    </div>
  );
}

export function IndexDistributionChart({ schoolData, metadata }) {
  const [metricKey, setMetricKey] = useState("earlySignal");
  const config = metricConfig[metricKey];
  const histogram = useMemo(
    () => makeHistogram(schoolData, config.field, 10),
    [schoolData, config.field]
  );

  return (
    <ChartFrame
      title={`${config.label}: schools by score band`}
      annotation="Notice how foundational capacity, early AI-specific signals, support need, and publication visibility tell different parts of the support story."
      controls={Object.entries(metricConfig).map(([key, item]) => (
        <button
          key={key}
          type="button"
          onClick={() => setMetricKey(key)}
          className={`rounded-md px-3 py-2 text-sm font-bold transition ${
            metricKey === key
              ? "bg-ink text-white"
              : "border border-ink/10 bg-white text-ink hover:border-ink/35"
          }`}
        >
          {item.shortLabel}
        </button>
      ))}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="h-[370px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={histogram} margin={{ left: 8, right: 16, top: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d9ded7" />
              <XAxis
                dataKey="bin"
                label={{ value: "Index score band", position: "insideBottom", offset: -12 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                label={{ value: "Schools", angle: -90, position: "insideLeft" }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<SmallTooltip />} />
              <Bar name="Schools" dataKey="count" fill={config.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <aside className="rounded-md border border-ink/10 bg-paper p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
            Inequality labels
          </p>
          <dl className="mt-4 grid gap-3">
            <div>
              <dt className="text-sm text-muted">Foundational capacity Gini</dt>
              <dd className="text-2xl font-black text-blue-700">
                {formatNumber(metadata.gini.foundationalCapacity, 3)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Early AI signal Gini</dt>
              <dd className="text-2xl font-black text-green-700">
                {formatNumber(metadata.gini.earlySignal, 3)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Quality Gini</dt>
              <dd className="text-2xl font-black text-violet-700">
                {formatNumber(metadata.gini.quality, 3)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-sm font-semibold leading-relaxed text-muted">
            Early AI-specific signal and quality are more uneven than foundational capacity.
          </p>
        </aside>
      </div>
    </ChartFrame>
  );
}

function ScatterTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="max-w-xs rounded-md border border-ink/10 bg-white p-3 text-sm shadow-soft">
      <p className="font-black text-ink">Candidate for follow-up validation</p>
      <p className="mt-1 text-muted">District: {row.district}</p>
      <p className="text-muted">
        Foundational capacity: {formatNumber(row.foundationalCapacity, 2)}
      </p>
      <p className="text-muted">
        Early AI signal: {formatNumber(row.earlySignal, 2)}
      </p>
      <p className="text-muted">Support need: {formatNumber(row.supportNeed, 2)}</p>
      <p className="text-muted">{row.tierLabel}</p>
    </div>
  );
}

function TierDot({ cx, cy, payload, activeGroupKey }) {
  const config = groupConfig[payload.tier] || groupConfig[payload.group];
  const selected = payload.tier === activeGroupKey || payload.group === activeGroupKey;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={selected ? 5 : 4}
      fill={config?.color || "#64748b"}
      fillOpacity={selected ? 0.9 : 0.5}
      stroke="#ffffff"
      strokeWidth={0.8}
    />
  );
}

export function ReadinessImplementationScatter({ schoolData, metadata, supportGroups }) {
  const [activeGroupKey, setActiveGroupKey] = useState("tier1");
  const activeGroup = supportGroups.supportTiers.find(
    (group) => group.key === activeGroupKey
  );

  return (
    <div className="grid w-full gap-5 xl:grid-cols-[1fr_360px]">
      <ChartFrame
        title="Capacity, early AI signal, and support tier"
        annotation="Points are coloured by percentile-based support tiers: top 10%, next 15%, middle 50%, and lowest 25% support need."
      >
        <GroupLegend />
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-muted">
          X-axis: foundational capacity. Y-axis: direct early AI-specific signal.
        </p>
        <div className="mt-4 h-[470px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 22, bottom: 32, left: 4 }}>
              <CartesianGrid stroke="#d9ded7" strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="foundationalCapacity"
                name="Foundational capacity"
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                label={{ value: "Foundational AI Implementation Capacity", position: "insideBottom", offset: -18 }}
              />
              <YAxis
                type="number"
                dataKey="earlySignal"
                name="Early AI signal"
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                label={{ value: "Early AI-Specific Signal", angle: -90, position: "insideLeft" }}
              />
              <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: "3 3" }} />
              <Scatter
                data={schoolData}
                name="Schools"
                shape={(props) => (
                  <TierDot {...props} activeGroupKey={activeGroupKey} />
                )}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {supportGroups.supportTiers.map((group) => (
            <button
              key={group.key}
              type="button"
              onClick={() => setActiveGroupKey(group.key)}
              className={`rounded-md border p-3 text-left transition ${
                group.key === activeGroupKey
                  ? "border-ink bg-ink text-white"
                  : "border-ink/10 bg-paper text-ink hover:border-ink/35"
              }`}
            >
              <span className="block text-sm font-black">
                {group.count} schools
              </span>
              <span className="mt-1 block text-xs font-semibold opacity-75">
                {group.tier}: {group.percentileBand}
              </span>
            </button>
          ))}
        </div>
      </ChartFrame>

      <aside className={`rounded-md border p-5 shadow-soft ${groupConfig[activeGroupKey].bg} ${groupConfig[activeGroupKey].border}`}>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
          Selected support tier
        </p>
        <h3 className={`mt-3 text-3xl font-black ${groupConfig[activeGroupKey].text}`}>
          {activeGroup.tier}
        </h3>
        <p className={`mt-1 text-lg font-black ${groupConfig[activeGroupKey].text}`}>
          {activeGroup.label}
        </p>
        <p className="mt-2 text-5xl font-black text-ink">{activeGroup.count}</p>
        <p className="text-sm font-semibold text-muted">schools</p>
        <dl className="mt-6 grid gap-4">
          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Meaning</dt>
            <dd className="mt-1 font-semibold text-ink">{activeGroup.meaning}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Main risk</dt>
            <dd className="mt-1 font-semibold text-ink">{activeGroup.risk}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Recommended support</dt>
            <dd className="mt-1 font-semibold text-ink">{activeGroup.support}</dd>
          </div>
        </dl>
        <dl className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-md border border-ink/10 bg-white p-2">
            <dt className="text-[11px] font-bold uppercase text-muted">Need</dt>
            <dd className="font-black text-ink">{formatNumber(activeGroup.meanSupportNeed, 1)}</dd>
          </div>
          <div className="rounded-md border border-ink/10 bg-white p-2">
            <dt className="text-[11px] font-bold uppercase text-muted">Capacity</dt>
            <dd className="font-black text-ink">{formatNumber(activeGroup.meanFoundationalCapacity, 1)}</dd>
          </div>
          <div className="rounded-md border border-ink/10 bg-white p-2">
            <dt className="text-[11px] font-bold uppercase text-muted">Visibility</dt>
            <dd className="font-black text-ink">{formatNumber(activeGroup.meanVisibility, 1)}</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-2">
          {activeGroup.actions.map((action) => (
            <span
              key={action}
              className="rounded-md border border-ink/10 bg-white px-2 py-1 text-xs font-bold text-ink"
            >
              {action}
            </span>
          ))}
        </div>
      </aside>
    </div>
  );
}

export function DimensionToggleChart({ readinessDimensions, implementationDimensions }) {
  const [mode, setMode] = useState("earlySignal");
  const rows = useMemo(() => {
    const data = mode === "foundationalCapacity" ? readinessDimensions : implementationDimensions;
    return data.slice().sort((a, b) => b.pctSchoolsWithEvidence - a.pctSchoolsWithEvidence);
  }, [mode, readinessDimensions, implementationDimensions]);
  const color =
    mode === "foundationalCapacity"
      ? metricConfig.foundationalCapacity.color
      : metricConfig.earlySignal.color;

  return (
    <ChartFrame
      title={`${mode === "foundationalCapacity" ? "Foundational capacity" : "Early AI-specific signal"} dimensions with visible evidence`}
      annotation="Broad digital capacity is treated as foundation; direct AI-specific evidence remains thinner and more cautious."
      controls={
        <>
          <button
            type="button"
            onClick={() => setMode("foundationalCapacity")}
            className={`rounded-md px-3 py-2 text-sm font-bold ${
              mode === "foundationalCapacity" ? "bg-ink text-white" : "border border-ink/10 bg-white"
            }`}
          >
            Foundational capacity
          </button>
          <button
            type="button"
            onClick={() => setMode("earlySignal")}
            className={`rounded-md px-3 py-2 text-sm font-bold ${
              mode === "earlySignal" ? "bg-ink text-white" : "border border-ink/10 bg-white"
            }`}
          >
            Early AI signal
          </button>
        </>
      }
    >
      <div className="h-[470px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            layout="vertical"
            margin={{ top: 8, right: 28, bottom: 28, left: 42 }}
          >
            <CartesianGrid stroke="#d9ded7" strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, 100]}
              label={{ value: "Schools with evidence (%)", position: "insideBottom", offset: -18 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={170}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0].payload;
                return (
                  <div className="max-w-xs rounded-md border border-ink/10 bg-white p-3 text-sm shadow-soft">
                    <p className="font-black text-ink">{row.label}</p>
                    <p className="mt-1 text-muted">{row.description}</p>
                    <p className="mt-2 font-semibold text-muted">
                      Schools with evidence: {formatNumber(row.pctSchoolsWithEvidence, 2)}%
                    </p>
                    <p className="font-semibold text-muted">
                      Mean score: {formatNumber(row.meanScore, 2)}
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="pctSchoolsWithEvidence"
              name="Schools with evidence"
              fill={color}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}

const districtMetricOptions = [
  { key: "meanSupportNeed", label: "Mean Support Need", color: "#d97706" },
  { key: "meanFoundationalCapacity", label: "Mean Foundational Capacity", color: "#2563eb" },
  { key: "meanEarlySignal", label: "Mean Early AI Signal", color: "#15803d" },
  { key: "meanVisibility", label: "Mean Publication Visibility", color: "#64748b" },
  {
    key: "meanSupportNeedAdjusted",
    label: "Publication-adjusted Support Need",
    color: "#b45309"
  }
];

export function DistrictExplorer({ districtSummary }) {
  const [metric, setMetric] = useState(districtMetricOptions[0]);
  const rows = useMemo(
    () => districtSummary.slice().sort((a, b) => b[metric.key] - a[metric.key]),
    [districtSummary, metric]
  );
  const highest = rows.slice(0, 5).map((row) => `${row.district}: ${formatNumber(row[metric.key], 2)}`);
  const lowest = rows
    .slice(-5)
    .reverse()
    .map((row) => `${row.district}: ${formatNumber(row[metric.key], 2)}`);

  return (
    <div className="grid w-full gap-5 xl:grid-cols-[1fr_330px]">
      <ChartFrame
        title={`District view: ${metric.label}`}
        annotation="District patterns can guide validation, but district alone should not be treated as the cause."
        controls={districtMetricOptions.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setMetric(option)}
            className={`max-w-full whitespace-normal rounded-md px-3 py-2 text-left text-sm font-bold leading-tight ${
              metric.key === option.key ? "bg-ink text-white" : "border border-ink/10 bg-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      >
        <div className="h-[430px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rows}
              layout="vertical"
              margin={{ top: 18, right: 28, bottom: 28, left: 42 }}
            >
              <CartesianGrid stroke="#d9ded7" strokeDasharray="3 3" />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                label={{ value: "Mean index score", position: "insideBottom", offset: -18 }}
              />
              <YAxis
                dataKey="district"
                type="category"
                width={128}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const row = payload[0].payload;
                  return (
                    <div className="rounded-md border border-ink/10 bg-white p-3 text-sm shadow-soft">
                      <p className="font-black text-ink">{row.district}</p>
                      <p className="text-muted">Schools: {formatWhole(row.schools)}</p>
                      <p className="text-muted">Foundational capacity: {formatNumber(row.meanFoundationalCapacity, 2)}</p>
                      <p className="text-muted">Early AI signal: {formatNumber(row.meanEarlySignal, 2)}</p>
                      <p className="text-muted">Support need: {formatNumber(row.meanSupportNeed, 2)}</p>
                      <p className="text-muted">Visibility: {formatNumber(row.meanVisibility, 2)}</p>
                      <p className="text-muted">
                        Tier 1 or 2 share: {formatNumber(row.tier1Or2SupportShare, 1)}%
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey={metric.key} name={metric.label} fill={metric.color} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartFrame>

      <aside className="flex flex-col gap-4">
        <div className="rounded-md border border-ink/10 bg-white p-4 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
            Higher values
          </p>
          <ul className="mt-3 grid gap-2 text-sm font-semibold text-ink">
            {highest.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-ink/10 bg-white p-4 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
            Lower values
          </p>
          <ul className="mt-3 grid gap-2 text-sm font-semibold text-ink">
            {lowest.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <CaveatBox>
          District comparisons are descriptive and should be interpreted alongside
          school-level validation and publication-visibility checks.
        </CaveatBox>
      </aside>
    </div>
  );
}

export function PublicationBiasPanel({ publicationBias }) {
  const [adjusted, setAdjusted] = useState(false);
  const [metric, setMetric] = useState("foundationalCapacity");
  const field =
    metric === "foundationalCapacity"
      ? adjusted
        ? "foundationalCapacityAdjusted"
        : "foundationalCapacity"
      : adjusted
        ? "supportNeedAdjusted"
        : "supportNeed";
  const color =
    metric === "foundationalCapacity"
      ? metricConfig.foundationalCapacity.color
      : metricConfig.supportNeed.color;

  return (
    <div className="grid w-full gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-green-200 bg-green-50 p-5">
            <h3 className="text-xl font-black text-green-950">What the index can see</h3>
            <ul className="mt-4 grid gap-2 text-sm font-semibold text-green-950/80">
              <li>Publicly visible planning</li>
              <li>Published AI activities</li>
              <li>Visible teacher development evidence</li>
              <li>Visible governance documents</li>
              <li>Public reporting practice</li>
            </ul>
          </div>
          <div className="rounded-md border border-amber-200 bg-amber-50 p-5">
            <h3 className="text-xl font-black text-amber-950">What it cannot prove</h3>
            <ul className="mt-4 grid gap-2 text-sm font-semibold text-amber-950/80">
              <li>Full classroom practice</li>
              <li>Actual quality of every AI lesson</li>
              <li>Whether unpublished activity exists</li>
              <li>Whether low evidence means low effort</li>
              <li>School quality or official performance</li>
            </ul>
          </div>
        </div>
        <CaveatBox>
          More visible evidence is strongly associated with higher foundational
          capacity and lower early-warning support need, so publication practice
          must be interpreted as part of the evidence layer.
        </CaveatBox>
      </div>

      <ChartFrame
        title="Publication visibility and visible evidence"
        annotation="The relationship is strong enough that website publication practice must be treated as part of the measurement story."
        controls={
          <>
            <button
              type="button"
              onClick={() => setMetric("foundationalCapacity")}
              className={`rounded-md px-3 py-2 text-sm font-bold ${
                metric === "foundationalCapacity" ? "bg-ink text-white" : "border border-ink/10 bg-white"
              }`}
            >
              Foundational capacity
            </button>
            <button
              type="button"
              onClick={() => setMetric("supportNeed")}
              className={`rounded-md px-3 py-2 text-sm font-bold ${
                metric === "supportNeed" ? "bg-ink text-white" : "border border-ink/10 bg-white"
              }`}
            >
              Support need
            </button>
            <button
              type="button"
              onClick={() => setAdjusted((value) => !value)}
              className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-bold"
            >
              {adjusted ? "Publication-adjusted view" : "Original view"}
            </button>
          </>
        }
      >
        <div className="h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 18, bottom: 34, left: 4 }}>
              <CartesianGrid stroke="#d9ded7" strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="visibility"
                name="Publication visibility"
                domain={[0, 100]}
                label={{ value: "Evidence confidence / publication visibility", position: "insideBottom", offset: -18 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="number"
                dataKey={field}
                name={metric === "foundationalCapacity" ? "Foundational capacity" : "Support need"}
                domain={[0, 100]}
                label={{ value: metric === "foundationalCapacity" ? "Foundational capacity" : "Support need", angle: -90, position: "insideLeft" }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const row = payload[0].payload;
                  return (
                    <div className="rounded-md border border-ink/10 bg-white p-3 text-sm shadow-soft">
                      <p className="font-black text-ink">Public evidence point</p>
                      <p className="text-muted">District: {row.district}</p>
                      <p className="text-muted">
                        Visibility: {formatNumber(row.visibility, 2)}
                      </p>
                      <p className="text-muted">
                        {metric === "foundationalCapacity" ? "Capacity" : "Support need"}: {formatNumber(row[field], 2)}
                      </p>
                    </div>
                  );
                }}
              />
              <Scatter data={publicationBias.scatterPoints} fill={color} opacity={0.42} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </ChartFrame>
    </div>
  );
}
