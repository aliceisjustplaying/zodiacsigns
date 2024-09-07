import { setLabelerLabelDefinitions, type LoginCredentials } from '@skyware/labeler/scripts';
import { type ComAtprotoLabelDefs } from '@atproto/api';
import { SIGNS } from './constants.js';
import 'dotenv/config';

const loginCredentials: LoginCredentials = {
  identifier: process.env.BSKY_IDENTIFIER!,
  password: process.env.BSKY_PASSWORD!,
};

const labelDefinitions: ComAtprotoLabelDefs.LabelValueDefinition[] = [];

for (const category in SIGNS) {
  for (const sign of SIGNS[category as keyof typeof SIGNS]) {
    const labelValueDefinition: ComAtprotoLabelDefs.LabelValueDefinition = {
      identifier: sign.label,
      severity: 'inform',
      blurs: 'none',
      defaultSetting: 'warn',
      adultOnly: false,
      locales: [
        {
          lang: 'en',
          name: sign.displayLabel,
          description: sign.enDesc,
        },
        {
          lang: 'pt-BR',
          name: sign.displayLabel,
          description: sign.brDesc,
        },
      ],
    };

    labelDefinitions.push(labelValueDefinition);
  }
}

await setLabelerLabelDefinitions(loginCredentials, labelDefinitions);
