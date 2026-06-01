export interface CustomerIntelligenceRow {
  sNo: number | string
  customerNameCompanyName: string
  businessOverview: string
  exactCustomerType: string
  waferSortFinalTestUseCase: string
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
  vendorSelectionCriteria?: string
  preferredEngagementType?: string
  preferredDeploymentModel?: string
  preferredSolutionType?: string
  integrationTechnicalServiceRequirements?: string
  performanceExpectations?: string
  customerBenchmarkingSummary?: string
  additionalCommentsNotes?: string
  salesPrioritizationNote?: string
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
  {
    key: 'customerNameCompanyName',
    label: 'Customer or Company Name',
    headerClass: 'bg-[#FFF8DC]',
    minWidth: '180px',
  },
  { key: 'businessOverview', label: 'Business Overview', headerClass: 'bg-[#FFF8DC]', minWidth: '200px' },
  {
    key: 'exactCustomerType',
    label: 'Probe Card and Pogo Test Socket Exact Customer Type',
    headerClass: 'bg-[#FFF8DC]',
    minWidth: '220px',
  },
  {
    key: 'waferSortFinalTestUseCase',
    label: 'Wafer Sort and Final Test Use Case',
    headerClass: 'bg-[#FFF8DC]',
    minWidth: '220px',
  },
  {
    key: 'totalAnnualRevenue',
    label: 'Annual Revenue in United States Dollars Million, 2025',
    headerClass: 'bg-[#FFF8DC]',
    minWidth: '180px',
  },
]

export const CONTACT_COLUMNS: TableColumn[] = [
  { key: 'customerSizeScale', label: 'Size and Scale', headerClass: 'bg-[#B0E0E6]', minWidth: '180px' },
  {
    key: 'keyContactPerson',
    label: 'Relevant Key Contact Person',
    headerClass: 'bg-[#B0E0E6]',
    minWidth: '160px',
  },
  { key: 'designationRole', label: 'Role or Designation', headerClass: 'bg-[#B0E0E6]', minWidth: '170px' },
  { key: 'emailAddress', label: 'Email Address', headerClass: 'bg-[#B0E0E6]', minWidth: '150px', isLink: 'email' },
  {
    key: 'phoneWhatsappNumber',
    label: 'Phone Number or WhatsApp Number',
    headerClass: 'bg-[#B0E0E6]',
    minWidth: '170px',
  },
  { key: 'linkedInProfile', label: 'LinkedIn Profile', headerClass: 'bg-[#B0E0E6]', minWidth: '150px', isLink: 'url' },
  { key: 'websiteUrl', label: 'Company Website', headerClass: 'bg-[#B0E0E6]', minWidth: '130px', isLink: 'url' },
]

export const BUYING_DRIVERS_COLUMNS_BASIC: TableColumn[] = []

export const BUYING_DRIVERS_COLUMNS_ADVANCE: TableColumn[] = [
  {
    key: 'keyBuyingCriteria',
    label: 'Probe Card and Pogo Test Socket Buying Criteria',
    headerClass: 'bg-[#B0E0E6]',
    minWidth: '220px',
  },
  {
    key: 'keyPainPoints',
    label: 'Probe Card and Pogo Test Socket Pain Points',
    headerClass: 'bg-[#B0E0E6]',
    minWidth: '220px',
  },
  {
    key: 'upcomingTriggersAndInitiatives',
    label: 'Buying Trigger, Technical Maturity, Risk Exposure, and Product Complexity',
    headerClass: 'bg-[#B0E0E6]',
    minWidth: '240px',
  },
]

export const PURCHASING_BEHAVIOUR_COLUMNS_ADVANCE: TableColumn[] = [
  {
    key: 'budgetOwnership',
    label: 'Budget Owner',
    headerClass: 'bg-[#DDA0DD]',
    minWidth: '180px',
  },
  {
    key: 'procurementModel',
    label: 'Procurement Model',
    headerClass: 'bg-[#DDA0DD]',
    minWidth: '200px',
  },
]

export const BUYING_DRIVERS_COLUMNS_PREMIUM: TableColumn[] = [
  ...BUYING_DRIVERS_COLUMNS_ADVANCE,
  ...PURCHASING_BEHAVIOUR_COLUMNS_ADVANCE,
]

