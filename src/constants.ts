import 'dotenv/config';

export const DID = process.env.DID ?? '';
export const SIGNING_KEY = process.env.SIGNING_KEY ?? '';
export const PORT = 4002;
export const DELETE = '3l3lfjnk2zb2n';
export const SIGNS: Record<
  'sun' | 'moon' | 'rising',
  Array<{ post: string; label: string; displayLabel: string; enDesc: string; brDesc: string }>
> = {
  sun: [
    { post: '3l3lfvkycmr2n', label: 'aaa-sun-aries', displayLabel: '♈ ☀️', enDesc: 'Aries', brDesc: 'Áries' },
    { post: '3l3lfw3vfwl2c', label: 'aaa-sun-taurus', displayLabel: '♉ ☀️', enDesc: 'Taurus', brDesc: 'Touro' },
    { post: '3l3lfwd7djq2c', label: 'aaa-sun-gemini', displayLabel: '♊ ☀️', enDesc: 'Gemini', brDesc: 'Gêmeos' },
    { post: '3l3lfwj44fc2n', label: 'aaa-sun-cancer', displayLabel: '♋ ☀️', enDesc: 'Cancer', brDesc: 'Câncer' },
    { post: '3l3lfwp2nu72y', label: 'aaa-sun-leo', displayLabel: '♌ ☀️', enDesc: 'Leo', brDesc: 'Leão' },
    { post: '3l3lfwvsi472y', label: 'aaa-sun-virgo', displayLabel: '♍ ☀️', enDesc: 'Virgo', brDesc: 'Virgem' },
    { post: '3l3lfx456nm2m', label: 'aaa-sun-libra', displayLabel: '♎ ☀️', enDesc: 'Libra', brDesc: 'Libra' },
    { post: '3l3lfxezjxm2o', label: 'aaa-sun-scorpio', displayLabel: '♏ ☀️', enDesc: 'Scorpio', brDesc: 'Escorpião' },
    {
      post: '3l3lfxkifbh27',
      label: 'aaa-sun-sagittarius',
      displayLabel: '♐ ☀️',
      enDesc: 'Sagittarius',
      brDesc: 'Sagitário',
    },
    {
      post: '3l3lfxqfxie2n',
      label: 'aaa-sun-capricorn',
      displayLabel: '♑ ☀️',
      enDesc: 'Capricorn',
      brDesc: 'Capricórnio',
    },
    { post: '3l3lfxvt5672y', label: 'aaa-sun-aquarius', displayLabel: '♒ ☀️', enDesc: 'Aquarius', brDesc: 'Aquário' },
    { post: '3l3lfy74k242r', label: 'aaa-sun-pisces', displayLabel: '♓ ☀️', enDesc: 'Pisces', brDesc: 'Peixes' },
  ],
  moon: [
    { post: '3l3lhe5f4gd2c', label: 'bbb-moon-aries', displayLabel: '♈ 🌙', enDesc: 'Aries', brDesc: 'Áries' },
    { post: '3l3lhef5rkz2r', label: 'bbb-moon-taurus', displayLabel: '♉ 🌙', enDesc: 'Taurus', brDesc: 'Touro' },
    { post: '3l3lhem7msu2o', label: 'bbb-moon-gemini', displayLabel: '♊ 🌙', enDesc: 'Gemini', brDesc: 'Gêmeos' },
    { post: '3l3lhgw2liq2c', label: 'bbb-moon-cancer', displayLabel: '♋ 🌙', enDesc: 'Cancer', brDesc: 'Câncer' },
    { post: '3l3lhhikpzf2x', label: 'bbb-moon-leo', displayLabel: '♌ 🌙', enDesc: 'Leo', brDesc: 'Leão' },
    { post: '3l3lhivrrem2n', label: 'bbb-moon-virgo', displayLabel: '♍ 🌙', enDesc: 'Virgo', brDesc: 'Virgem' },
    { post: '3l3lhj55tvo2t', label: 'bbb-moon-libra', displayLabel: '♎ 🌙', enDesc: 'Libra', brDesc: 'Libra' },
    { post: '3l3lhjd5dvj2n', label: 'bbb-moon-scorpio', displayLabel: '♏ 🌙', enDesc: 'Scorpio', brDesc: 'Escorpião' },
    {
      post: '3l3lhjjlnyg2j',
      label: 'bbb-moon-sagittarius',
      displayLabel: '♐ 🌙',
      enDesc: 'Sagittarius',
      brDesc: 'Sagitário',
    },
    {
      post: '3l3lhjqpcmb2r',
      label: 'bbb-moon-capricorn',
      displayLabel: '♑ 🌙',
      enDesc: 'Capricorn',
      brDesc: 'Capricórnio',
    },
    { post: '3l3lhjwjny22h', label: 'bbb-moon-aquarius', displayLabel: '♒ 🌙', enDesc: 'Aquarius', brDesc: 'Aquário' },
    { post: '3l3lhkcfc7x27', label: 'bbb-moon-pisces', displayLabel: '♓ 🌙', enDesc: 'Pisces', brDesc: 'Peixes' },
  ],
  rising: [
    { post: '3l3lhsnuiqx27', label: 'ccc-rising-aries', displayLabel: '♈ ⬆️', enDesc: 'Aries', brDesc: 'Áries' },
    { post: '3l3lhsu7qtk2q', label: 'ccc-rising-taurus', displayLabel: '♉ ⬆️', enDesc: 'Taurus', brDesc: 'Touro' },
    { post: '3l3lht44nz32c', label: 'ccc-rising-gemini', displayLabel: '♊ ⬆️', enDesc: 'Gemini', brDesc: 'Gêmeos' },
    { post: '3l3lhtbxbrt2n', label: 'ccc-rising-cancer', displayLabel: '♋ ⬆️', enDesc: 'Cancer', brDesc: 'Câncer' },
    { post: '3l3lhtjco7g2f', label: 'ccc-rising-leo', displayLabel: '♌ ⬆️', enDesc: 'Leo', brDesc: 'Leão' },
    { post: '3l3lhtoxwyo2p', label: 'ccc-rising-virgo', displayLabel: '♍ ⬆️', enDesc: 'Virgo', brDesc: 'Virgem' },
    { post: '3l3lhtubu4b23', label: 'ccc-rising-libra', displayLabel: '♎ ⬆️', enDesc: 'Libra', brDesc: 'Libra' },
    {
      post: '3l3lhu2qoyf2h',
      label: 'ccc-rising-scorpio',
      displayLabel: '♏ ⬆️',
      enDesc: 'Scorpio',
      brDesc: 'Escorpião',
    },
    {
      post: '3l3lhu77pvx27',
      label: 'ccc-rising-sagittarius',
      displayLabel: '♐ ⬆️',
      enDesc: 'Sagittarius',
      brDesc: 'Sagitário',
    },
    {
      post: '3l3lhueqe5l2n',
      label: 'ccc-rising-capricorn',
      displayLabel: '♑ ⬆️',
      enDesc: 'Capricorn',
      brDesc: 'Capricórnio',
    },
    {
      post: '3l3lhujywjw2t',
      label: 'ccc-rising-aquarius',
      displayLabel: '♒ ⬆️',
      enDesc: 'Aquarius',
      brDesc: 'Aquário',
    },
    { post: '3l3lhuqczcj2n', label: 'ccc-rising-pisces', displayLabel: '♓ ⬆️', enDesc: 'Pisces', brDesc: 'Peixes' },
  ],
};
