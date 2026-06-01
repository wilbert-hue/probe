/**
 * Generate demo market data for Global Semiconductor Probe Card & Test Socket Market dashboard.
 * Outputs: public/data/value.json, volume.json, segmentation_analysis.json
 */
const fs = require('fs');
const path = require('path');

const years = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];

const GEO_HIERARCHY = {
  'North America': ['U.S.', 'Canada'],
  Europe: ['U.K.', 'Germany', 'France', 'Italy', 'Spain', 'Russia', 'Rest of Europe'],
  'Asia Pacific': ['China', 'India', 'Japan', 'South Korea', 'ASEAN', 'Australia', 'Rest of Asia Pacific'],
  'Middle East & Africa': ['GCC', 'South Africa', 'Rest of Middle East & Africa'],
  'Latin America': ['Brazil', 'Argentina', 'Mexico', 'Rest of Latin America'],
};

const REGIONS = Object.keys(GEO_HIERARCHY);
const ALL_COUNTRIES = REGIONS.flatMap((r) => GEO_HIERARCHY[r]);
const ALL_GEOS = ['Global', ...REGIONS, ...ALL_COUNTRIES];

const REGION_WEIGHTS = {
  'North America': 0.22,
  Europe: 0.18,
  'Asia Pacific': 0.52,
  'Latin America': 0.03,
  'Middle East & Africa': 0.05,
};

const COUNTRY_WEIGHTS = {
  'North America': { 'U.S.': 0.88, Canada: 0.12 },
  Europe: {
    'U.K.': 0.12,
    Germany: 0.22,
    France: 0.14,
    Italy: 0.1,
    Spain: 0.08,
    Russia: 0.1,
    'Rest of Europe': 0.24,
  },
  'Asia Pacific': {
    China: 0.42,
    India: 0.12,
    Japan: 0.14,
    'South Korea': 0.08,
    ASEAN: 0.1,
    Australia: 0.06,
    'Rest of Asia Pacific': 0.08,
  },
  'Middle East & Africa': { GCC: 0.45, 'South Africa': 0.2, 'Rest of Middle East & Africa': 0.35 },
  'Latin America': { Brazil: 0.45, Argentina: 0.15, Mexico: 0.28, 'Rest of Latin America': 0.12 },
};

// Hierarchical segment type: parent -> { share, children: { leaf: share } }
const BY_PRODUCT_TYPE = {
  'Probe Cards': {
    share: 0.62,
    children: {
      'Cantilever Probe Cards': 0.48,
      'Vertical Probe Cards': 0.52,
    },
  },
  'Pogo Test Sockets': {
    share: 0.38,
    children: {
      'Standard Signal Pogo Test Sockets': 0.35,
      'RF Pogo Test Sockets': 0.22,
      'Power Pogo Test Sockets': 0.28,
      'Kelvin Pogo Test Sockets': 0.15,
    },
  },
};

// Flat segment types: segmentType -> { subsegment: share }
const FLAT_SEGMENT_TYPES = {
  'By Probe Card Fabrication Technology': {
    'Conventional Needle-Based Probe Technology': 0.35,
    'Buckling Beam Probe Technology': 0.25,
    'MEMS-Based Probe Technology': 0.22,
    'Thin-Film Probe Technology': 0.18,
  },
  'By Testing Stage': {
    'Wafer Probe Testing': 0.45,
    'Final Package Testing': 0.25,
    'Burn-In and Reliability Testing': 0.15,
    'Engineering, Characterization, and Failure Analysis Testing': 0.15,
  },
  'By Semiconductor Device Type': {
    'Memory Devices': 0.22,
    'Digital Logic, Processor, ASIC, and SoC Devices': 0.28,
    'Analog and Mixed-Signal Non-RF ICs': 0.12,
    'RF, Microwave, and Wireless ICs': 0.1,
    'Power Discrete Devices and Power ICs': 0.08,
    'Optoelectronic and Imaging Devices': 0.08,
    'MEMS Devices and Other Specialty Semiconductor Devices': 0.12,
  },
  'By Direct Customer Type': {
    'Integrated Device Manufacturers': 0.35,
    'Pure-Play Foundries': 0.18,
    'OSAT Companies': 0.25,
    'Independent Semiconductor Test Service Providers': 0.12,
    'Research, Development, and Failure Analysis Laboratories': 0.1,
  },
};

