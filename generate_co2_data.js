/**
 * Generate demo market data for Global Industrial CO₂ Laser Market dashboard.
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

// Region share of global market (sums to 1)
const REGION_WEIGHTS = {
  'North America': 0.28,
  Europe: 0.26,
  'Asia Pacific': 0.38,
  'Latin America': 0.04,
  'Middle East & Africa': 0.04,
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

// Flat segment types: segmentType -> { subsegment: share }
const FLAT_SEGMENT_TYPES = {
  'By Excitation Method': {
    'RF-Excited CO₂ Lasers': 0.62,
    'DC-Excited CO₂ Lasers': 0.38,
  },
  'By Gas Flow & Cooling Technology': {
    'Sealed-Off / Diffusion-Cooled': 0.48,
    'Fast Axial Flow': 0.38,
    'TEA (Transverse Excited Atmosphere)': 0.14,
  },
  'By Power Range': {
    'Up to 300 W': 0.22,
    'Above 300 W to 500 W': 0.18,
    'Above 500 W to 1 kW': 0.2,
    'Above 1 kW to 2 kW': 0.16,
    'Above 2 kW to 5 kW': 0.14,
    'Above 5 kW': 0.1,
  },
  'By Deployment': {
    'Standalone / Benchtop Systems': 0.32,
    'Production Line Integrated Systems': 0.28,
    'Robotic Integrated Systems': 0.22,
    'Gantry / Portal Systems': 0.18,
  },
  'By Materials Processed': {
    'Paper and Labels': 0.12,
    'Cardboard and Corrugated Board': 0.1,
    'Plastics and Polymers': 0.18,
    'Rubber and Foam': 0.08,
    'Textiles and Fabrics': 0.1,
    'Leather': 0.05,
    'Wood and Wood Derivatives': 0.08,
    Metals: 0.14,
    Ceramics: 0.06,
    'Others (Composite Materials, Glass, etc.)': 0.09,
  },
  'By Industry Vertical': {
    'Packaging and Converting': 0.14,
    'Printing and Graphics': 0.1,
    'Food and Beverage': 0.08,
    'Plastics and Polymer Manufacturing': 0.1,
    'Textile and Apparel': 0.07,
    'Leather and Footwear Manufacturing': 0.05,
    'Automotive and Transportation': 0.12,
    'Electronics and Semiconductor': 0.11,
    'Furniture and Wood Products Manufacturing': 0.06,
    'Building and Construction': 0.08,
    'Consumer Goods': 0.05,
    'Others (Energy and Utilities, etc.)': 0.04,
  },
};

// Nested: parent -> { leaf: share } (shares within parent sum to 1; parent shares sum to 1)
const BY_APPLICATION = {
  'Material Removal Applications': {
    share: 0.32,
    children: {
      'Laser Cutting': 0.28,
      'Laser Engraving': 0.18,
      'Laser Drilling': 0.14,
      'Laser Micro-Perforation': 0.12,
      'Laser Ablation': 0.16,
      'Laser Kiss-Cutting': 0.12,
    },
  },
  'Surface Treatment Applications': {
    share: 0.18,
    children: {
      'Cleaning/Stripping': 0.4,
      Hardening: 0.35,
      Texturing: 0.25,
    },
  },
  'Joining Applications': {
    share: 0.2,
    children: {
      Welding: 0.65,
      'Sealing / Bonding': 0.35,
    },
  },
  'Identification & Traceability': {
    share: 0.15,
    children: {
      'Laser Marking': 0.6,
      'Laser Coding': 0.4,
    },
  },
  'Converting Applications': {
    share: 0.15,
    children: {
      'Label Converting': 0.25,
      'Paper Converting': 0.25,
      'Film Converting': 0.25,
      'Packaging Converting': 0.25,
    },
  },
};

const GLOBAL_BASE_VALUE_2021 = 2850; // USD Million
const GLOBAL_GROWTH = 0.065;
const VOLUME_PER_MILLION_USD = 180;

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

function buildNestedApplicationData(geo, isVolume) {
  const roundFn = isVolume ? roundToInt : roundTo1;
  const multiplier = isVolume ? VOLUME_PER_MILLION_USD : 1;
  const geoMult = getGeoMultiplier(geo);
  const geoBase = GLOBAL_BASE_VALUE_2021 * multiplier * geoMult;
  const result = {};

  for (const [parent, config] of Object.entries(BY_APPLICATION)) {
    const parentBase = geoBase * config.share * (1 + (seededRandom() - 0.5) * 0.04);
    const childEntries = Object.entries(config.children);
    const childSeries = [];

    const parentNode = {};
    for (const [leaf, leafShare] of childEntries) {
      const growth = GLOBAL_GROWTH * segmentGrowthMultiplier('By Application', leaf);
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
  for (const [segType, segments] of Object.entries(FLAT_SEGMENT_TYPES)) {
    entry[segType] = buildFlatSegmentData(geo, segType, segments, isVolume);
  }
  entry['By Application'] = buildNestedApplicationData(geo, isVolume);
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

  for (const [segType, segments] of Object.entries(FLAT_SEGMENT_TYPES)) {
    analysis.Global[segType] = {};
    for (const seg of Object.keys(segments)) {
      analysis.Global[segType][seg] = {};
    }
  }

  analysis.Global['By Application'] = {};
  for (const [parent, config] of Object.entries(BY_APPLICATION)) {
    analysis.Global['By Application'][parent] = {};
    for (const leaf of Object.keys(config.children)) {
      analysis.Global['By Application'][parent][leaf] = {};
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

console.log('Generated CO₂ laser market data successfully');
console.log('Geographies:', Object.keys(valueData).length);
console.log('Segment types at Global:', Object.keys(valueData.Global).filter((k) => k !== 'By Region'));
console.log('Regions:', Object.keys(valueData.Global['By Region'] || {}));
console.log(
  'Sample Global By Excitation Method 2023:',
  valueData.Global['By Excitation Method']['RF-Excited CO₂ Lasers']['2023']
);
