export interface CustomerIntelligenceRow {
  sNo: number | string
  customerNameCompanyName: string
  businessOverview: string
  industryVertical: string
  totalAnnualRevenue: string
  customerSizeScale: string
  keyContactPerson: string
  designationRole: string
  emailAddress: string
  phoneWhatsappNumber: string
  linkedInProfile: string
  websiteUrl: string
  keyBuyingCriteria?: string
  keyPainPoints?: string
  upcomingTriggersAndInitiatives?: string
  budgetOwnership?: string
  procurementModel?: string
  preferredEngagementType?: string
  preferredSolutionType?: string
  preferredDeploymentModel?: string
  performanceExpectations?: string
  customerBenchmarkingSummary?: string
  additionalCommentsNotes?: string
}

export interface CustomerIntelligenceProposition {
  id: string
  label: string
  titleLines: string[]
  rows: CustomerIntelligenceRow[]
}

export interface CustomerIntelligenceData {
  marketTitle: string
  subtitle: string
  entityNote?: string
  proposition1: CustomerIntelligenceProposition
  proposition2: CustomerIntelligenceProposition
  proposition3: CustomerIntelligenceProposition
}

export interface TableColumnGroup {
  label: string
  subLabel?: string
  colSpan: number
  headerClass: string
}

export interface TableColumn {
  key: keyof CustomerIntelligenceRow
  label: string
  headerClass: string
  minWidth?: string
  isLink?: 'email' | 'url'
}

export const CUSTOMER_INFO_COLUMNS: TableColumn[] = [
  { key: 'customerNameCompanyName', label: 'Customer Name/Company Name', headerClass: 'bg-[#FFF8DC]', minWidth: '180px' },
  { key: 'businessOverview', label: 'Business Overview', headerClass: 'bg-[#FFF8DC]', minWidth: '150px' },
  {
    key: 'industryVertical',
    label:
      'Industry Vertical (Automotive Manufacturing / Aerospace & Defense / Electronics & Semiconductor Manufacturing / Packaging & Converting / Metal Fabrication / Industrial Machinery Manufacturing / Medical Device Manufacturing / Textile Manufacturing / Woodworking & Furniture Manufacturing / Glass & Ceramics Processing / Rubber & Plastics Processing / Consumer Goods Manufacturing)',
    headerClass: 'bg-[#FFF8DC]',
    minWidth: '220px',
  },
  {
    key: 'totalAnnualRevenue',
    label: 'Total Annual Revenue (US$ Million)',
    headerClass: 'bg-[#FFF8DC]',
    minWidth: '180px',
  },
  {
    key: 'customerSizeScale',
    label:
      'Customer Size / Scale (Large enterprise (multi-location national/global) / Mid-size integrators/ Small single-location operator / Government authority)',
    headerClass: 'bg-[#FFF8DC]',
    minWidth: '200px',
  },
]

export const CONTACT_COLUMNS: TableColumn[] = [
  { key: 'keyContactPerson', label: 'Key Contact Person', headerClass: 'bg-[#B0E0E6]', minWidth: '130px' },
  { key: 'designationRole', label: 'Designation/Role', headerClass: 'bg-[#B0E0E6]', minWidth: '150px' },
  { key: 'emailAddress', label: 'Email Address', headerClass: 'bg-[#B0E0E6]', minWidth: '150px', isLink: 'email' },
  { key: 'phoneWhatsappNumber', label: 'Phone/WhatsApp Number', headerClass: 'bg-[#B0E0E6]', minWidth: '150px' },
  { key: 'linkedInProfile', label: 'LinkedIn Profile', headerClass: 'bg-[#B0E0E6]', minWidth: '150px', isLink: 'url' },
  { key: 'websiteUrl', label: 'Website URL', headerClass: 'bg-[#B0E0E6]', minWidth: '130px', isLink: 'url' },
]

