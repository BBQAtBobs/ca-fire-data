export interface StationCount {
  city?: number;
  airport?: number;
  other?: number;
  other_label?: string;
  total_note?: string;
}

export interface IncidentVolume {
  total?: number;
  total_label?: string;
  ems?: number;
  ems_label?: string;
  transports?: number;
  transports_label?: string;
  year?: number | string;
  note?: string;
}

export interface SpecialOp {
  name: string;
  detail: string;
}

export interface SourceLink {
  label: string;
  url: string;
  type?: string;
}

export interface Department {
  slug: string;
  name: string;
  short_name: string;
  governance: "city_department" | "fire_district" | "jpa" | "county_agency";
  governance_label: string;
  governance_note?: string;
  county: string;
  jurisdiction: string;
  jurisdiction_note?: string;

  station_count: StationCount;
  ems_service_level: "als_transport" | "als_non_transport" | "als_alliance";
  ems_label: string;
  ems_note?: string;

  top_step_monthly: number;
  top_step_annual: number;
  top_step_classification: string;
  top_step_effective: string;
  top_step_note?: string;
  mou_term?: string;
  mou_status?: "current" | "expired" | "unknown";

  retirement_system: string;
  retirement_formula_current_hire: string;
  retirement_formula_classic?: string;
  retirement_note?: string;

  sworn_staffing: number | null;
  sworn_staffing_label: string;
  sworn_staffing_source: string;
  sworn_staffing_note?: string;

  work_schedule?: string;
  work_schedule_note?: string;

  battalion_count?: number;
  battalion_description?: string;
  battalion_note?: string;

  incident_volume?: IncidentVolume;

  special_operations?: SpecialOp[];

  sources: SourceLink[];
  extracted_date: string;
}

