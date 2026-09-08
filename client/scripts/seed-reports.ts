import "dotenv/config";
import { db } from "../lib/db";
import {
  activeProjects,
  capabilityRequirements,
  governmentReviewEvents,
  impactMeasurements,
  impactVerifications,
  problemApplications,
  problemEmbeddings,
  problemEvidence,
  problemRelationships,
  problemReports,
  reportEndorsements,
  solutionMemory,
  studentTeams,
} from "../lib/db/schema";

const testReports = [
    {
      title: "Irregular drinking water supply near the market area",
      description: "Families report that the public water point works only once or twice a week, forcing people to collect water from a distant source.",
      category: "water_sanitation" as const,
      subcategory: "Public water supply",
      severity: "high" as const,
      affectedPopulationEstimate: 500,
      state: "Maharashtra",
      district: "Pune",
      blockOrPanchayat: "Market area",
      pinCode: "411001",
      latitude: "18.5204",
      longitude: "73.8567",
      status: "validated" as const,
    },
    {
      title: "Public tap remains dry for several days",
      description: "Residents near the bus stand describe the same unreliable water schedule and depend on private tankers when the public supply stops.",
      category: "water_sanitation" as const,
      subcategory: "Public water supply",
      severity: "high" as const,
      affectedPopulationEstimate: 600,
      state: "Maharashtra",
      district: "Pune",
      blockOrPanchayat: "Bus stand area",
      pinCode: "411002",
      latitude: "18.5314",
      longitude: "73.8446",
      status: "validated" as const,
    },
    {
      title: "Street lighting gaps around the evening market",
      description: "Several lights around the evening market are not working, making the pedestrian route difficult to use after sunset.",
      category: "energy_power" as const,
      subcategory: "Public lighting",
      severity: "medium" as const,
      affectedPopulationEstimate: 300,
      state: "Maharashtra",
      district: "Pune",
      blockOrPanchayat: "Evening market",
      pinCode: "411005",
      latitude: "18.5196",
      longitude: "73.8553",
      status: "submitted" as const,
    },
    {
      title: "Handpump water quality concern near the school",
      description: "Students and families are asking for testing of a handpump because the water has changed colour and taste during the last month.",
      category: "water_sanitation" as const,
      subcategory: "Water quality",
      severity: "high" as const,
      affectedPopulationEstimate: 420,
      state: "West Bengal",
      district: "Kolkata",
      blockOrPanchayat: "School neighbourhood",
      pinCode: "700001",
      latitude: "22.5726",
      longitude: "88.3639",
      status: "submitted" as const,
    },
    {
      title: "Overflowing waste collection point",
      description: "A shared collection point overflows before the next pickup, leaving waste on the road and affecting nearby shops.",
      category: "environment_waste" as const,
      subcategory: "Collection schedule",
      severity: "medium" as const,
      affectedPopulationEstimate: 250,
      state: "Karnataka",
      district: "Bengaluru Urban",
      blockOrPanchayat: "Ward collection point",
      pinCode: "560001",
      latitude: "12.9716",
      longitude: "77.5946",
      status: "submitted" as const,
    },
    {
      title: "Primary health centre transport is unreliable",
      description: "Older residents report difficulty reaching the primary health centre because the shared transport service is infrequent and not published clearly.",
      category: "healthcare_nutrition" as const,
      subcategory: "Access to care",
      severity: "high" as const,
      affectedPopulationEstimate: 700,
      state: "Odisha",
      district: "Cuttack",
      blockOrPanchayat: "Health centre route",
      pinCode: "753001",
      latitude: "20.4625",
      longitude: "85.8830",
      status: "submitted" as const,
    },
];

async function runSeed() {
  await db.delete(impactMeasurements);
  await db.delete(impactVerifications);
  await db.delete(solutionMemory);
  await db.delete(governmentReviewEvents);
  await db.delete(problemRelationships);
  await db.delete(problemEmbeddings);
  await db.delete(problemEvidence);
  await db.delete(problemApplications);
  await db.delete(activeProjects);
  await db.delete(capabilityRequirements);
  await db.delete(reportEndorsements);
  await db.delete(problemReports);
  await db.delete(studentTeams);

  for (const item of testReports) {
    const [inserted] = await db.insert(problemReports).values(item).returning({ id: problemReports.id });
    console.log(`Seeded problem report [${inserted.id}]: ${item.title}`);
  }

  console.log(`Reset workflow data and seeded ${testReports.length} neutral India wide reports.`);
}

runSeed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });
