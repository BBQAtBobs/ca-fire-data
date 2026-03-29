// Mock data for the logged-in dashboard prototype
// In production, this comes from a database + auth provider

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issued_date: string;
  expiration_date: string;
  status: "active" | "expiring_soon" | "expired";
  days_remaining: number;
}

export interface Application {
  id: string;
  department_slug: string;
  department_name: string;
  department_short: string;
  stage: "researching" | "applied" | "testing" | "interview" | "offer";
  stage_label: string;
  updated: string;
  notes?: string;
}

export interface ChangeAlert {
  id: string;
  department_slug: string;
  department_short: string;
  message: string;
  date: string;
  read: boolean;
}

export interface SavedComparison {
  id: string;
  name: string;
  department_slugs: string[];
  created: string;
}

export interface MockUser {
  name: string;
  email: string;
  plan: "free" | "pro";
  following: string[]; // department slugs
  certifications: Certification[];
  applications: Application[];
  changes: ChangeAlert[];
  comparisons: SavedComparison[];
}

export const mockUser: MockUser = {
  name: "Bob",
  email: "bob@example.com",
  plan: "pro",
  following: ["san-francisco", "contra-costa-county", "vallejo"],

  certifications: [
    {
      id: "cert-1",
      name: "CPAT",
      issuer: "CPAT Testing Center",
      issued_date: "2025-11-15",
      expiration_date: "2026-05-15",
      status: "expiring_soon",
      days_remaining: 47,
    },
    {
      id: "cert-2",
      name: "EMT-Paramedic",
      issuer: "Contra Costa County EMS Agency",
      issued_date: "2024-10-08",
      expiration_date: "2026-10-08",
      status: "active",
      days_remaining: 193,
    },
    {
      id: "cert-3",
      name: "FCTC Written Exam",
      issuer: "FCTC",
      issued_date: "2025-09-20",
      expiration_date: "2026-09-20",
      status: "active",
      days_remaining: 175,
    },
    {
      id: "cert-4",
      name: "Firefighter I",
      issuer: "CA State Fire Marshal",
      issued_date: "2024-06-15",
      expiration_date: "",
      status: "active",
      days_remaining: -1, // no expiration
    },
    {
      id: "cert-5",
      name: "CA Driver's License (Class C)",
      issuer: "CA DMV",
      issued_date: "2023-03-10",
      expiration_date: "2028-03-10",
      status: "active",
      days_remaining: 711,
    },
  ],

  applications: [
    {
      id: "app-1",
      department_slug: "san-francisco",
      department_name: "San Francisco Fire Department",
      department_short: "SFFD",
      stage: "testing",
      stage_label: "Testing",
      updated: "2026-03-22",
      notes: "Written exam scheduled March 22. Physical agility TBD.",
    },
    {
      id: "app-2",
      department_slug: "contra-costa-county",
      department_name: "Contra Costa County Fire Protection District",
      department_short: "ConFire",
      stage: "researching",
      stage_label: "Researching",
      updated: "2026-03-15",
      notes: "No current open recruitment. Check back Q3.",
    },
    {
      id: "app-3",
      department_slug: "vallejo",
      department_name: "Vallejo Fire Department",
      department_short: "Vallejo FD",
      stage: "applied",
      stage_label: "Applied",
      updated: "2026-03-01",
      notes: "Application submitted. Waiting for candidate list notification.",
    },
  ],

  changes: [
    {
      id: "chg-1",
      department_slug: "san-francisco",
      department_short: "SFFD",
      message: "Salary schedule updated — H002 Step 7 now $73.04/hr (eff. July 1, 2025)",
      date: "2026-03-15",
      read: false,
    },
    {
      id: "chg-2",
      department_slug: "contra-costa-county",
      department_short: "ConFire",
      message: "New data extraction completed — profile refreshed with 2024 call volume data",
      date: "2026-03-10",
      read: false,
    },
    {
      id: "chg-3",
      department_slug: "vallejo",
      department_short: "Vallejo FD",
      message: "FY 2025-26 budget data added — authorized staffing updated to 85 sworn FTEs",
      date: "2026-02-28",
      read: true,
    },
  ],

  comparisons: [
    {
      id: "comp-1",
      name: "NorCal ALS Departments",
      department_slugs: ["san-francisco", "contra-costa-county"],
      created: "2026-03-05",
    },
    {
      id: "comp-2",
      name: "All Pilot Departments",
      department_slugs: ["san-francisco", "contra-costa-county", "vallejo"],
      created: "2026-03-01",
    },
  ],
};

export const stageOrder = [
  "researching",
  "applied",
  "testing",
  "interview",
  "offer",
] as const;

export const stageColors: Record<string, string> = {
  researching: "bg-stone-100 text-stone-600",
  applied: "bg-blue-100 text-blue-700",
  testing: "bg-amber-100 text-amber-800",
  interview: "bg-purple-100 text-purple-700",
  offer: "bg-emerald-100 text-emerald-700",
};