export const PROFESSIONAL_DRIVERS_COLUMNS_BASIC: TableColumn[] = [
  {
    key: 'keyBuyingCriteria',
    label:
      'Key Buying Criteria (Spectral resolution (number of bands, wavelength accuracy)/Spatial resolution + frame rate (especially for snapshot systems like Living Optics)/Real-time processing capability/Size, weight, and power (SWaP optimization)/Integration capability (SDKs, APIs, AI pipelines)/Calibration accuracy & stability/Application-specific tuning (VNIR / SWIR / LWIR)/Reliability in harsh environments (defense, industrial)/Vendor technical support & customization capability)',
    headerClass: 'bg-[#B0E0E6]',
    minWidth: '220px',
  },
  {
    key: 'keyPainPoints',
    label:
      'Key Pain Points (High cost of hyperspectral systems/Trade-off between spectral vs spatial resolution/Large data volumes - processing/storage challenges/Integration complexity with existing vision systems/Limited real-time performance (for traditional pushbroom systems)/Calibration drift and maintenance issues/Lack of skilled personnel for spectral data interpretation/Power consumption constraints (especially UAV/drone use)/Fragmented vendor ecosystem)',
    headerClass: 'bg-[#B0E0E6]',
    minWidth: '220px',
  },
]

export const PROFESSIONAL_DRIVERS_COLUMNS_ADVANCE: TableColumn[] = [
  {
    key: 'keyBuyingCriteria',
    label:
      'Key Buying Criteria (Performance Requirements/Technical Requirements/Integration Requirements/Operational Requirements/Commercial Requirements/Vendor Evaluation Parameters)',
    headerClass: 'bg-[#B0E0E6]',
    minWidth: '200px',
  },
  {
    key: 'keyPainPoints',
    label:
      'Key Pain Points (Operational Challenges/Technical Challenges/Cost Challenges/Workforce Challenges/Manufacturing Challenges/Supply Chain Challenges)',
    headerClass: 'bg-[#B0E0E6]',
    minWidth: '200px',
  },
]

export const PROFESSIONAL_DRIVERS_COLUMNS_PREMIUM: TableColumn[] = [
  ...PROFESSIONAL_DRIVERS_COLUMNS_ADVANCE,
  {
    key: 'upcomingTriggersAndInitiatives',
    label:
      'Upcoming Triggers and Initiatives (Industry 4.0 Transformation Projects / Smart Factory Initiatives / Production Line Automation / Capacity Expansion / Equipment Replacement / New Product Launch / Regulatory Compliance Upgrade / Export Market Entry / Sustainability / Energy Efficiency Program)',
    headerClass: 'bg-[#B0E0E6]',
    minWidth: '220px',
  },
]

export const PURCHASING_BEHAVIOUR_COLUMNS: TableColumn[] = [
  {
    key: 'budgetOwnership',
    label:
      'Budget Ownership (Manufacturing Department / Engineering Department / Capital Investment Committee / Procurement Department / Plant Manager / Corporate HQ)',
    headerClass: 'bg-[#DDA0DD]',
    minWidth: '200px',
  },
  {
    key: 'procurementModel',
    label:
      'Procurement Model (Direct OEM Procurement / Authorized Distributor Procurement / System Integrator Procurement / Rental/Leasing Model / Service Contract Model)',
    headerClass: 'bg-[#DDA0DD]',
    minWidth: '200px',
  },
  {
    key: 'preferredEngagementType',
    label:
      'Preferred Engagement Type (Pilot Project / Proof-of-Concept Deployment / Production Line Integration Project / Long-Term Service Contract / Equipment Purchase Only)',
    headerClass: 'bg-[#DDA0DD]',
    minWidth: '200px',
  },
]

