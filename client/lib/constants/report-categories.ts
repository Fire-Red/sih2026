export const LOCAL_DISTRICTS = [
  "North district",
  "South district",
  "East district",
  "West district",
  "Central district",
  "Coastal district",
  "Hill district",
  "Valley district",
] as const;

export interface CategoryOption {
  id: string;
  name: string;
  subcategories: string[];
  description: string;
}

export const REPORT_CATEGORIES: CategoryOption[] = [
  {
    id: "water_sanitation",
    name: "Water & Sanitation",
    subcategories: [
      "Fluoride / Arsenic Contamination",
      "Broken Handpump / Tubewell",
      "Aquifer Depletion",
      "Untreated Sewage / Open Drainage",
      "Drinking Water Supply Disruption",
    ],
    description: "Groundwater contamination, failed supply schemes, or drainage blockages.",
  },
  {
    id: "agriculture_irrigation",
    name: "Agriculture & Irrigation",
    subcategories: [
      "Canal / Lift Irrigation Failure",
      "Soil Acidification / Degradation",
      "Crop Pest Infestation",
      "Post-Harvest Storage Deficit",
      "Drought Distress",
    ],
    description: "Crop loss, soil health, irrigation deficits, and farmer post-harvest distress.",
  },
  {
    id: "rural_infrastructure",
    name: "Rural Infrastructure",
    subcategories: [
      "Damaged Culvert / Bridge",
      "Unpaved Village Road / Erosion",
      "Public Facility Disrepair",
      "Flood Vulnerability",
    ],
    description: "Physical connectivity bottlenecks, washed away culverts, and unsafe infrastructure.",
  },
  {
    id: "healthcare_nutrition",
    name: "Healthcare & Nutrition",
    subcategories: [
      "Maternal & Child Malnutrition",
      "Primary Health Centre Medicine Shortage",
      "Vector-Borne Disease Outbreak",
      "Emergency Ambulance Transit Deficit",
    ],
    description: "Sub-centre deficits, endemic illnesses, and emergency medical access.",
  },
  {
    id: "education_skills",
    name: "Education & Skills",
    subcategories: [
      "School Lab / Digital Deficit",
      "Vocational Skill Mismatch",
      "High Dropout in Tribal Blocks",
      "Classroom Safety Deficit",
    ],
    description: "School infrastructure, STEM lab access, and tribal student skill pipelines.",
  },
  {
    id: "environment_waste",
    name: "Environment & Waste",
    subcategories: [
      "Mine Tailing & Slag Runoff",
      "Unregulated Plastic Waste Dumps",
      "Deforestation / Forest Fire",
      "Air Quality & Particulate Distress",
    ],
    description: "Industrial/mining runoff, ecological degradation, and hazardous waste.",
  },
  {
    id: "energy_power",
    name: "Energy & Power",
    subcategories: [
      "Unreliable Grid / Low Voltage",
      "Defunct Solar Mini-Grid",
      "Agricultural Feeder Tripping",
    ],
    description: "Off-grid microgrid failures, transformer burnout, and rural electrification.",
  },
  {
    id: "rural_livelihoods",
    name: "Rural Livelihoods",
    subcategories: [
      "Lac / Tussar Silk Value Chain Deficit",
      "Forest Produce Processing Bottleneck",
      "Artisan Market Access Deficit",
    ],
    description: "Minor forest produce processing, SHG market links, and tribal artisanal value chains.",
  },
];
