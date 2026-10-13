export interface DriverProfile {
  id: string;
  refCode: string;
  name: string;
  gender: "Male" | "Female";
  category: "Private Chauffeur" | "Commercial Transport" | "Heavy Equipment & Haulage" | "Corporate Executive";
  licenseClass: "Class B" | "Class C" | "Class D" | "Class F";
  experienceYears: number;
  electoralArea: string;
  rating: number;
  simulatorScore: number;
  status: "Available" | "Interviewing" | "Placed";
  specialties: string[];
}

export const SAMPLE_DRIVERS: DriverProfile[] = [
  {
    id: "drv-01",
    refCode: "KBD-DRV-1042",
    name: "Emmanuel K. Mensah",
    gender: "Male",
    category: "Corporate Executive",
    licenseClass: "Class B",
    experienceYears: 4,
    electoralArea: "Beach Road",
    rating: 4.9,
    simulatorScore: 98,
    status: "Available",
    specialties: ["Defensive Driving", "Executive Etiquette", "GPS Navigation", "Night Driving"],
  },
  {
    id: "drv-02",
    refCode: "KBD-DRV-1088",
    name: "Abena Serwaa Boateng",
    gender: "Female",
    category: "Private Chauffeur",
    licenseClass: "Class B",
    experienceYears: 3,
    electoralArea: "Chapel Hill",
    rating: 4.95,
    simulatorScore: 99,
    status: "Available",
    specialties: ["Family Chauffeur", "Automatic & Manual", "Child Road Safety", "School Runs"],
  },
  {
    id: "drv-03",
    refCode: "KBD-DRV-2015",
    name: "Francis Kwesi Arthur",
    gender: "Male",
    category: "Commercial Transport",
    licenseClass: "Class C",
    experienceYears: 5,
    electoralArea: "Railway & Harbour",
    rating: 4.85,
    simulatorScore: 96,
    status: "Available",
    specialties: ["Takoradi-Accra Corridor", "Ride-Hailing Expert", "Vehicle Maintenance", "Fuel Economy"],
  },
  {
    id: "drv-04",
    refCode: "KBD-DRV-2041",
    name: "Patricia Efua Addison",
    gender: "Female",
    category: "Corporate Executive",
    licenseClass: "Class B",
    experienceYears: 4,
    electoralArea: "Airport Ridge",
    rating: 4.92,
    simulatorScore: 97,
    status: "Available",
    specialties: ["VIP Escort", "Diplomatic Protocol", "Defensive Driving", "Tech-Savvy"],
  },
  {
    id: "drv-05",
    refCode: "KBD-DRV-3012",
    name: "Kwabena Appiah-Kubi",
    gender: "Male",
    category: "Heavy Equipment & Haulage",
    licenseClass: "Class D",
    experienceYears: 7,
    electoralArea: "Tanokrom",
    rating: 4.88,
    simulatorScore: 95,
    status: "Available",
    specialties: ["Port Container Haulage", "Mining Logistics", "Long-haul Night Shift", "Airbrake Systems"],
  },
  {
    id: "drv-06",
    refCode: "KBD-DRV-1102",
    name: "Grace Naa Korkoi",
    gender: "Female",
    category: "Commercial Transport",
    licenseClass: "Class C",
    experienceYears: 3,
    electoralArea: "Market Circle",
    rating: 4.91,
    simulatorScore: 97,
    status: "Available",
    specialties: ["Staff Bus Services", "School Transport", "Customer Service", "First Aid Certified"],
  },
];
