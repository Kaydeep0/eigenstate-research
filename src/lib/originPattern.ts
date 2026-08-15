/** Historical 400-year ladder for /origin/. E-scale is the framework illustration from evidence.json. Live Φ_S lives on Field. */

export type OriginWave = {
  id: string;
  year: string;
  name: string;
  rail: string;
  eLabel: string;
  logE: number;
  fieldId: string | null;
};

export type OriginSeatRow = {
  year: string;
  wrapper: string;
  issuerName: string;
  issuerId: string | null;
  custodianName: string;
  custodianIds: string[];
};

export const ORIGIN_WAVES: OriginWave[] = [
  {
    id: 'voc',
    year: '1602',
    name: 'VOC',
    rail: 'State spice charter',
    eLabel: '10⁻³',
    logE: -3,
    fieldId: null,
  },
  {
    id: 'oil',
    year: '1882',
    name: 'Standard Oil',
    rail: 'Railroad rebate capture',
    eLabel: '10⁰',
    logE: 0,
    fieldId: 'STANDARD_OIL',
  },
  {
    id: 'fed',
    year: '1913',
    name: 'Federal Reserve',
    rail: 'Jekyll Island blueprint',
    eLabel: '10¹',
    logE: 1,
    fieldId: 'FED',
  },
  {
    id: 'tbtf',
    year: '2008',
    name: 'TBTF / GSIB',
    rail: 'TARP backstop',
    eLabel: '10⁶',
    logE: 6,
    fieldId: 'JPMORGAN',
  },
  {
    id: 'now',
    year: '2026',
    name: 'Circle / rails',
    rail: 'Tokenized Treasuries',
    eLabel: '10⁹',
    logE: 9,
    fieldId: 'CIRCLE',
  },
];

export const ORIGIN_SEATS: OriginSeatRow[] = [
  {
    year: '1602',
    wrapper: 'VOC charter',
    issuerName: 'VOC (claim on spice flow)',
    issuerId: null,
    custodianName: 'VOC books (same seat)',
    custodianIds: [],
  },
  {
    year: '1913',
    wrapper: 'Federal Reserve Act',
    issuerName: 'Federal Reserve',
    issuerId: 'FED',
    custodianName: 'JPMorgan / primary dealers',
    custodianIds: ['JPMORGAN'],
  },
  {
    year: '2026',
    wrapper: 'USDC on T-bills',
    issuerName: 'Circle',
    issuerId: 'CIRCLE',
    custodianName: 'BlackRock reserves + BNY custody',
    custodianIds: ['BLACKROCK', 'BNY_MELLON'],
  },
];

export const ORIGIN_LINEAGE = [
  { id: 'STANDARD_OIL', note: 'Rockefeller refining' },
  { id: 'NATIONAL_CITY_BANK', note: 'Rockefeller bank seat' },
  { id: 'JEKYLL_ISLAND', note: 'Fed blueprint, 1910' },
  { id: 'FED', note: 'Issuer of the sovereign wrapper' },
  { id: 'JPMORGAN', note: 'Morgan line, still Ring 3' },
  { id: 'TREASURY_MARKET', note: 'Instrument under every wrapper' },
  { id: 'DTCC', note: 'Clearing memory' },
  { id: 'CIRCLE', note: 'This wave issuer' },
  { id: 'BLACKROCK', note: 'Reserve manager' },
  { id: 'BNY_MELLON', note: 'Custody hub' },
];

export function logHeight(logE: number, minLog = -3, maxLog = 9): number {
  return (logE - minLog) / (maxLog - minLog);
}
