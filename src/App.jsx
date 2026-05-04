import { AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowRight, ExternalLink } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DimensionToggleChart,
  DistrictExplorer,
  IndexDistributionChart,
  PublicationBiasPanel,
  ReadinessImplementationScatter
} from "./components/Charts";
import {
  BottomNav,
  CaveatBox,
  Checklist,
  LoadingScreen,
  MethodNote,
  ProgressNav,
  SlideContainer,
  StoryButton
} from "./components/Layout";
import {
  DataPipeline,
  FinalChain,
  HeadlineMetricGrid,
  OpeningHero,
  PolicyChain
} from "./components/Visuals";
import { AppendixPanel, SupportPathwayCards } from "./components/SupportPathways";
import { formatNumber, formatWhole, loadStoryData } from "./utils/data";

function ErrorScreen({ error }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper p-6">
      <div className="max-w-xl rounded-md border border-red-200 bg-white p-6 shadow-soft">
        <AlertTriangle className="mb-4 text-red-600" />
        <h1 className="text-2xl font-black text-ink">Could not load the story data</h1>
        <p className="mt-2 text-muted">{error.message}</p>
        <p className="mt-4 text-sm font-semibold text-muted">
          Run <code>python scripts/preprocess_data.py</code> from the app folder,
          then refresh the page.
        </p>
      </div>
    </main>
  );
}

