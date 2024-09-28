export type Category = 'nfl';
// we need this to keep the sun - moon - rising order on the frontend
type CategoryPrefix = 'aaa';

interface NFLTeam {
  post: string;
  label: `${CategoryPrefix}-${Category}-${string}`;
  displayLabel: string;
  enDesc: string;
  brDesc: string;
}

export type TeamsRecord = Record<Category, NFLTeam[]>;

export const CATEGORY_PREFIXES: Record<Category, CategoryPrefix> = {
  nfl: 'aaa'
};

export interface EventStream {
  did: string;
  time_us: number;
  type: string;
  commit?: {
    rev: string;
    type: string;
    collection: string;
    rkey: string;
    record: {
      $type: string;
      createdAt: string;
      subject: {
        cid: string;
        uri: string;
      };
    };
  };
}

export interface Label {
  ver?: number;
  src: string;
  uri: string;
  cid?: string;
  val: string;
  neg?: boolean;
  cts: string;
  exp?: string;
  sig?: Uint8Array;
  [k: string]: unknown;
}
