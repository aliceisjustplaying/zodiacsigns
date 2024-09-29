import { type ComAtprotoLabelDefs } from '@atproto/api';
import { type LoginCredentials, setLabelerLabelDefinitions } from '@skyware/labeler/scripts';

import { BSKY_IDENTIFIER, BSKY_PASSWORD } from './config.js';
import { SIGNS } from './constants.js';

const loginCredentials: LoginCredentials = {
  identifier: BSKY_IDENTIFIER,
  password: BSKY_PASSWORD,
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