export const SOLUTION_REQUIREMENTS_COLUMNS: TableColumn[] = [
  {
    key: 'preferredSolutionType',
    label:
      'Preferred Solution Type (Standalone CO₂ Laser System / Integrated Laser Processing Module / OEM-Embedded Laser Source / Custom-Engineered Laser System / Multi-Process Laser Platform)',
    headerClass: 'bg-[#DEB887]',
    minWidth: '220px',
  },
  {
    key: 'preferredDeploymentModel',
    label:
      'Preferred Deployment Model (Standalone Factory Deployment / Production Line Integration / Robotic Cell Integration / Mobile Processing Unit / Multi-Site Standardized Deployment)',
    headerClass: 'bg-[#DEB887]',
    minWidth: '220px',
  },
  {
    key: 'performanceExpectations',
    label:
      'Performance Expectations (High Processing Speed / Precision Accuracy / Consistent Beam Quality / Low Maintenance Downtime / Energy Efficiency / Process Repeatability / Integration Flexibility / After-Sales Technical Support)',
    headerClass: 'bg-[#DEB887]',
    minWidth: '220px',
  },
]

export const CMI_INSIGHTS_COLUMNS: TableColumn[] = [
  {
    key: 'customerBenchmarkingSummary',
    label: 'Customer Benchmarking Summary (Potential Customers)',
    headerClass: 'bg-[#B0E0E6]',
    minWidth: '200px',
  },
  {
    key: 'additionalCommentsNotes',
    label: 'Additional Comments/Notes By CMI team',
    headerClass: 'bg-[#B0E0E6]',
    minWidth: '180px',
  },
]

export type PropositionTableConfig = {
  groups: TableColumnGroup[]
  columns: TableColumn[]
}

export const PROPOSITION_TABLE_CONFIG: Record<'proposition1' | 'proposition2' | 'proposition3', PropositionTableConfig> = {
  proposition1: {
    groups: [
      { label: 'Customer Information', colSpan: 5, headerClass: 'bg-[#E8C4A0]' },
      { label: 'Contact Details', colSpan: 6, headerClass: 'bg-[#87CEEB]' },
      { label: 'Professional Drivers', colSpan: 2, headerClass: 'bg-[#87CEEB]' },
    ],
    columns: [...CUSTOMER_INFO_COLUMNS, ...CONTACT_COLUMNS, ...PROFESSIONAL_DRIVERS_COLUMNS_BASIC],
  },
  proposition2: {
    groups: [
      { label: 'Customer Information', colSpan: 5, headerClass: 'bg-[#E8C4A0]' },
      { label: 'Contact Details', colSpan: 6, headerClass: 'bg-[#87CEEB]' },
      { label: 'Professional Drivers', colSpan: 2, headerClass: 'bg-[#87CEEB]' },
    ],
    columns: [...CUSTOMER_INFO_COLUMNS, ...CONTACT_COLUMNS, ...PROFESSIONAL_DRIVERS_COLUMNS_ADVANCE],
  },
  proposition3: {
    groups: [
      { label: 'Customer Information', colSpan: 5, headerClass: 'bg-[#E8C4A0]' },
      { label: 'Contact Details', colSpan: 6, headerClass: 'bg-[#87CEEB]' },
      { label: 'Professional Drivers', colSpan: 3, headerClass: 'bg-[#87CEEB]' },
      { label: 'Purchasing Behaviour Metrics', colSpan: 3, headerClass: 'bg-[#9370DB] text-white' },
      { label: 'Solution Requirements', colSpan: 3, headerClass: 'bg-[#D4A574]' },
      { label: 'CMI Insights', colSpan: 2, headerClass: 'bg-[#87CEEB]' },
    ],
    columns: [
      ...CUSTOMER_INFO_COLUMNS,
      ...CONTACT_COLUMNS,
      ...PROFESSIONAL_DRIVERS_COLUMNS_PREMIUM,
      ...PURCHASING_BEHAVIOUR_COLUMNS,
      ...SOLUTION_REQUIREMENTS_COLUMNS,
      ...CMI_INSIGHTS_COLUMNS,
    ],
  },
}

export async function loadCustomerIntelligenceData(): Promise<CustomerIntelligenceData> {
  const response = await fetch('/data/customer-intelligence.json')
  if (!response.ok) {
    throw new Error('Failed to load customer intelligence data')
  }
  return response.json()
}
