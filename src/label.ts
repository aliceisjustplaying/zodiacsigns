import { AppBskyActorDefs, ComAtprotoLabelDefs } from '@atproto/api';
import { DID, PORT, SIGNS, SIGNING_KEY, DELETE } from './constants.js';
import { LabelerServer } from '@skyware/labeler';

const server = new LabelerServer({ did: DID, signingKey: SIGNING_KEY });

server.start(PORT, (error, address) => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Labeler server listening on ${address}`);
  }
});

export const label = async (subject: string | AppBskyActorDefs.ProfileView, rkey: string) => {
  const did = AppBskyActorDefs.isProfileView(subject) ? subject.did : subject;

  const query = server.db.prepare<unknown[], ComAtprotoLabelDefs.Label>(`SELECT * FROM labels WHERE uri = ?`).all(did);

  const labelCategories = {
    sun: new Set<string>(),
    moon: new Set<string>(),
    rising: new Set<string>(),
  };

  query.forEach((label) => {
    if (!label.neg) {
      if (label.val.startsWith('aaa-sun-')) labelCategories.sun.add(label.val);
      else if (label.val.startsWith('bbb-moon-')) labelCategories.moon.add(label.val);
      else if (label.val.startsWith('ccc-rising-')) labelCategories.rising.add(label.val);
    }
  });

  if (rkey.includes(DELETE)) {
    await server
      .createLabels(
        { uri: did },
        { negate: [...labelCategories.sun, ...labelCategories.moon, ...labelCategories.rising] },
      )
      .catch((err) => {
        console.log(err);
      })
      .then(() => console.log(`Deleted labels for ${did}`));
  } else {
    const newLabel = findLabelByPost(rkey);
    if (newLabel) {
      const [categoryToUpdate, canAddLabel] = getCategoryAndAddability(newLabel.label, labelCategories);

      if (canAddLabel) {
        await server
          .createLabel({ uri: did, val: newLabel.label })
          .catch((err) => {
            console.log(err);
          })
          .then(() => {
            console.log(`Labeled ${did} with ${newLabel.label}`);
            labelCategories[categoryToUpdate].add(newLabel.label);
          });
      } else {
        console.log(`Cannot add label ${newLabel.label} to ${did}.`);
      }
    }
  }
};

function findLabelByPost(rkey: string) {
  for (const category of ['sun', 'moon', 'rising'] as const) {
    const found = SIGNS[category].find((sign) => sign.post === rkey);
    if (found) return found;
  }
  return null;
}

function getCategoryAndAddability(
  label: string,
  categories: { sun: Set<string>; moon: Set<string>; rising: Set<string> },
): ['sun' | 'moon' | 'rising', boolean] {
  if (label.startsWith('aaa-sun-') && categories.sun.size === 0) return ['sun', true];
  if (label.startsWith('bbb-moon-') && categories.moon.size === 0) return ['moon', true];
  if (label.startsWith('ccc-rising-') && categories.rising.size === 0) return ['rising', true];
  console.log('SOMETHING IS OFF:');
  console.log(label, categories);
  throw new Error(`We really shouldn't be here`);
}
