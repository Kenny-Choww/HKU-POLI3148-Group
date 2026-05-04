from __future__ import annotations

import json
import math
import re
from pathlib import Path

import pandas as pd


REPO_ROOT = Path(__file__).resolve().parents[2]
APP_ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = APP_ROOT / "public" / "data"
OUT_DIR.mkdir(parents=True, exist_ok=True)

FOUNDATIONAL = "Foundational_AI_Implementation_Capacity_Index_0_100"
EARLY_SIGNAL = "Early_AI_Specific_Signal_Index_0_100"
QUALITY = "AI_Quality_of_Use_Index_0_100"
SUPPORT_NEED = "Early_Warning_Support_Need_Index_0_100"
VISIBILITY = "Evidence_Confidence_Publication_Visibility_Index_0_100"
FOUNDATIONAL_ADJ = "Foundational_AI_Implementation_Capacity_Index_publication_adjusted_0_100"
EARLY_SIGNAL_ADJ = "Early_AI_Specific_Signal_Index_publication_adjusted_0_100"
QUALITY_ADJ = "AI_Quality_of_Use_Index_publication_adjusted_0_100"
SUPPORT_NEED_ADJ = "Early_Warning_Support_Need_Index_publication_adjusted_0_100"


def read_csv(path: str) -> pd.DataFrame:
    return pd.read_csv(REPO_ROOT / path)


def round_value(value, digits=2):
    if pd.isna(value):
        return None
    return round(float(value), digits)


def int_value(value):
    if pd.isna(value):
        return None
    return int(round(float(value)))


def write_json(filename: str, payload) -> None:
    (OUT_DIR / filename).write_text(json.dumps(payload, indent=2), encoding="utf-8")


def parse_scraping_log() -> dict:
    text = (REPO_ROOT / "data" / "metadata" / "website_scraping_log.md").read_text(
        encoding="utf-8"
    )
    patterns = {
        "schoolsAttempted": r"Schools attempted:\s*(\d+)",
        "successfulSchoolWebsites": r"Number of successful school websites:\s*(\d+)",
        "failedSchoolWebsites": r"Number of failed school websites:\s*(\d+)",
        "htmlPagesSaved": r"Number of HTML pages saved:\s*(\d+)",
        "pdfsSaved": r"Number of PDFs saved:\s*(\d+)",
        "documentsProcessed": r"Documents processed for text extraction:\s*(\d+)",
        "usableDocuments": r"Documents with usable extracted text:\s*(\d+)",
        "shortOrEmptyDocuments": r"Documents with short or empty extracted text:\s*(\d+)",
    }
    return {
        key: int(match.group(1))
        for key, pattern in patterns.items()
        if (match := re.search(pattern, text))
    }


def tier_key(value: str) -> str:
    value = str(value).lower()
    if "tier 1" in value:
        return "tier1"
    if "tier 2" in value:
        return "tier2"
    if "tier 3" in value:
        return "tier3"
    return "tier4"


DIMENSION_DESCRIPTIONS = {
    "strategic_leadership_planning": "Published leadership, planning, or strategic direction relevant to future AI education implementation.",
    "foundational_digital_infrastructure": "Visible platforms, devices, networks, learning systems, or digital infrastructure that can support AI adoption.",
    "teacher_development_capacity": "Teacher development, professional learning, or human-capacity evidence that may help schools absorb AI funding.",
    "curriculum_pedagogical_integration": "Curriculum and pedagogy signals, including broad digital learning foundations that can support later AI use.",
    "student_digital_ai_learning_opportunities": "Student STEM, coding, robotics, e-learning, digital, or AI learning opportunities treated as foundational capacity.",
    "governance_responsible_use": "Rules, guidance, privacy, ethics, responsible use, or governance signals.",
    "administrative_resource_mobilisation": "Administrative, staffing, funding, procurement, or resource mobilisation signals.",
    "ai_literacy_activity": "Published activities that explicitly build student AI literacy.",
    "ai_assisted_teaching": "Direct public evidence of AI-assisted teaching or classroom use.",
    "ai_assessment": "Assessment design, integrity, or AI-related assessment practice.",
    "ai_platform_or_tool": "Named AI platforms, tools, or school-level access to AI tools.",
    "ai_teacher_development": "Professional development specifically focused on AI use.",
    "responsible_ai": "Responsible-AI, ethics, privacy, or safe-use implementation signals.",
    "ai_procurement": "Procurement, purchasing, or vendor/process signals related to AI tools.",
    "cross_subject_ai_use": "AI use across more than one subject or curriculum area.",
}


