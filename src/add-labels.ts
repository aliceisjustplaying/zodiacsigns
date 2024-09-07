import { setLabelerLabelDefinitions, type LoginCredentials } from "@skyware/labeler/scripts";
import { type ComAtprotoLabelDefs} from "@atproto/api";
import { SIGNS } from "./constants.js";
import "dotenv/config";

const loginCredentials: LoginCredentials = {
  identifier: process.env.BSKY_IDENTIFIER!,
  password: process.env.BSKY_PASSWORD!
}

const labelDefinitions: ComAtprotoLabelDefs.LabelValueDefinition[] = [];

for (const label of SIGNS) {
  const labelValueDefinition: ComAtprotoLabelDefs.LabelValueDefinition = {
    identifier: label.label,
    severity: "inform",
    blurs: "none",
    defaultSetting: "warn",
    adultOnly: false,
    locales: [
      {
        lang: "en",
        name: label.displayLabel,
        description: label.enDesc
      },
      {
        lang: "pt-BR",
        name: label.displayLabel,
        description: label.brDesc
      }
    ]
  }

  labelDefinitions.push(labelValueDefinition);
}

await setLabelerLabelDefinitions(loginCredentials, labelDefinitions);
