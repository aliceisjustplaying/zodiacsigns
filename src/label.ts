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

  console.log(`Labeling ${did}...`);

  const sunQuery = server.db.prepare<unknown[], ComAtprotoLabelDefs.Label>(`SELECT * FROM labels WHERE uri = ? AND val LIKE 'aaa-sun-%' AND neg = false ORDER BY cts DESC LIMIT 1`).all(did);
  const moonQuery = server.db.prepare<unknown[], ComAtprotoLabelDefs.Label>(`SELECT * FROM labels WHERE uri = ? AND val LIKE 'bbb-moon-%' AND neg = false ORDER BY cts DESC LIMIT 1`).all(did);
  const risingQuery = server.db.prepare<unknown[], ComAtprotoLabelDefs.Label>(`SELECT * FROM labels WHERE uri = ? AND val LIKE 'ccc-rising-%' AND neg = false ORDER BY cts DESC LIMIT 1`).all(did);

  const labelCategories = {
    sun: new Set<string>(sunQuery.map(label => label.val)),
    moon: new Set<string>(moonQuery.map(label => label.val)),
    rising: new Set<string>(risingQuery.map(label => label.val)),
  };

  console.log('labelCategories:');
  console.dir(labelCategories, { depth: null });

  if (rkey.includes(DELETE)) {
    const deleteQuery = server.db.prepare<unknown[], ComAtprotoLabelDefs.Label>(`SELECT * FROM labels WHERE uri = ? AND neg = false`).all(did);
    const labelsToDelete = deleteQuery.map(label => label.val);

    console.log('Deleting all labels for', did);
    await server
      .createLabels(
        { uri: did },
        { negate: [...labelsToDelete] },
      )
      .catch((err) => {
        console.log(err);
      })
      .then(() => console.log(`Deleted all labels for ${did}`));
  } else {
    const newLabel = findLabelByPost(rkey);
    if (newLabel) {
      let [categoryToUpdate, canAddLabel] = getCategoryAndAddability(newLabel.label, labelCategories);

      console.log('categoryToUpdate:', categoryToUpdate);
      console.log('canAddLabel:', canAddLabel);

      if (!canAddLabel && labelCategories[categoryToUpdate].size > 0) {
        console.log("canAddLabel: false, labelCategories[categoryToUpdate].size > 0");
        const existingLabel = [...labelCategories[categoryToUpdate]][0];
        console.log('negating existingLabel: ', existingLabel);
        await server.createLabels({ uri: did }, { negate: [existingLabel] });
        console.log('negated existingLabel: ', existingLabel);
        labelCategories[categoryToUpdate].clear();
        canAddLabel = true;
      }

      if (canAddLabel) {
        console.log('canAddLabel: true');
        console.log(`Adding label '${newLabel.label}' to DID: ${did}`);
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
  console.log('called findLabelByPost with rkey:', rkey);
  for (const category of ['sun', 'moon', 'rising'] as const) {
    const found = SIGNS[category].find((sign) => sign.post === rkey);
    if (found) {
      console.log('findLabelByPost found:', found);
      return found;
    }
  }
  console.log('findLabelByPost did not find anything');
  return null;
}

function getCategoryAndAddability(
  label: string,
  categories: { sun: Set<string>; moon: Set<string>; rising: Set<string> },
): ['sun' | 'moon' | 'rising', boolean] {
  console.log('getCategoryAndAddability called with label:', label);
  if (label.startsWith('aaa-sun-')) return ['sun', !categories.sun.has(label)];
  if (label.startsWith('bbb-moon-')) return ['moon', !categories.moon.has(label)];
  if (label.startsWith('ccc-rising-')) return ['rising', !categories.rising.has(label)];
  console.log('SOMETHING IS OFF:');
  console.log(label, categories);
  throw new Error(`Invalid label: ${label}`);
}