const GLOBAL_BASE_VALUE_2021 = 1180; // USD Million
const GLOBAL_GROWTH = 0.072;
const VOLUME_PER_MILLION_USD = 4200;

let seed = 42;
function seededRandom() {
  seed = (seed * 16807 + 0) % 2147483647;
  return (seed - 1) / 2147483646;
}

function addNoise(value, noiseLevel = 0.025) {
  return value * (1 + (seededRandom() - 0.5) * 2 * noiseLevel);
}

function roundTo1(val) {
  return Math.round(val * 10) / 10;
}

function roundToInt(val) {
  return Math.round(val);
}

function generateTimeSeries(baseValue, growthRate, roundFn) {
  const series = {};
  for (let i = 0; i < years.length; i++) {
    const year = years[i];
    const rawValue = baseValue * Math.pow(1 + growthRate, i);
    series[year] = roundFn(addNoise(rawValue));
  }
  return series;
}

function getGeoMultiplier(geo) {
  if (geo === 'Global') return 1;
  if (REGIONS.includes(geo)) return REGION_WEIGHTS[geo] || 0.1;
  for (const region of REGIONS) {
    if (GEO_HIERARCHY[region].includes(geo)) {
      const rw = REGION_WEIGHTS[region];
      const cw = COUNTRY_WEIGHTS[region][geo] || 0.1;
      return rw * cw;
    }
  }
  return 0.01;
}

function segmentGrowthMultiplier(segType, segName) {
  const hash = (segType + segName).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return 0.92 + (hash % 17) * 0.01;
}

function buildFlatSegmentData(geo, segType, segments, isVolume) {
  const roundFn = isVolume ? roundToInt : roundTo1;
  const multiplier = isVolume ? VOLUME_PER_MILLION_USD : 1;
  const geoMult = getGeoMultiplier(geo);
  const geoBase = GLOBAL_BASE_VALUE_2021 * multiplier * geoMult;
  const result = {};

  for (const [segName, share] of Object.entries(segments)) {
    const growth = GLOBAL_GROWTH * segmentGrowthMultiplier(segType, segName);
    const shareVar = 1 + (seededRandom() - 0.5) * 0.06;
    const segBase = geoBase * share * shareVar;
    result[segName] = generateTimeSeries(segBase, growth, roundFn);
  }
  return result;
}

function sumTimeSeries(seriesList) {
  const total = {};
  for (const year of years) {
    total[year] = 0;
    for (const s of seriesList) {
      total[year] += s[year] || 0;
    }
  }
  return total;
}

function buildNestedSegmentData(geo, segType, hierarchy, isVolume) {
  const roundFn = isVolume ? roundToInt : roundTo1;
  const multiplier = isVolume ? VOLUME_PER_MILLION_USD : 1;
  const geoMult = getGeoMultiplier(geo);
  const geoBase = GLOBAL_BASE_VALUE_2021 * multiplier * geoMult;
  const result = {};

  for (const [parent, config] of Object.entries(hierarchy)) {
    const parentBase = geoBase * config.share * (1 + (seededRandom() - 0.5) * 0.04);
    const childEntries = Object.entries(config.children);
    const childSeries = [];

    const parentNode = {};
    for (const [leaf, leafShare] of childEntries) {
      const growth = GLOBAL_GROWTH * segmentGrowthMultiplier(segType, leaf);
      const leafBase = parentBase * leafShare * (1 + (seededRandom() - 0.5) * 0.05);
      const series = generateTimeSeries(leafBase, growth, roundFn);
      parentNode[leaf] = series;
      childSeries.push(series);
    }
    const parentTotals = sumTimeSeries(childSeries);
    for (const year of years) {
      parentNode[year] = roundFn(parentTotals[year]);
    }
    result[parent] = parentNode;
  }

  return result;
}

