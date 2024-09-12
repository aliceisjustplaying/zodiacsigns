export type Category = 'sun' | 'moon' | 'rising';
// we need this to keep the sun - moon - rising order on the frontend
type CategoryPrefix = 'aaa' | 'bbb' | 'ccc';

interface ZodiacSign {
  post: string;
  label: `${CategoryPrefix}-${Category}-${string}`;
  displayLabel: string;
  enDesc: string;
  brDesc: string;
}

export type SignsRecord = Record<Category, ZodiacSign[]>;

export const CATEGORY_PREFIXES: Record<Category, CategoryPrefix> = {
  sun: 'aaa',
  moon: 'bbb',
  rising: 'ccc',
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
