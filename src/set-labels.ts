import { setLabelerLabelDefinitions, type LoginCredentials } from '@skyware/labeler/scripts';
import { type ComAtprotoLabelDefs } from '@atproto/api';
import { TEAMS } from './constants.js';
import 'dotenv/config';

const loginCredentials: LoginCredentials = {
  identifier: process.env.BSKY_IDENTIFIER!,
  password: process.env.BSKY_PASSWORD!,
};

const labelDefinitions: ComAtprotoLabelDefs.LabelValueDefinition[] = [];

for (const category in TEAMS) {
  for (const team of TEAMS[category as keyof typeof TEAMS]) {
    const labelValueDefinition: ComAtprotoLabelDefs.LabelValueDefinition = {
      identifier: team.label,
      severity: 'inform',
      blurs: 'none',
      defaultSetting: 'warn',
      adultOnly: false,
      locales: [
        {
          lang: 'en',
          name: team.displayLabel,
          description: team.enDesc,
        },
      ],
    };

    labelDefinitions.push(labelValueDefinition);
  }
}

await setLabelerLabelDefinitions(loginCredentials, labelDefinitions);