export const departments: Department[] = [
  {
    slug: "san-francisco",
    name: "San Francisco Fire Department",
    short_name: "SFFD",
    governance: "city_department",
    governance_label: "City Department",
    governance_note:
      "Consolidated city-county. Governed by 5-member Fire Commission.",
    county: "San Francisco",
    jurisdiction: "City and County of San Francisco, including SFO and Treasure Island",
    jurisdiction_note: "49 square miles. Also provides suppression/EMS to Presidio via cooperative agreements.",

    station_count: {
      city: 44,
      airport: 3,
      other: 1,
      other_label: "Treasure Island (Station 48)",
      total_note:
        "Operations page states 43 stations housing 43 engine companies; org chart lists 44 city station numbers. Discrepancy preserved.",
    },

    ems_service_level: "als_transport",
    ems_label: "ALS Transport",
    ems_note:
      "SFFD operates its own ALS ambulance fleet. $167M in ambulance billings budgeted FY25. Private provider King American handles non-emergency/IFT.",

    top_step_monthly: 12660,
    top_step_annual: 151918,
    top_step_classification: 'H002 "Firefighter" — Step 7',
    top_step_effective: "July 1, 2025",
    top_step_note:
      "Separate from H003 EMT/Paramedic/Firefighter classification. SF does not use a paramedic premium — paramedics are a separate classification.",
    mou_term: "July 2023 – June 2026",
    mou_status: "current",

    retirement_system: "SFERS",
    retirement_formula_current_hire: "3% @ 55 (Tier III)",
    retirement_formula_classic: "3% @ 55 (Tier I)",
    retirement_note:
      "Not CalPERS. San Francisco has its own retirement system (SFERS). Highest 3 consecutive fiscal years.",

    sworn_staffing: 1638,
    sworn_staffing_label: "1,638 authorized uniform FTEs",
    sworn_staffing_source: "SFFD Budget Book FY25-26, p.62-63",
    sworn_staffing_note:
      "Operations uniform positions only. ~168 vacancies indicated by attrition line. Does not include Airport (95 personnel), Prevention, Admin, Training, or civilian positions.",

    work_schedule: "24-hour shifts (0800–0800), 48.7-hr avg week",
    work_schedule_note:
      "Specific platoon rotation name not stated in MOU. 31-day tour of duty cycle.",

    battalion_count: 10,
    battalion_description:
      "2 divisions (Div 2, Div 3), 10 numbered battalions (1–10), plus Airport Division",
    battalion_note:
      'Operations page states "9 Battalions" but org chart shows 10 numbered battalion positions. Discrepancy preserved.',

    incident_volume: {
      ems: 130000,
      ems_label: "130,000+ medical calls/year",
      note: "Undated figure from SFFD EMS division page. No year-specific total incident count found. Most recent published annual report is FY 2012-13.",
    },

    special_operations: [
      { name: "Hazmat", detail: "Dedicated 24-hr team at Station 6" },
      {
        name: "USAR / Technical Rescue",
        detail: "2 rescue squads, CA-TF3 (FEMA task force), trench/confined space",
      },
      { name: "Dive Team", detail: "Dedicated unit" },
      {
        name: "Coastal / Surf Rescue",
        detail: "2 coastal rescue units, 300+ rescue swimmers, cliff rescue",
      },
      { name: "K-9 Search", detail: "4 canine teams (part of CA-TF3)" },
      { name: "Drone Unit", detail: "Dedicated unit" },
      {
        name: "ARFF",
        detail: "Airport Division — 4 ARFF vehicles, FAA-certified, hazmat tech qualified",
      },
      {
        name: "Marine",
        detail: "2 fireboats",
      },
    ],

    sources: [
      { label: "SFFD Budget Book FY25-26", url: "https://www.sf.gov/sites/default/files/2024-02/SFFD%20Budget%20Book%20FY25%20FY26%20240214%20FC.pdf", type: "budget" },
      { label: "Local 798 MOU 2023-2026", url: "https://www.sf.gov/sites/default/files/2024-01/fire-fighters-union-local-798-unit-1-2023-2026.pdf", type: "mou" },
      { label: "H002 Salary Schedule", url: "https://careers.sf.gov/classifications/?classCode=H002", type: "salary" },
      { label: "SFERS Tier III Provisions", url: "https://cdn.mysfers.org/uploads/2026/02/Plan-Provisions-Fire-604-2026.pdf", type: "retirement" },
      { label: "SFFD Operations", url: "https://sf-fire.org/about-sffd-operations", type: "website" },
      { label: "SFFD Special Operations", url: "https://sf-fire.org/our-organization/special-operations", type: "website" },
      { label: "SFFD EMS Division", url: "https://sf-fire.org/our-organization/division-emergency-medical-services", type: "website" },
      { label: "SFFD Careers", url: "https://sf-fire.org/employment-opportunities", type: "careers" },
    ],
    extracted_date: "2026-03-28",
  },

  {
    slug: "contra-costa-county",
    name: "Contra Costa County Fire Protection District",
    short_name: "ConFire",
    governance: "fire_district",
    governance_label: "Fire Protection District",
    governance_note:
      "Independent special district. County Board of Supervisors serves as Board of Directors — unusual governance. 10-member Advisory Fire Commission. Formed 1964.",
    county: "Contra Costa",
    jurisdiction:
      "13 incorporated cities + unincorporated communities across central and east Contra Costa County",
    jurisdiction_note:
      "Cities: Antioch, Brentwood, Clayton, Concord, Hercules (eff. 7/1/2025), Lafayette, Martinez, Oakley, Pinole, Pittsburg, Pleasant Hill, San Pablo, Walnut Creek. Recent annexations: East CCC FPD (2022), Rodeo-Hercules FPD (2025). 790,000+ residents, 582 sq mi (may include ambulance service area).",

    station_count: {
      city: 35,
      total_note:
        "Official site states 35 stations, 41 companies. Non-sequential numbering reflects historical consolidations. May not yet reflect Rodeo-Hercules annexation (7/1/2025). Byron Wildland Fire Center (2024) not counted as a traditional station.",
    },

    ems_service_level: "als_alliance",
    ems_label: "ALS Transport (Alliance model)",
    ems_note:
      "ConFire holds ambulance franchise and transporter-of-record status. AMR operates as subcontractor providing ambulance units and paramedic staffing (since 1/1/2016). Fire engines are ALS with at least 1 paramedic per engine.",

    top_step_monthly: 10845,
    top_step_annual: 130142,
    top_step_classification: 'RPWA "Firefighter/56 Hour" — top step',
    top_step_effective: "August 1, 2023 (Attachment A base rate)",
    top_step_note:
      "MOU §5.1 provides scheduled ATB increases: +5% on 7/1/2024, +5% on 7/1/2025, +5% on 7/1/2026. Current effective rate (~$11,957/mo) requires applying those increases to the Attachment A base.",
    mou_term: "July 2023 – June 2027",
    mou_status: "current",

    retirement_system: "CCCERA",
    retirement_formula_current_hire: "2.7% @ 57 (PEPRA)",
    retirement_formula_classic: "3% @ 50 (Tier A)",
    retirement_note:
      "Not CalPERS. Contra Costa County has its own retirement system (CCCERA). Tier A: 12-month final comp average, 3% COLA cap. PEPRA: 2% COLA cap (banked).",

    sworn_staffing: 670,
    sworn_staffing_label: "670+ total employees (sworn + civilian)",
    sworn_staffing_source: "cccfpd.org",
    sworn_staffing_note:
      "No sworn/civilian breakdown published. Minimum daily suppression staffing: 77 personnel. May not yet reflect Rodeo-Hercules annexation.",

    work_schedule:
      "Kelly schedule (24-on/24-off/24-on/24-off/24-on/4 days off)",
    work_schedule_note:
      "Explicitly named and defined in MOU §8.1.E. 56-hour average work week. 3-platoon system (A/B/C shifts).",

    battalion_count: 5,
    battalion_description:
      "5 geographic battalions + 4 specialty BCs (EMS, Training/Safety, Wildland Ops, Special Ops). 19 total BCs.",
    battalion_note:
      "Only 3 of 5 geographic battalions partially identified from public sources (Bn 2, 7, 8). Full station-to-battalion mapping not published.",

    incident_volume: {
      total: 133452,
      total_label: "133,452 total calls dispatched",
      transports: 84861,
      transports_label: "84,861 emergency ambulance transports",
      year: 2024,
      note: "From Office of Fire Chief page. Year-specific and authoritative.",
    },

    special_operations: [
      {
        name: "Hazmat",
        detail: "Type 1 HazMat team; all suppression staff FRO-trained",
      },
      {
        name: "Technical Rescue",
        detail: "Low/high angle, confined space, trench rescue",
      },
      {
        name: "Water Rescue",
        detail: "Swift water teams (Stations 81, 10); Fire Boat 8 (Pittsburg Marina)",
      },
      {
        name: "USAR",
        detail: "Personnel on CA-TF4 (FEMA task force)",
      },
      {
        name: "Wildland",
        detail:
          "Dedicated Wildland Ops BC, Byron Wildland Fire Center, Dozer 220 program (250+ mi fire trails), seasonal helicopter contract",
      },
    ],

    sources: [
      { label: "Local 1230 MOU 2023-2027", url: "https://www.contracosta.ca.gov/DocumentCenter/View/67730/2023-2027-1230-MOU-", type: "mou" },
      { label: "CCCERA Tier Structure", url: "https://www.cccera.gov/retirement-tier-structure", type: "retirement" },
      { label: "ConFire Operations", url: "https://www.cccfpd.org/212/Operations", type: "website" },
      { label: "ConFire Fire/Rescue", url: "https://www.cccfpd.org/216/Fire-Rescue", type: "website" },
      { label: "ConFire Ambulance FAQ", url: "https://www.cccfpd.org/215", type: "website" },
      { label: "Office of Fire Chief", url: "https://www.cccfpd.org/159/Office-of-the-Fire-Chief", type: "website" },
      { label: "ConFire Careers", url: "https://www.cccfpd.org/161/Careers-at-Contra-Costa-Fire", type: "careers" },
    ],
    extracted_date: "2026-03-28",
  },

  {
    slug: "vallejo",
    name: "Vallejo Fire Department",
    short_name: "Vallejo FD",
    governance: "city_department",
    governance_label: "City Department",
    governance_note:
      "Charter city in Solano County. Filed Chapter 9 bankruptcy May 2008, emerged November 2011. Department has had 5 fire chiefs or interim chiefs since mid-2024.",
    county: "Solano",
    jurisdiction: "City of Vallejo",
    jurisdiction_note:
      "Population ~121,000-126,000. 30.4 sq mi land area (48.3 sq mi total including 17.9 sq mi water — Mare Island, Carquinez Strait).",

    station_count: {
      city: 7,
      total_note:
        'City website lists Stations 21-27. Sources variously state 6, 7, or 8 stations depending on date. Pre-bankruptcy: 8 stations; dropped to 4 during bankruptcy. Station 26 (Glen Cove) reopened ~2021.',
    },

    ems_service_level: "als_non_transport",
    ems_label: "ALS First-Response (Non-Transport)",
    ems_note:
      "Vallejo Fire provides ALS first-response with paramedic-staffed engines. Medic Ambulance is the exclusive 911/ALS transport provider for Solano County. Solano EMS governance in flux (SEMSC dissolving).",

    top_step_monthly: 10244,
    top_step_annual: 122929,
    top_step_classification: '"Fire Fighter (56.3 hr)" — Step 5',
    top_step_effective: "April 23, 2025",
    top_step_note:
      "Firefighter/Paramedic receives ~5.8% specialty premium on top of base (exact % in MOU, which was not directly accessible). MOU PDF behind dynamic CMS portal.",
    mou_term: "~FY 2022-23 through FY 2025-26",
    mou_status: "current",

    retirement_system: "CalPERS",
    retirement_formula_current_hire: "2.7% @ 57 (PEPRA)",
    retirement_formula_classic: "3% @ 50 (Classic Tier 1)",
    retirement_note:
      "Three tiers: Classic Tier 1 (3%@50), Classic Tier 2 (2%@50), PEPRA (2.7%@57). Pensions were not impaired during bankruptcy.",

    sworn_staffing: 85,
    sworn_staffing_label: "85 authorized sworn FTEs",
    sworn_staffing_source: "FY 2025-26 Adopted Budget",
    sworn_staffing_note:
      "85 sworn + 8 unsworn = 93 total. Down from 100 sworn in FY22-23. Department was 97% staffed with 88 of 90 slots filled at time of budget preparation.",

    work_schedule: "56.3-hour average work week, 3-shift system",
    work_schedule_note:
      "Specific rotation pattern (24/48, 48/96, Kelly, etc.) not stated in any publicly accessible source.",

    battalion_count: 1,
    battalion_description:
      "Single battalion per shift. 3 suppression BCs + 1 training BC.",

    incident_volume: {
      total_label: "16,000–18,500+ annually",
      note: 'City website says "16,000+"; GovernmentJobs posting (~Oct 2024) says "18,500+". No year-specific authoritative figure.',
    },

    sources: [
      { label: "IAFF Salary Schedule (eff. 4/23/2025)", url: "https://www.cityofvallejo.net/common/pages/GetFile.ashx?key=4y0/ASPT", type: "salary" },
      { label: "FY 2025-26 Adopted Budget", url: "https://www.cityofvallejo.net/common/pages/GetFile.ashx?key=bpJAAdFs", type: "budget" },
      { label: "Labor Agreements Page", url: "https://www.cityofvallejo.net/our_city/departments_divisions/human_resources_department/employment_labor_agreements", type: "mou" },
      { label: "Fire Department", url: "https://www.cityofvallejo.net/our_city/departments_divisions/fire_department", type: "website" },
      { label: "Fire Recruitment", url: "https://www.vallejo.gov/our_city/departments_divisions/fire_department/fire_recruitment", type: "careers" },
      { label: "Medic Ambulance — Solano", url: "https://www.medicambulance.net/solano-division", type: "website" },
    ],
    extracted_date: "2026-03-28",
  },
];

export function getDepartment(slug: string): Department | undefined {
  return departments.find((d) => d.slug === slug);
}

export function getTotalStations(d: Department): number {
  const sc = d.station_count;
  return (sc.city ?? 0) + (sc.airport ?? 0) + (sc.other ?? 0);
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export const governanceColors: Record<string, string> = {
  city_department: "bg-blue-100 text-blue-800",
  fire_district: "bg-amber-100 text-amber-800",
  jpa: "bg-emerald-100 text-emerald-800",
  county_agency: "bg-purple-100 text-purple-800",
};

export const emsColors: Record<string, string> = {
  als_transport: "bg-emerald-100 text-emerald-800",
  als_non_transport: "bg-sky-100 text-sky-800",
  als_alliance: "bg-violet-100 text-violet-800",
};
