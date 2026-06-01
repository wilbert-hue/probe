const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const SOURCE_FILE =
  'Sample Framework_Customer Database_Global Probe Cards and Pogo Test Sockets Market.xlsx';
const OUTPUT_FILE = path.join(__dirname, 'public', 'data', 'customer-intelligence.json');

const EXCLUDED_COMPANIES = new Set([
  'Amkor Technology',
  'Broadcom Inc.',
  'JCET Group',
]);

const SHEET_CONFIG = {
  proposition1: {
    sheet: 'Proposition 1 - Basic',
    label: 'Proposition 1 - Basic',
    id: 'proposition-1',
    columns: [
      'customerNameCompanyName',
      'businessOverview',
      'exactCustomerType',
      'waferSortFinalTestUseCase',
      'totalAnnualRevenue',
      'customerSizeScale',
      'keyContactPerson',
      'designationRole',
      'emailAddress',
      'phoneWhatsappNumber',
      'linkedInProfile',
      'websiteUrl',
      'additionalCommentsNotes',
    ],
  },
  proposition2: {
    sheet: 'Proposition 2 - Advance',
    label: 'Proposition 2 - Advance',
    id: 'proposition-2',
    columns: [
      'customerNameCompanyName',
      'businessOverview',
      'exactCustomerType',
      'waferSortFinalTestUseCase',
      'totalAnnualRevenue',
      'customerSizeScale',
      'keyContactPerson',
      'designationRole',
      'emailAddress',
      'phoneWhatsappNumber',
      'linkedInProfile',
      'websiteUrl',
      'keyBuyingCriteria',
      'keyPainPoints',
      'upcomingTriggersAndInitiatives',
      'budgetOwnership',
      'procurementModel',
      'additionalCommentsNotes',
    ],
  },
  proposition3: {
    sheet: 'Proposition 3 - Premium',
    label: 'Proposition 3 - Premium',
    id: 'proposition-3',
    columns: [
      'customerNameCompanyName',
      'businessOverview',
      'exactCustomerType',
      'waferSortFinalTestUseCase',
      'totalAnnualRevenue',
      'customerSizeScale',
      'keyContactPerson',
      'designationRole',
      'emailAddress',
      'phoneWhatsappNumber',
      'linkedInProfile',
      'websiteUrl',
      'keyBuyingCriteria',
      'keyPainPoints',
      'upcomingTriggersAndInitiatives',
      'budgetOwnership',
      'procurementModel',
      'vendorSelectionCriteria',
      'preferredEngagementType',
      'preferredDeploymentModel',
      'preferredSolutionType',
      'integrationTechnicalServiceRequirements',
      'performanceExpectations',
      'customerBenchmarkingSummary',
      'additionalCommentsNotes',
      'salesPrioritizationNote',
    ],
  },
};

function normalizeCell(value, preserveNewlines = false) {
  const raw = String(value ?? '');
  if (preserveNewlines) {
    return raw
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((line) => line.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .join('\n');
  }
  return raw.replace(/\r\n/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractTitleLines(rows) {
  const raw = String(rows[0]?.[0] || rows[0]?.[1] || '');
  return raw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
}

function findHeaderRow(rows) {
  for (let r = 0; r < Math.min(rows.length, 10); r++) {
    const idx = rows[r].findIndex((cell) => {
      const text = String(cell).trim();
      return (
        text === 'Customer or Company Name' ||
        text === 'Customer Name/Company Name' ||
        text.startsWith('Customer Name/Company') ||
        text.startsWith('Customer or Company')
      );
    });
    if (idx !== -1) {
      return { headerRowIdx: r, companyColIdx: idx };
    }
  }
  return null;
}

function appendMultilineField(existing, value) {
  const next = normalizeCell(value, true);
  if (!next) return existing;
  return existing ? `${existing}\n${next}` : next;
}

function parseSheet(wb, config) {
  const ws = wb.Sheets[config.sheet];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  const titleLines = extractTitleLines(rows);
  const header = findHeaderRow(rows);

  if (!header) {
    throw new Error(`Could not find header row in sheet "${config.sheet}"`);
  }

  const { headerRowIdx, companyColIdx } = header;
  const sNoColIdx = companyColIdx - 1;
  const dataRows = [];

  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    const sNo = row[sNoColIdx];
    const company = row[companyColIdx];

    if (
      String(company).trim() === 'Customer or Company Name' ||
      String(company).trim() === 'Customer Name/Company Name'
    ) {
      continue;
    }

    if (!company) {
      const prev = dataRows[dataRows.length - 1];
      const altContact = normalizeCell(row[companyColIdx + 5]);
      if (prev && altContact) {
        prev.keyContactPerson = appendMultilineField(prev.keyContactPerson, altContact);
        prev.designationRole = appendMultilineField(prev.designationRole, row[companyColIdx + 6]);
        prev.emailAddress = appendMultilineField(prev.emailAddress, row[companyColIdx + 7]);
        prev.phoneWhatsappNumber = appendMultilineField(
          prev.phoneWhatsappNumber,
          row[companyColIdx + 8]
        );
        prev.linkedInProfile = appendMultilineField(prev.linkedInProfile, row[companyColIdx + 9]);
        prev.websiteUrl = appendMultilineField(prev.websiteUrl, row[companyColIdx + 10]);
      }
      continue;
    }

    if (!sNo && !company) continue;

    const companyName = normalizeCell(company);
    if (EXCLUDED_COMPANIES.has(companyName)) continue;

    const record = { sNo: normalizeCell(sNo) };
    config.columns.forEach((key, idx) => {
      record[key] = normalizeCell(row[companyColIdx + idx] ?? '', key === 'businessOverview');
    });
    dataRows.push(record);
  }

  dataRows.forEach((record, index) => {
    record.sNo = String(index + 1);
  });

  return { titleLines, rows: dataRows };
}

function main() {
  const wb = XLSX.readFile(SOURCE_FILE);
  const prop1 = parseSheet(wb, SHEET_CONFIG.proposition1);
  const prop2 = parseSheet(wb, SHEET_CONFIG.proposition2);
  const prop3 = parseSheet(wb, SHEET_CONFIG.proposition3);

  const titleLines = prop1.titleLines.length ? prop1.titleLines : prop3.titleLines;
  const marketTitle =
    titleLines[0] || 'Global Probe Cards and Pogo Test Sockets Market - Customer Database';
  const subtitle = titleLines[1] || 'Verified directory and insight on customers';

  const output = {
    marketTitle,
    subtitle,
    proposition1: {
      id: SHEET_CONFIG.proposition1.id,
      label: SHEET_CONFIG.proposition1.label,
      titleLines,
      rows: prop1.rows,
    },
    proposition2: {
      id: SHEET_CONFIG.proposition2.id,
      label: SHEET_CONFIG.proposition2.label,
      titleLines,
      rows: prop2.rows,
    },
    proposition3: {
      id: SHEET_CONFIG.proposition3.id,
      label: SHEET_CONFIG.proposition3.label,
      titleLines,
      rows: prop3.rows,
    },
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log('Written', OUTPUT_FILE);
  console.log('Source:', SOURCE_FILE);
  console.log('P1 rows:', output.proposition1.rows.length);
  console.log('P2 rows:', output.proposition2.rows.length);
  console.log('P3 rows:', output.proposition3.rows.length);
  console.log('Sample P1:', output.proposition1.rows[0]?.customerNameCompanyName);
}

main();
