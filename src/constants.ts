import "dotenv/config";

export const DID = process.env.DID ?? "";
export const SIGNING_KEY = process.env.SIGNING_KEY ?? "";
export const PORT = 4002;
export const LABEL_LIMIT = 3;
export const DELETE = "3l3lfjnk2zb2n";
export const SIGNS = [
  { post: "3l3lfvkycmr2n", label: "sun-aries", displayLabel: "☀️♈", enDesc: "Aries", brDesc: "Áries" },
  { post: "3l3lfw3vfwl2c", label: "sun-taurus", displayLabel: "☀️♉", enDesc: "Taurus", brDesc: "Touro" },
  { post: "3l3lfwd7djq2c", label: "sun-gemini", displayLabel: "☀️♊", enDesc: "Gemini", brDesc: "Gêmeos" },
  { post: "3l3lfwj44fc2n", label: "sun-cancer", displayLabel: "☀️♋", enDesc: "Cancer", brDesc: "Câncer" },
  { post: "3l3lfwp2nu72y", label: "sun-leo", displayLabel: "☀️♌", enDesc: "Leo", brDesc: "Leão" },
  { post: "3l3lfwvsi472y", label: "sun-virgo", displayLabel: "☀️♍", enDesc: "Virgo", brDesc: "Virgem" },
  { post: "3l3lfx456nm2m", label: "sun-libra", displayLabel: "☀️♎", enDesc: "Libra", brDesc: "Libra" },
  { post: "3l3lfxezjxm2o", label: "sun-scorpio", displayLabel: "☀️♏", enDesc: "Scorpio", brDesc: "Escorpião" },
  { post: "3l3lfxkifbh27", label: "sun-sagittarius", displayLabel: "☀️♐", enDesc: "Sagittarius", brDesc: "Sagitário" },
  { post: "3l3lfxqfxie2n", label: "sun-capricorn", displayLabel: "☀️♑", enDesc: "Capricorn", brDesc: "Capricórnio" },
  { post: "3l3lfxvt5672y", label: "sun-aquarius", displayLabel: "☀️♒", enDesc: "Aquarius", brDesc: "Aquário" },
  { post: "3l3lfy74k242r", label: "sun-pisces", displayLabel: "☀️♓", enDesc: "Pisces", brDesc: "Peixes" },
  { post: "3l3lhe5f4gd2c", label: "moon-aries", displayLabel: "🌙♈", enDesc: "Aries", brDesc: "Áries" },
  { post: "3l3lhef5rkz2r", label: "moon-taurus", displayLabel: "🌙♉", enDesc: "Taurus", brDesc: "Touro" },
  { post: "3l3lhem7msu2o", label: "moon-gemini", displayLabel: "🌙♊", enDesc: "Gemini", brDesc: "Gêmeos" },
  { post: "3l3lhgw2liq2c", label: "moon-cancer", displayLabel: "🌙♋", enDesc: "Cancer", brDesc: "Câncer" },
  { post: "3l3lhhikpzf2x", label: "moon-leo", displayLabel: "🌙♌", enDesc: "Leo", brDesc: "Leão" },
  { post: "3l3lhivrrem2n", label: "moon-virgo", displayLabel: "🌙♍", enDesc: "Virgo", brDesc: "Virgem" },
  { post: "3l3lhj55tvo2t", label: "moon-libra", displayLabel: "🌙♎", enDesc: "Libra", brDesc: "Libra" },
  { post: "3l3lhjd5dvj2n", label: "moon-scorpio", displayLabel: "🌙♏", enDesc: "Scorpio", brDesc: "Escorpião" },
  { post: "3l3lhjjlnyg2j", label: "moon-sagittarius", displayLabel: "🌙♐", enDesc: "Sagittarius", brDesc: "Sagitário" },
  { post: "3l3lhjqpcmb2r", label: "moon-capricorn", displayLabel: "🌙♑", enDesc: "Capricorn", brDesc: "Capricórnio" },
  { post: "3l3lhjwjny22h", label: "moon-aquarius", displayLabel: "🌙♒", enDesc: "Aquarius", brDesc: "Aquário" },
  { post: "3l3lhkcfc7x27", label: "moon-pisces", displayLabel: "🌙♓", enDesc: "Pisces", brDesc: "Peixes" },
  { post: "3l3lhsnuiqx27", label: "rising-aries", displayLabel: "⬆️♈", enDesc: "Aries", brDesc: "Áries" },
  { post: "3l3lhsu7qtk2q", label: "rising-taurus", displayLabel: "⬆️♉", enDesc: "Taurus", brDesc: "Touro" },
  { post: "3l3lht44nz32c", label: "rising-gemini", displayLabel: "⬆️♊", enDesc: "Gemini", brDesc: "Gêmeos" },
  { post: "3l3lhtbxbrt2n", label: "rising-cancer", displayLabel: "⬆️♋", enDesc: "Cancer", brDesc: "Câncer" },
  { post: "3l3lhtjco7g2f", label: "rising-leo", displayLabel: "⬆️♌", enDesc: "Leo", brDesc: "Leão" },
  { post: "3l3lhtoxwyo2p", label: "rising-virgo", displayLabel: "⬆️♍", enDesc: "Virgo", brDesc: "Virgem" },
  { post: "3l3lhtubu4b23", label: "rising-libra", displayLabel: "⬆️♎", enDesc: "Libra", brDesc: "Libra" },
  { post: "3l3lhu2qoyf2h", label: "rising-scorpio", displayLabel: "⬆️♏", enDesc: "Scorpio", brDesc: "Escorpião" },
  { post: "3l3lhu77pvx27", label: "rising-sagittarius", displayLabel: "⬆️♐", enDesc: "Sagittarius", brDesc: "Sagitário" },
  { post: "3l3lhueqe5l2n", label: "rising-capricorn", displayLabel: "⬆️♑", enDesc: "Capricorn", brDesc: "Capricórnio" },
  { post: "3l3lhujywjw2t", label: "rising-aquarius", displayLabel: "⬆️♒", enDesc: "Aquarius", brDesc: "Aquário" },
  { post: "3l3lhuqczcj2n", label: "rising-pisces", displayLabel: "⬆️♓", enDesc: "Pisces", brDesc: "Peixes" },
];