def format_dimension_rows(df: pd.DataFrame, family: str) -> list[dict]:
    rows = []
    for _, row in df.iterrows():
        dimension = row["dimension"]
        rows.append(
            {
                "family": family,
                "dimension": dimension,
                "label": row.get("dimension_label")
                or dimension.replace("_", " ").title(),
                "description": DIMENSION_DESCRIPTIONS.get(
                    dimension, "Visible public evidence for this dimension."
                ),
                "schools": int_value(row["schools"]),
                "schoolsWithEvidence": int_value(row["schools_with_evidence"]),
                "pctSchoolsWithEvidence": round_value(
                    row["pct_schools_with_evidence"], 2
                ),
                "meanScore": round_value(row["mean_score_0_100"], 2),
                "medianScore": round_value(row["median_score_0_100"], 2),
                "totalEvidenceItems": int_value(row["total_evidence_items"]),
            }
        )
    return rows


def build_tiers(tier_counts: pd.DataFrame) -> list[dict]:
    copy = tier_counts.copy()
    copy["tier_key"] = copy["support_priority_tier"].map(tier_key)
    order = ["tier1", "tier2", "tier3", "tier4"]
    content = {
        "tier1": {
            "label": "Immediate validation and support candidate",
            "meaning": "Top 10% support need. These schools are candidates for manual validation and early support.",
            "risk": "Low publication visibility or weak capacity signals may hide specific support needs.",
            "support": "Use follow-up validation, basic planning support, teacher development, governance checks, infrastructure review, and contextual support where needed.",
            "actions": ["Manual validation", "Teacher support", "Infrastructure review"],
            "percentileBand": "Top 10% support need",
        },
        "tier2": {
            "label": "Targeted capacity-building candidate",
            "meaning": "Next 15% support need. These schools may need targeted help before AI funding becomes classroom practice.",
            "risk": "Foundational capacity may be too thin for rapid implementation without support.",
            "support": "Provide capacity-building packages, planning templates, teacher release time, and procurement or governance guidance.",
            "actions": ["Capacity package", "Planning templates", "Governance guidance"],
            "percentileBand": "Next 15%",
        },
        "tier3": {
            "label": "General monitoring and standard support",
            "meaning": "Middle 50% support need. These schools can receive standard support while monitoring visible implementation progress.",
            "risk": "Implementation may still be uneven across teachers, subjects, and documentation practices.",
            "support": "Use standard grant guidance, common teacher resources, light-touch monitoring, and optional implementation clinics.",
            "actions": ["Standard guidance", "Monitoring", "Implementation clinics"],
            "percentileBand": "Middle 50%",
        },
        "tier4": {
            "label": "Lower immediate support need / peer-learning candidate",
            "meaning": "Lowest 25% support need. These schools show stronger visible capacity or lower immediate support need.",
            "risk": "Do not convert stronger visible evidence into a prestige ranking.",
            "support": "Invite voluntary peer learning, resource exchange, demonstration lessons, and mentoring without treating this as a league table.",
            "actions": ["Peer learning", "Resource exchange", "Voluntary mentoring"],
            "percentileBand": "Lowest 25%",
        },
    }
    rows = []
    for key in order:
        row = copy.loc[copy["tier_key"] == key].iloc[0]
        rows.append(
            {
                "key": key,
                "tier": row["support_priority_tier"],
                "label": content[key]["label"],
                "fullLabel": row["support_priority_label"],
                "count": int_value(row["schools"]),
                "meaning": content[key]["meaning"],
                "risk": content[key]["risk"],
                "support": content[key]["support"],
                "actions": content[key]["actions"],
                "percentileBand": content[key]["percentileBand"],
                "meanSupportNeed": round_value(row["mean_support_need"], 2),
                "medianSupportNeed": round_value(row["median_support_need"], 2),
                "meanFoundationalCapacity": round_value(
                    row["mean_foundational_capacity"], 2
                ),
                "meanEarlySignal": round_value(row["mean_early_ai_signal"], 2),
                "meanVisibility": round_value(row["mean_visibility"], 2),
            }
        )
    return rows