function buildByRegionData(isVolume) {
  const roundFn = isVolume ? roundToInt : roundTo1;
  const multiplier = isVolume ? VOLUME_PER_MILLION_USD : 1;
  const result = {};
  for (const region of REGIONS) {
    const base = GLOBAL_BASE_VALUE_2021 * multiplier * (REGION_WEIGHTS[region] || 0.1);
    const growth = GLOBAL_GROWTH * (0.98 + seededRandom() * 0.08);
    result[region] = generateTimeSeries(base, growth, roundFn);
  }
  return result;
}

function buildByCountryData(region, isVolume) {
  const roundFnVal = isVolume ? roundToInt : roundTo1;
  const multiplier = isVolume ? VOLUME_PER_MILLION_USD : 1;
  const regionBase = GLOBAL_BASE_VALUE_2021 * multiplier * (REGION_WEIGHTS[region] || 0.1);
  const weights = COUNTRY_WEIGHTS[region];
  const result = {};
  for (const country of GEO_HIERARCHY[region]) {
    const share = weights[country] || 0.1;
    const base = regionBase * share;
    const growth = GLOBAL_GROWTH * segmentGrowthMultiplier('By Country', country);
    result[country] = generateTimeSeries(base, growth, roundFnVal);
  }
  return result;
}

function buildGeoEntry(geo, isVolume) {
  const entry = {};
  entry['By Product Type'] = buildNestedSegmentData(geo, 'By Product Type', BY_PRODUCT_TYPE, isVolume);
  for (const [segType, segments] of Object.entries(FLAT_SEGMENT_TYPES)) {
    entry[segType] = buildFlatSegmentData(geo, segType, segments, isVolume);
  }
  if (geo === 'Global') {
    entry['By Region'] = buildByRegionData(isVolume);
  }
  if (REGIONS.includes(geo)) {
    entry['By Country'] = buildByCountryData(geo, isVolume);
  }
  return entry;
}

function buildFullData(isVolume) {
  const data = {};
  for (const geo of ALL_GEOS) {
    data[geo] = buildGeoEntry(geo, isVolume);
  }
  return data;
}

function buildSegmentationAnalysis() {
  const analysis = { Global: {} };

  analysis.Global['By Product Type'] = {};
  for (const [parent, config] of Object.entries(BY_PRODUCT_TYPE)) {
    analysis.Global['By Product Type'][parent] = {};
    for (const leaf of Object.keys(config.children)) {
      analysis.Global['By Product Type'][parent][leaf] = {};
    }
  }

  for (const [segType, segments] of Object.entries(FLAT_SEGMENT_TYPES)) {
    analysis.Global[segType] = {};
    for (const seg of Object.keys(segments)) {
      analysis.Global[segType][seg] = {};
    }
  }

  analysis.Global['By Region'] = {};
  for (const region of REGIONS) {
    analysis.Global['By Region'][region] = {};
    for (const country of GEO_HIERARCHY[region]) {
      analysis.Global['By Region'][region][country] = {};
    }
  }

  return analysis;
}

seed = 42;
const valueData = buildFullData(false);
seed = 7777;
const volumeData = buildFullData(true);
const segmentationAnalysis = buildSegmentationAnalysis();

const outDir = path.join(__dirname, 'public', 'data');
fs.writeFileSync(path.join(outDir, 'value.json'), JSON.stringify(valueData, null, 2));
fs.writeFileSync(path.join(outDir, 'volume.json'), JSON.stringify(volumeData, null, 2));
fs.writeFileSync(
  path.join(outDir, 'segmentation_analysis.json'),
  JSON.stringify(segmentationAnalysis, null, 2)
);

console.log('Generated Probe Card & Test Socket market data successfully');
console.log('Geographies:', Object.keys(valueData).length);
console.log('Segment types at Global:', Object.keys(valueData.Global).filter((k) => k !== 'By Region'));
console.log('Regions:', Object.keys(valueData.Global['By Region'] || {}));
console.log(
  'Sample Global By Product Type 2023:',
  valueData.Global['By Product Type']['Probe Cards']['Cantilever Probe Cards']['2023']
);
