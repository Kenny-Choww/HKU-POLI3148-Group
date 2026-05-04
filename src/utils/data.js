export const DATA_FILES = {
  metadata: "metadata.json",
  schoolIndices: "school_indices.json",
  districtSummary: "district_summary.json",
  readinessDimensions: "readiness_dimensions.json",
  implementationDimensions: "implementation_dimensions.json",
  supportGroups: "support_groups.json",
  publicationBias: "publication_bias.json",
  mlSummary: "ml_summary.json"
};

export async function loadStoryData() {
  const entries = await Promise.all(
    Object.entries(DATA_FILES).map(async ([key, file]) => {
      const response = await fetch(`${import.meta.env.BASE_URL}data/${file}`);
      if (!response.ok) {
        throw new Error(`Could not load ${file}`);
      }
      return [key, await response.json()];
    })
  );

  return Object.fromEntries(entries);
}

export const metricConfig = {
  foundationalCapacity: {
    label: "Foundational AI Implementation Capacity",
    shortLabel: "Foundational Capacity",
    field: "foundationalCapacity",
    adjustedField: "foundationalCapacityAdjusted",
    color: "#2563eb",
    note: "Basic capacity to absorb future AI funding"
  },
  earlySignal: {
    label: "Early AI-Specific Signal",
    shortLabel: "Early AI Signal",
    field: "earlySignal",
    adjustedField: "earlySignalAdjusted",
    color: "#15803d",
    note: "Direct AI-related public evidence"
  },
  quality: {
    label: "AI Quality of Use",
    shortLabel: "Quality",
    field: "quality",
    adjustedField: "qualityAdjusted",
    color: "#7c3aed",
    note: "Visible deeper use signals"
  },
  supportNeed: {
    label: "Early-Warning Support Need",
    shortLabel: "Support Need",
    field: "supportNeed",
    adjustedField: "supportNeedAdjusted",
    color: "#d97706",
    note: "Candidate need for validation and support"
  },
  visibility: {
    label: "Evidence Confidence / Publication Visibility",
    shortLabel: "Visibility",
    field: "visibility",
    adjustedField: "visibility",
    color: "#64748b",
    note: "How much public evidence is visible"
  }
};

export const groupConfig = {
  tier1: {
    label: "Immediate validation and support",
    color: "#d97706",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800"
  },
  tier2: {
    label: "Targeted capacity-building",
    color: "#2563eb",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800"
  },
  tier3: {
    label: "General monitoring",
    color: "#7c3aed",
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-800"
  },
  tier4: {
    label: "Lower immediate support need",
    color: "#0f766e",
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-800"
  }
};

export function formatNumber(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "n/a";
  }
  return Number(value).toLocaleString("en", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
}

export function formatWhole(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "n/a";
  }
  return Number(value).toLocaleString("en", { maximumFractionDigits: 0 });
}

export function makeHistogram(data, field, binSize = 10) {
  const bins = Array.from({ length: 10 }, (_, i) => {
    const start = i * binSize;
    const end = i === 9 ? 100 : start + binSize;
    return {
      bin: i === 9 ? `${start}-100` : `${start}-${end}`,
      start,
      end,
      count: 0
    };
  });

  data.forEach((row) => {
    const value = Number(row[field]);
    if (Number.isNaN(value)) return;
    const index = Math.min(9, Math.floor(value / binSize));
    bins[index].count += 1;
  });

  return bins;
}

export function sourceNote(text) {
  return `Source/method: ${text}`;
}
