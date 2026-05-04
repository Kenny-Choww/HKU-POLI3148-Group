import { useState } from "react";
import { BookOpenCheck, Handshake, Route, ShieldCheck } from "lucide-react";
import { groupConfig } from "../utils/data";
import { DetailsBlock } from "./Layout";

const tierIcons = {
  tier1: ShieldCheck,
  tier2: BookOpenCheck,
  tier3: Route,
  tier4: Handshake
};

export function SupportPathwayCards({ supportGroups }) {
  const [active, setActive] = useState("tier1");
  const tiers = supportGroups.supportTiers;

  return (
    <div className="grid w-full gap-4 lg:grid-cols-4">
      {tiers.map((tier) => {
        const config = groupConfig[tier.key];
        const Icon = tierIcons[tier.key];
        const selected = active === tier.key;
        return (
          <button
            key={tier.key}
            type="button"
            onClick={() => setActive(tier.key)}
            className={`flex min-h-[520px] flex-col rounded-md border p-5 text-left shadow-soft transition hover:-translate-y-0.5 ${
              selected
                ? "border-ink bg-ink text-white"
                : `${config.border} ${config.bg} text-ink`
            }`}
          >
            <Icon size={30} className={selected ? "text-white" : config.text} />
            <p
              className={`mt-5 text-sm font-bold uppercase tracking-[0.14em] ${
                selected ? "text-white/65" : "text-muted"
              }`}
            >
              {tier.tier} · {tier.percentileBand}
            </p>
            <h3 className="mt-2 text-2xl font-black leading-tight">
              {tier.label}
            </h3>
            <p
              className={`mt-3 text-sm font-bold ${
                selected ? "text-white/75" : config.text
              }`}
            >
              {tier.count} schools
            </p>
            <p
              className={`mt-5 text-sm font-semibold leading-relaxed ${
                selected ? "text-white/80" : "text-muted"
              }`}
            >
              {tier.support}
            </p>
            <div className="mt-auto pt-5">
              <div
                className={`rounded-md border p-3 ${
                  selected
                    ? "border-white/15 bg-white/10"
                    : "border-ink/10 bg-white/70"
                }`}
              >
                <p
                  className={`text-xs font-bold uppercase tracking-[0.12em] ${
                    selected ? "text-white/60" : "text-muted"
                  }`}
                >
                  Evidence to monitor
                </p>
                <p
                  className={`mt-2 text-sm font-semibold ${
                    selected ? "text-white" : "text-ink"
                  }`}
                >
                  Capacity signals, direct AI-specific signals, support need
                  score, and publication visibility.
                </p>
              </div>
              {selected && (
                <p className="mt-3 text-sm font-semibold text-white/75">
                  {tier.risk}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function AppendixPanel({ data }) {
  const { metadata, supportGroups, publicationBias } = data;

  return (
    <section
      id="appendix"
      className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6"
    >
      <div className="rounded-md border border-ink/10 bg-white p-6 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
          Optional deep-dive
        </p>
        <h2 className="mt-2 text-3xl font-black text-ink">Evidence Appendix</h2>
        <p className="mt-3 max-w-3xl text-lg font-medium leading-relaxed text-muted">
          These details support the story without forcing a first-time viewer
          through technical tables.
        </p>
        <div className="mt-6 grid gap-3">
          <DetailsBlock title="1. Methodology">
            <p>
              The study uses public school websites, official school profiles,
              district socioeconomic context, and cleaned evidence items to
              construct monitoring proxies for foundational AI implementation
              capacity, early AI-specific signals, quality of use, early-warning
              support need, and evidence confidence / publication visibility.
            </p>
          </DetailsBlock>
          <DetailsBlock title="2. Index definitions">
            <ul className="grid gap-2">
              <li>
                Foundational AI Implementation Capacity: basic capacity to
                absorb future AI funding.
              </li>
              <li>
                Early AI-Specific Signal: direct AI-related public evidence,
                weighted cautiously because the policy has not fully started.
              </li>
              <li>AI Quality of Use: deeper use beyond simple mentions.</li>
              <li>
                Early-Warning Support Need: candidate need for validation,
                teacher support, governance support, infrastructure support, or
                contextual support.
              </li>
              <li>
                Evidence Confidence / Publication Visibility: a layer for
                interpreting website publication bias.
              </li>
            </ul>
          </DetailsBlock>
          <DetailsBlock title="3. Data sources">
            <ul className="grid gap-2">
              <li>{metadata.sourceStats.schoolsInAnalysis} secondary schools in analysis.</li>
              <li>{metadata.sourceStats.schoolsWithCollectedWebsites} school websites collected.</li>
              <li>
                {metadata.sourceStats.htmlPages.toLocaleString("en")} HTML pages
                and {metadata.sourceStats.pdfs.toLocaleString("en")} PDFs.
              </li>
              <li>{metadata.sourceStats.usableDocuments.toLocaleString("en")} usable documents.</li>
              <li>{metadata.sourceStats.cleanedEvidenceItems.toLocaleString("en")} cleaned evidence items.</li>
            </ul>
          </DetailsBlock>
          <DetailsBlock title="4. Percentile support tiers">
            <ul className="grid gap-2">
              {supportGroups.supportTiers.map((tier) => (
                <li key={tier.key}>
                  {tier.tier}: {tier.percentileBand}, {tier.count} schools.
                </li>
              ))}
            </ul>
          </DetailsBlock>
          <DetailsBlock title="5. Publication visibility details">
            <ul className="grid gap-2">
              {publicationBias.correlations.map((row) => (
                <li key={`${row.publicationControl}-${row.outcome}`}>
                  {row.publicationControl} to {row.outcome}: Spearman rho{" "}
                  {row.spearmanRho}
                </li>
              ))}
            </ul>
          </DetailsBlock>
          <DetailsBlock title="6. Policy recommendations">
            <ul className="grid gap-2">
              {supportGroups.supportTiers.map((tier) => (
                <li key={tier.key}>
                  {tier.tier}: {tier.support}
                </li>
              ))}
            </ul>
          </DetailsBlock>
          <DetailsBlock title="7. Limitations and validation needs">
            <p>
              Public evidence should be used for triage and follow-up
              validation. Low visible evidence is not proof of low effort, and
              district patterns should not be interpreted as causal by
              themselves.
            </p>
          </DetailsBlock>
        </div>
      </div>
    </section>
  );
}