function SupportPriorityBars({ supportGroups }) {
  const max = Math.max(
    ...supportGroups.supportPriorityCounts.map((row) => row.count),
    1
  );
  return (
    <div className="grid gap-3">
      {supportGroups.supportPriorityCounts.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex items-center justify-between gap-4 text-sm font-bold text-ink">
            <span>{row.label}</span>
            <span>{formatWhole(row.count)}</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-amber-500"
              style={{ width: `${(row.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);
  const [appendixOpen, setAppendixOpen] = useState(false);
  const slideCount = data ? 12 : 0;

  useEffect(() => {
    loadStoryData().then(setData).catch(setError);
  }, []);

  const goNext = useCallback(() => {
    setCurrent((value) => Math.min(value + 1, Math.max(slideCount - 1, 0)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slideCount]);

  const goPrev = useCallback(() => {
    setCurrent((value) => Math.max(value - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const jumpTo = useCallback((index) => {
    setCurrent(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  const slides = useMemo(() => {
    if (!data) return [];
    const {
      metadata,
      schoolIndices,
      districtSummary,
      readinessDimensions,
      implementationDimensions,
      supportGroups,
      publicationBias
    } = data;

    return [
      {
        section: "Start",
        title: "AI for All, or AI for Ready Schools?",
        question: "Will AI education funding reach all schools equally?",
        insight: "Equal funding does not automatically create equal implementation.",
        content: <OpeningHero />,
        note: (
          <MethodNote>
            Policy values and project framing come from the final report. The
            story uses cautious language because the evidence is publicly
            observable, not a complete measure of actual classroom practice.
          </MethodNote>
        )
      },
      {
        section: "Problem",
        title: "A policy does not implement itself.",
        question: "What has to happen before students actually experience AI education?",
        insight:
          "The project measures public signals along this chain to identify where support may be needed before grants translate into student opportunity.",
        content: <PolicyChain />,
        note: (
          <MethodNote>
            This page reflects the updated index logic: broad digital indicators
            are foundational implementation capacity, while direct AI evidence is
            treated as an early AI-specific signal.
          </MethodNote>
        )
      },
      {
        section: "Evidence",
        title: "How we measured public support signals.",
        question: "How can public evidence help prioritise support without judging schools?",
        insight:
          "This study reads public evidence systematically, but treats the result as an early-warning support proxy, not a school grade.",
        content: <DataPipeline metadata={metadata} />,
        note: (
          <MethodNote>
            Verified source counts: {formatWhole(metadata.sourceStats.schoolsInAnalysis)} schools,
            {" "}
            {formatWhole(metadata.sourceStats.schoolsWithCollectedWebsites)} websites collected,
            {" "}
            {formatWhole(metadata.sourceStats.htmlPages)} HTML pages,
            {" "}
            {formatWhole(metadata.sourceStats.pdfs)} PDFs,
            {" "}
            {formatWhole(metadata.sourceStats.usableDocuments)} usable documents,
            and {formatWhole(metadata.sourceStats.cleanedEvidenceItems)} cleaned evidence items.
          </MethodNote>
        )
      },
      {
        section: "Findings",
        title: "Foundational capacity is uneven, and direct AI evidence is still thin.",
        question: "What is the overall picture?",
        insight:
          "Foundational capacity is modest, early AI-specific signals are low, quality signals are limited, and support need remains high.",
        content: (
          <HeadlineMetricGrid metadata={metadata} schoolData={schoolIndices} />
        ),
        note: (
          <MethodNote>
            Headline means and medians are generated from the updated
            secondary_school_ai_indices_0_100.csv support-prioritisation fields.
          </MethodNote>
        )
      },
      {
        section: "Unevenness",
        title: "The problem is not only low average. It is uneven capacity.",
        question: "Are schools clustered together or spread apart?",
        insight:
          "This is an implementation-equity problem: schools differ in visible capacity to absorb the same AI policy support.",
        content: (
          <IndexDistributionChart
            schoolData={schoolIndices}
            metadata={metadata}
          />
        )
      },
      {
        section: "Aha",
        title: "Support tiers avoid turning evidence into rankings.",
        question: "Which schools should be candidates for validation and support?",
        insight:
          "The policy answer is not one-size-fits-all funding. Support should follow percentile-based tiers and manual validation.",
        content: (
          <ReadinessImplementationScatter
            schoolData={schoolIndices}
            metadata={metadata}
            supportGroups={supportGroups}
          />
        )
      },
      {
        section: "Diagnosis",
        title: "What is missing?",
        question: "Which parts of foundational capacity and early AI-specific evidence are weakest?",
        insight:
          "Administrative, governance, infrastructure, platform, procurement, and responsible-use signals are less visible than general curriculum or digital-learning signals.",
        content: (
          <DimensionToggleChart
            readinessDimensions={readinessDimensions}
            implementationDimensions={implementationDimensions}
          />
        )
      },
      {
        section: "Place",
        title: "Where are support needs visible?",
        question: "Do support needs appear spatially uneven?",
        insight:
          "District patterns can guide follow-up validation, but district alone should not be treated as the cause.",
        content: <DistrictExplorer districtSummary={districtSummary} />
      },
      {
        section: "Trust",
        title: "Public evidence is useful, but incomplete.",
        question: "Can website evidence mislead us?",
        insight:
          "The index is best used for support triage and follow-up validation, not as a public league table.",
        content: <PublicationBiasPanel publicationBias={publicationBias} />
      },
      {
        section: "Action",
        title: "From monitoring to action: tiered support.",
        question: "What should policymakers do with this evidence?",
        insight:
          "Equity requires matching support to capacity and validation need, not treating all schools as equally ready.",
        content: <SupportPathwayCards supportGroups={supportGroups} />,
        note: (
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
            <CaveatBox tone="green">
              Support priority is a planning signal, not a judgement of school
              quality or official performance.
            </CaveatBox>
            <div className="rounded-md border border-ink/10 bg-white p-4">
              <p className="mb-3 text-sm font-black text-ink">
                Percentile support tiers
              </p>
              <SupportPriorityBars supportGroups={supportGroups} />
            </div>
          </div>
        )
      },
      {
        section: "Takeaway",
        title: "AI for All requires Capacity for All.",
        question: "What should the audience remember?",
        insight:
          "AI for all becomes equitable only when support and validation reach the schools that need them first.",
        content: (
          <FinalChain
            onExplore={() => {
              setAppendixOpen(true);
              window.setTimeout(() => {
                document.getElementById("appendix")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start"
                });
              }, 80);
            }}
          />
        ),
        actions: (
          <StoryButton
            variant="secondary"
            onClick={() => setAppendixOpen((value) => !value)}
            icon={<ExternalLink size={18} />}
          >
            {appendixOpen ? "Hide appendix" : "Open appendix"}
          </StoryButton>
        ),
        note: (
          <CaveatBox tone="blue">
            The main story avoids school ranking lists. Deeper evidence remains
            available for validation-oriented analysis.
          </CaveatBox>
        )
      }
    ];
  }, [data, appendixOpen]);

  if (error) return <ErrorScreen error={error} />;
  if (!data || slides.length === 0) return <LoadingScreen />;

  const slide = slides[current];

  return (
    <div className="min-h-screen bg-paper text-ink">
      <ProgressNav
        current={current}
        total={slides.length}
        slides={slides}
        onJump={jumpTo}
        onNext={goNext}
        onPrev={goPrev}
      />

      <main>
        <AnimatePresence mode="wait">
          <SlideContainer
            key={slide.title}
            title={slide.title}
            question={slide.question}
            insight={slide.insight}
            note={slide.note}
            actions={slide.actions}
            eyebrow={slide.section}
          >
            {slide.content}
          </SlideContainer>
        </AnimatePresence>

        {current === slides.length - 1 && appendixOpen && (
          <AppendixPanel data={data} />
        )}
      </main>

      <BottomNav
        current={current}
        total={slides.length}
        onNext={goNext}
        onPrev={goPrev}
      />

      <footer className="border-t border-ink/10 bg-white px-4 py-5 text-sm text-muted sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>AI Education Implementation Capacity - interactive policy story</span>
          <span>
            Verified data: {formatWhole(data.metadata.sourceStats.schoolsInAnalysis)} schools,
            capacity mean {formatNumber(data.metadata.headlineMetrics[0].value, 2)}
          </span>
        </div>
      </footer>
    </div>
  );
}
