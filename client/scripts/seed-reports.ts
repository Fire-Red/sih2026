import { db } from "../lib/db";
import { problemReports, problemEvidence } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function runSeed() {
  console.log("Seeding authentic Jharkhand societal problem reports into Neon PostgreSQL...");

  const testReports = [
    {
      title: "Fluoride Contamination in Handpump Groundwater at Satbarwa",
      description: "Severe dental and skeletal fluorosis observed in children. 14 out of 18 community borewells testing fluoride levels above 3.5 mg/L, far exceeding the WHO 1.5 mg/L threshold.",
      category: "water_sanitation" as const,
      subcategory: "Fluoride / Arsenic Contamination",
      severity: "critical" as const,
      affectedPopulationEstimate: 850,
      state: "Jharkhand",
      district: "Palamu",
      blockOrPanchayat: "Satbarwa Block, Panchayat Bhawan Ward 3",
      pinCode: "822126",
      latitude: "23.9182",
      longitude: "84.2255",
      formattedAddress: "Village Satbarwa, Palamu, Jharkhand - 822126",
      status: "assigned_to_hei" as const,
      endorsementCount: 47,
      assignedInstitutionName: "Birsa Agricultural University (BAU) & BIT Mesra",
      assignedProjectTitle: "Solar-Assisted Electrocoagulation Water Fluoride Remediation",
    },
    {
      title: "Monsoon Gully Erosion and Washed-Away Culvert on Rural Livelihood Road",
      description: "A 40-foot culvert washed out during heavy rainfall, isolating 4 tribal villages from the weekly Haat market and health sub-centre transit.",
      category: "rural_infrastructure" as const,
      subcategory: "Damaged Culvert / Bridge",
      severity: "high" as const,
      affectedPopulationEstimate: 1200,
      state: "Jharkhand",
      district: "Gumla",
      blockOrPanchayat: "Bishunpur Block",
      pinCode: "835331",
      latitude: "23.3812",
      longitude: "84.3615",
      formattedAddress: "Bishunpur Rural Road KM 12, Gumla, Jharkhand",
      status: "validated" as const,
      endorsementCount: 29,
      assignedInstitutionName: "National Institute of Technology (NIT) Jamshedpur",
      assignedProjectTitle: "Rapid Modular Geopolymer Concrete Culvert Pre-Fabrication",
    },
    {
      title: "Soil Acidity and Non-Aerated Paddy Field Distress",
      description: "Acidic soil (pH 4.8) leading to aluminium toxicity and 40% reduction in upland paddy yield across 220 hectares of farmer plots.",
      category: "agriculture_irrigation" as const,
      subcategory: "Soil Acidification / Degradation",
      severity: "high" as const,
      affectedPopulationEstimate: 450,
      state: "Jharkhand",
      district: "Ranchi",
      blockOrPanchayat: "Kanke Block",
      pinCode: "834006",
      latitude: "23.4350",
      longitude: "85.3210",
      formattedAddress: "Kanke Agri Cluster, Ranchi, Jharkhand - 834006",
      status: "fused_clustered" as const,
      endorsementCount: 18,
      assignedInstitutionName: "Birsa Agricultural University (BAU)",
      assignedProjectTitle: "Biochar & Basic Slag Soil Amelioration Field Trials",
    },
  ];

  for (const item of testReports) {
    const [inserted] = await db.insert(problemReports).values(item).returning();
    console.log(`✓ Seeded problem report [${inserted.id}]: ${inserted.title}`);

    // Seed Evidence
    await db.insert(problemEvidence).values({
      problemReportId: inserted.id,
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
      caption: "Groundwater discoloration and corroded borewell head",
    });
  }

  console.log("All sample problem reports seeded successfully.");
}

runSeed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });
