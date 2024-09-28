import type { TeamsRecord } from './types.js';
import 'dotenv/config';

export const DID = process.env.DID ?? '';
export const SIGNING_KEY = process.env.SIGNING_KEY ?? '';
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4002;
export const RELAY = process.env.RELAY ?? "ws://localhost:6008/subscribe";
export const DELETE = '3l5amw6zaow2o';

export const TEAMS: TeamsRecord = {
  nfl: [
  { post: '3l5adkkq2kr2c', label: 'arizona-cardinals', displayLabel: 'Arizona Cardinals' , enDesc: 'User is a fan of the Arizona Cardinals'},
  { post: '3l5adkkszml2q', label: 'atlanta-falcons', displayLabel: 'Atlanta Falcons' , enDesc: 'User is a fan of the Atlanta Falcons'},
  { post: '3l5adkkwabo2r', label: 'baltimore-ravens', displayLabel: 'Baltimore Ravens' , enDesc: 'User is a fan of the Baltimore Ravens'},
  { post: '3l5adkkzmrr2p', label: 'buffalo-bills', displayLabel: 'Buffalo Bills' , enDesc: 'User is a fan of the Buffalo Bills'},
  { post: '3l5adkl4nxe2c', label: 'carolina-panthers', displayLabel: 'Carolina Panthers' , enDesc: 'User is a fan of the Carolina Panthers'},
  { post: '3l5adkl7ygt2o', label: 'chicago-bears', displayLabel: 'Chicago Bears' , enDesc: 'User is a fan of the Chicago Bears'},
  { post: '3l5adkld36r2i', label: 'cincinnati-bengals', displayLabel: 'Cincinnati Bengals' , enDesc: 'User is a fan of the Cincinnati Bengals'},
  { post: '3l5adklg7vv25', label: 'cleveland-browns', displayLabel: 'Cleveland Browns' , enDesc: 'User is a fan of the Cleveland Browns'},
  { post: '3l5adkljec52p', label: 'dallas-cowboys', displayLabel: 'Dallas Cowboys' , enDesc: 'User is a fan of the Dallas Cowboys'},
  { post: '3l5adklmjnp22', label: 'denver-broncos', displayLabel: 'Denver Broncos' , enDesc: 'User is a fan of the Denver Broncos'},
  { post: '3l5adklpm3i2f', label: 'detroit-lions', displayLabel: 'Detroit Lions' , enDesc: 'User is a fan of the Detroit Lions'},
  { post: '3l5adklso2m2c', label: 'green-bay-packers', displayLabel: 'Green Bay Packers' , enDesc: 'User is a fan of the Green Bay Packers'},
  { post: '3l5adklvtbt2o', label: 'houston-texans', displayLabel: 'Houston Texans' , enDesc: 'User is a fan of the Houston Texans'},
  { post: '3l5adklywc32o', label: 'indianapolis-colts', displayLabel: 'Indianapolis Colts' , enDesc: 'User is a fan of the Indianapolis Colts'},
  { post: '3l5adkm3x7v25', label: 'jacksonville-jaguars', displayLabel: 'Jacksonville Jaguars' , enDesc: 'User is a fan of the Jacksonville Jaguars'},
  { post: '3l5adkm6z232r', label: 'kansas-city-chiefs', displayLabel: 'Kansas City Chiefs' , enDesc: 'User is a fan of the Kansas City Chiefs'},
  { post: '3l5adkmbvuo2a', label: 'las-vegas-raiders', displayLabel: 'Las Vegas Raiders' , enDesc: 'User is a fan of the Las Vegas Raiders'},
  { post: '3l5adkmeudt2q', label: 'los-angeles-chargers', displayLabel: 'Los Angeles Chargers' , enDesc: 'User is a fan of the Los Angeles Chargers'},
  { post: '3l5adkmhxak2i', label: 'los-angeles-rams', displayLabel: 'Los Angeles Rams' , enDesc: 'User is a fan of the Los Angeles Rams'},
  { post: '3l5adkmkwjj23', label: 'miami-dolphins', displayLabel: 'Miami Dolphins' , enDesc: 'User is a fan of the Miami Dolphins'},
  { post: '3l5adkmnsm32p', label: 'minnesota-vikings', displayLabel: 'Minnesota Vikings' , enDesc: 'User is a fan of the Minnesota Vikings'},
  { post: '3l5adkmqwv724', label: 'new-england-patriots', displayLabel: 'New England Patriots' , enDesc: 'User is a fan of the New England Patriots'},
  { post: '3l5adkmtwnz2i', label: 'new-orleans-saints', displayLabel: 'New Orleans Saints' , enDesc: 'User is a fan of the New Orleans Saints'},
  { post: '3l5adkmww3x22', label: 'new-york-giants', displayLabel: 'New York Giants' , enDesc: 'User is a fan of the New York Giants'},
  { post: '3l5adkmzqsg2j', label: 'new-york-jets', displayLabel: 'New York Jets' , enDesc: 'User is a fan of the New York Jets'},
  { post: '3l5adkn4shy26', label: 'philadelphia-eagles', displayLabel: 'Philadelphia Eagles' , enDesc: 'User is a fan of the Philadelphia Eagles'},
  { post: '3l5adkn7snl2q', label: 'pittsburgh-steelers', displayLabel: 'Pittsburgh Steelers' , enDesc: 'User is a fan of the Pittsburgh Steelers'},
  { post: '3l5adkncusq26', label: 'san-francisco-49ers', displayLabel: 'San Francisco 49ers' , enDesc: 'User is a fan of the San Francisco 49ers'},
  { post: '3l5adknfvsj23', label: 'seattle-seahawks', displayLabel: 'Seattle Seahawks' , enDesc: 'User is a fan of the Seattle Seahawks'},
  { post: '3l5adkniug327', label: 'tampa-bay-buccaneers', displayLabel: 'Tampa Bay Buccaneers' , enDesc: 'User is a fan of the Tampa Bay Buccaneers'},
  { post: '3l5adknlxxr2c', label: 'tennessee-titans', displayLabel: 'Tennessee Titans' , enDesc: 'User is a fan of the Tennessee Titans'},
  { post: '3l5adknp4pj26', label: 'washington-commanders', displayLabel: 'Washington Commanders' , enDesc: 'User is a fan of the Washington Commanders'},
  ],
};