def build_data() -> None:
    ai = read_csv("data/processed_data/secondary_school_ai_indices_0_100.csv")
    support = read_csv("data/processed_data/secondary_school_support_priority_groups.csv")
    features = read_csv("data/processed_data/secondary_school_analysis_features.csv")
    evidence = read_csv("data/processed_data/secondary_school_evidence_items_cleaned.csv")

    foundational_dimensions = read_csv(
        "outputs/tables/foundational_capacity_dimension_summary.csv"
    )
    early_signal_dimensions = read_csv(
        "outputs/tables/early_ai_specific_signal_dimension_summary.csv"
    )
    distribution_stats = read_csv("outputs/tables/support_tool_distribution_statistics.csv")
    district = read_csv("outputs/tables/district_support_need_summary.csv")
    district_adjusted = read_csv(
        "outputs/tables/district_publication_adjusted_support_summary.csv"
    )
    visibility_corr = read_csv("outputs/tables/publication_visibility_correlations.csv")
    tier_counts = read_csv("outputs/tables/support_triage_tier_counts.csv")
    ml = read_csv("outputs/tables/ml_model_performance.csv")

    feature_cols = [
        "school_id",
        "publication_volume_index_0_100",
        "total_extracted_text_length",
        "usable_document_count",
        "website_document_count",
        "pdf_document_count",
        FOUNDATIONAL_ADJ,
        EARLY_SIGNAL_ADJ,
        QUALITY_ADJ,
        SUPPORT_NEED_ADJ,
    ]
    merged = support.merge(features[feature_cols], on="school_id", how="left")

    school_indices = []
    for index, row in merged.reset_index(drop=True).iterrows():
        key = tier_key(row["support_priority_tier"])
        school_indices.append(
            {
                "pointId": index + 1,
                "district": row["district"],
                "foundationalCapacity": round_value(row[FOUNDATIONAL], 2),
                "earlySignal": round_value(row[EARLY_SIGNAL], 2),
                "quality": round_value(row[QUALITY], 2),
                "supportNeed": round_value(row[SUPPORT_NEED], 2),
                "visibility": round_value(row[VISIBILITY], 2),
                "foundationalCapacityAdjusted": round_value(
                    row[FOUNDATIONAL_ADJ], 2
                ),
                "earlySignalAdjusted": round_value(
                    row[EARLY_SIGNAL_ADJ], 2
                ),
                "qualityAdjusted": round_value(
                    row[QUALITY_ADJ], 2
                ),
                "supportNeedAdjusted": round_value(
                    row[SUPPORT_NEED_ADJ], 2
                ),
                "publicationVolume": round_value(
                    row["publication_volume_index_0_100"], 2
                ),
                "logTextLength": round_value(
                    math.log1p(row["total_extracted_text_length"]), 3
                ),
                "usableDocumentCount": int_value(row["usable_document_count"]),
                "websiteDocumentCount": int_value(row["website_document_count"]),
                "pdfDocumentCount": int_value(row["pdf_document_count"]),
                "tier": key,
                "group": key,
                "tierLabel": row["support_priority_label"],
                "supportNeedRank": int_value(row["support_need_rank"]),
                "supportNeedPercentile": round_value(row["support_need_percentile"], 2),
            }
        )

    source_stats = parse_scraping_log()
    metrics = [
        (
            "foundationalCapacity",
            "Foundational AI Implementation Capacity",
            FOUNDATIONAL,
            "Basic capacity to absorb future AI funding.",
        ),
        (
            "earlySignal",
            "Early AI-Specific Signal",
            EARLY_SIGNAL,
            "Direct AI-related public evidence, treated cautiously because policy implementation is still early.",
        ),
        (
            "quality",
            "AI Quality of Use",
            QUALITY,
            "Public signals of deeper AI use beyond simple mentions.",
        ),
        (
            "supportNeed",
            "Early-Warning Support Need",
            SUPPORT_NEED,
            "Candidate need for validation, teacher support, governance support, infrastructure support, or contextual support.",
        ),
        (
            "visibility",
            "Evidence Confidence / Publication Visibility",
            VISIBILITY,
            "How much public evidence is visible, so publication practice is not confused with school quality.",
        ),
    ]
    headline = [
        {
            "key": key,
            "label": label,
            "value": round_value(ai[column].mean(), 2),
            "median": round_value(ai[column].median(), 2),
            "suffix": "/ 100",
            "meaning": meaning,
        }
        for key, label, column, meaning in metrics
    ]

    stats_by_metric = {
        row["metric"]: row.to_dict() for _, row in distribution_stats.iterrows()
    }
    metadata = {
        "headlineMetrics": headline,
        "sourceStats": {
            "schoolsInAnalysis": len(ai),
            "schoolsWithCollectedWebsites": source_stats.get(
                "successfulSchoolWebsites"
            ),
            "htmlPages": source_stats.get("htmlPagesSaved"),
            "pdfs": source_stats.get("pdfsSaved"),
            "usableDocuments": source_stats.get("usableDocuments"),
            "cleanedEvidenceItems": len(evidence),
        },
        "percentileTiers": {
            "tier1": "Top 10% support need",
            "tier2": "Next 15%",
            "tier3": "Middle 50%",
            "tier4": "Lowest 25%",
        },
        "gini": {
            "foundationalCapacity": round_value(stats_by_metric[FOUNDATIONAL]["gini"], 3),
            "earlySignal": round_value(stats_by_metric[EARLY_SIGNAL]["gini"], 3),
            "quality": round_value(stats_by_metric[QUALITY]["gini"], 3),
            "supportNeed": round_value(stats_by_metric[SUPPORT_NEED]["gini"], 3),
            "visibility": round_value(stats_by_metric[VISIBILITY]["gini"], 3),
        },
        "verificationNote": "Headline values are generated from the updated support-prioritisation index files.",
    }

    tiers = build_tiers(tier_counts)
    support_groups = {
        "supportPriorityCounts": [
            {"label": row["fullLabel"], "count": row["count"], "key": row["key"]}
            for row in tiers
        ],
        "supportTiers": tiers,
    }

    district_merged = district.merge(
        district_adjusted[
            [
                "district",
                "mean_publication_volume",
                "mean_foundational_capacity_publication_adjusted",
                "mean_early_ai_signal_publication_adjusted",
                "mean_support_need_publication_adjusted",
                "mean_support_need_with_context_publication_adjusted",
            ]
        ],
        on="district",
        how="left",
    )
    district_summary = []
    for _, row in district_merged.iterrows():
        district_summary.append(
            {
                "district": row["district"],
                "schools": int_value(row["schools"]),
                "meanFoundationalCapacity": round_value(
                    row["mean_foundational_capacity"], 2
                ),
                "meanEarlySignal": round_value(row["mean_early_ai_signal"], 2),
                "meanQuality": round_value(row["mean_quality"], 2),
                "meanSupportNeed": round_value(row["mean_support_need"], 2),
                "meanVisibility": round_value(row["mean_visibility"], 2),
                "meanSupportNeedWithContext": round_value(
                    row["mean_support_need_with_context"], 2
                ),
                "meanPublicationVolume": round_value(
                    row["mean_publication_volume"], 2
                ),
                "meanFoundationalCapacityAdjusted": round_value(
                    row["mean_foundational_capacity_publication_adjusted"], 2
                ),
                "meanEarlySignalAdjusted": round_value(
                    row["mean_early_ai_signal_publication_adjusted"], 2
                ),
                "meanSupportNeedAdjusted": round_value(
                    row["mean_support_need_publication_adjusted"], 2
                ),
                "meanSupportNeedWithContextAdjusted": round_value(
                    row["mean_support_need_with_context_publication_adjusted"], 2
                ),
                "tier1SupportSchools": int_value(row["tier_1_support_schools"]),
                "tier1Or2SupportSchools": int_value(
                    row["tier_1_or_2_support_schools"]
                ),
                "tier1SupportShare": round_value(row["tier_1_support_share"] * 100, 1),
                "tier1Or2SupportShare": round_value(
                    row["tier_1_or_2_support_share"] * 100, 1
                ),
            }
        )

    wanted_corr = {
        (VISIBILITY, FOUNDATIONAL),
        (VISIBILITY, SUPPORT_NEED),
        ("publication_volume_index_0_100", FOUNDATIONAL),
        ("publication_volume_index_0_100", SUPPORT_NEED),
        ("total_extracted_text_length", FOUNDATIONAL),
        ("total_extracted_text_length", SUPPORT_NEED),
    }
    pub_corr_rows = []
    for _, row in visibility_corr.iterrows():
        if (row["publication_control"], row["outcome"]) in wanted_corr:
            pub_corr_rows.append(
                {
                    "publicationControl": row["publication_control"],
                    "outcome": row["outcome"],
                    "n": int_value(row["n"]),
                    "spearmanRho": round_value(row["spearman_rho"], 3),
                    "pValue": round_value(row["p_value"], 4),
                }
            )

    publication_bias_payload = {
        "correlations": pub_corr_rows,
        "scatterPoints": [
            {
                "pointId": item["pointId"],
                "publicationVolume": item["publicationVolume"],
                "visibility": item["visibility"],
                "logTextLength": item["logTextLength"],
                "foundationalCapacity": item["foundationalCapacity"],
                "foundationalCapacityAdjusted": item[
                    "foundationalCapacityAdjusted"
                ],
                "supportNeed": item["supportNeed"],
                "supportNeedAdjusted": item["supportNeedAdjusted"],
                "district": item["district"],
            }
            for item in school_indices
        ],
    }

    ml_payload = [
        {
            "model": row["model"],
            "target": row["target"],
            "holdoutR2": round_value(row.get("holdout_r2"), 4),
            "holdoutRocAuc": round_value(row.get("holdout_roc_auc"), 4),
            "cvRocAucMean": round_value(row.get("cv_roc_auc_mean"), 4),
        }
        for _, row in ml.iterrows()
    ]

    write_json("metadata.json", metadata)
    write_json("school_indices.json", school_indices)
    write_json("district_summary.json", district_summary)
    write_json(
        "readiness_dimensions.json",
        format_dimension_rows(foundational_dimensions, "foundationalCapacity"),
    )
    write_json(
        "implementation_dimensions.json",
        format_dimension_rows(early_signal_dimensions, "earlySignal"),
    )
    write_json("support_groups.json", support_groups)
    write_json("publication_bias.json", publication_bias_payload)
    write_json("ml_summary.json", ml_payload)

    print(f"Wrote normalized web-story data to {OUT_DIR}")
    print(
        "Verified updated support-prioritisation data: "
        f"{len(ai)} schools, "
        f"{metadata['sourceStats']['htmlPages']} HTML pages, "
        f"{metadata['sourceStats']['pdfs']} PDFs, "
        f"{metadata['sourceStats']['cleanedEvidenceItems']} cleaned evidence items."
    )


if __name__ == "__main__":
    build_data()
