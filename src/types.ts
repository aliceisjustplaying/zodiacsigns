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