export const PURCHASING_BEHAVIOUR_COLUMNS_PREMIUM: TableColumn[] = [
  {
    key: 'vendorSelectionCriteria',
    label: 'Vendor Selection Criteria',
    headerClass: 'bg-[#DDA0DD]',
    minWidth: '200px',
  },
  {
    key: 'preferredEngagementType',
    label: 'Preferred Engagement Model',
    headerClass: 'bg-[#DDA0DD]',
    minWidth: '180px',
  },
  {
    key: 'preferredDeploymentModel',
    label: 'Preferred Deployment and Service Model',
    headerClass: 'bg-[#DDA0DD]',
    minWidth: '220px',
  },
]

export const SOLUTION_REQUIREMENTS_COLUMNS: TableColumn[] = [
  {
    key: 'preferredSolutionType',
    label: 'Preferred Solution Type',
    headerClass: 'bg-[#DEB887]',
    minWidth: '220px',
  },
  {
    key: 'integrationTechnicalServiceRequirements',
    label: 'Integration, Technical, and Service Requirements',
    headerClass: 'bg-[#DEB887]',
    minWidth: '240px',
  },
  {
    key: 'performanceExpectations',
    label: 'Performance Expectations',
    headerClass: 'bg-[#DEB887]',
    minWidth: '200px',
  },
]

export const CMI_INSIGHTS_COLUMNS_PREMIUM: TableColumn[] = [
  {
    key: 'customerBenchmarkingSummary',
    label: 'Benchmark Summary',
    headerClass: 'bg-[#B0E0E6]',
    minWidth: '200px',
  },
  {
    key: 'additionalCommentsNotes',
    label: 'Additional Customer Market Intelligence Notes',
    headerClass: 'bg-[#B0E0E6]',
    minWidth: '220px',
  },
  {
    key: 'salesPrioritizationNote',
    label: 'Sales Prioritization Note',
    headerClass: 'bg-[#B0E0E6]',
    minWidth: '200px',
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
      { label: 'Contact Details', colSpan: 7, headerClass: 'bg-[#87CEEB]' },
    ],
    columns: [...CUSTOMER_INFO_COLUMNS, ...CONTACT_COLUMNS],
  },
  proposition2: {
    groups: [
      { label: 'Customer Information', colSpan: 5, headerClass: 'bg-[#E8C4A0]' },
      { label: 'Contact Details', colSpan: 7, headerClass: 'bg-[#87CEEB]' },
      { label: 'Buying Drivers', colSpan: 3, headerClass: 'bg-[#87CEEB]' },
      { label: 'Purchasing Behaviour Metrics', colSpan: 2, headerClass: 'bg-[#9370DB] text-white' },
    ],
    columns: [
      ...CUSTOMER_INFO_COLUMNS,
      ...CONTACT_COLUMNS,
      ...BUYING_DRIVERS_COLUMNS_ADVANCE,
      ...PURCHASING_BEHAVIOUR_COLUMNS_ADVANCE,
    ],
  },
  proposition3: {
    groups: [
      { label: 'Customer Information', colSpan: 5, headerClass: 'bg-[#E8C4A0]' },
      { label: 'Contact Details', colSpan: 7, headerClass: 'bg-[#87CEEB]' },
      { label: 'Buying Drivers', colSpan: 5, headerClass: 'bg-[#87CEEB]' },
      { label: 'Purchasing Behaviour Metrics', colSpan: 3, headerClass: 'bg-[#9370DB] text-white' },
      { label: 'Solution Requirements', colSpan: 3, headerClass: 'bg-[#D4A574]' },
      { label: 'CMI Insights', colSpan: 3, headerClass: 'bg-[#87CEEB]' },
    ],
    columns: [
      ...CUSTOMER_INFO_COLUMNS,
      ...CONTACT_COLUMNS,
      ...BUYING_DRIVERS_COLUMNS_PREMIUM,
      ...PURCHASING_BEHAVIOUR_COLUMNS_PREMIUM,
      ...SOLUTION_REQUIREMENTS_COLUMNS,
      ...CMI_INSIGHTS_COLUMNS_PREMIUM,
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
