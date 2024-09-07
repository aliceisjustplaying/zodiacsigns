import { AppBskyActorDefs, ComAtprotoLabelDefs } from '@atproto/api';
import { DID, PORT, SIGNS, SIGNING_KEY, DELETE } from './constants.js';
import { LabelerServer } from '@skyware/labeler';

const server = new LabelerServer({ did: DID, signingKey: SIGNING_KEY });

server.start(PORT, (error, address) => {
  if (error) {
    console.error('Error starting server:', error);
  } else {
    console.log(`Labeler server listening on ${address}`);
  }
});

export const label = async (subject: string | AppBskyActorDefs.ProfileView, rkey: string) => {
  const did = AppBskyActorDefs.isProfileView(subject) ? subject.did : subject;
  console.log(`Labeling ${did}...`);
  console.log('Received rkey:', rkey);

  try {
    const labelCategories = await fetchCurrentLabels(did);

    if (rkey.includes(DELETE)) {
      console.log('Delete operation detected');
      await massDeleteLabels(did, labelCategories);
    } else {
      console.log('Add/Update operation detected');
      await addOrUpdateLabel(did, rkey, labelCategories);
    }
  } catch (error) {
    console.error('Error in label function:', error);
  }
};

async function fetchCurrentLabels(did: string) {
  console.log('Fetching current labels for:', did);
  const categories = ['sun', 'moon', 'rising'];
  const labelCategories: Record<string, string | null> = {};

  for (const category of categories) {
    const prefix = category === 'sun' ? 'aaa-' : category === 'moon' ? 'bbb-' : 'ccc-';
    const query = server.db
      .prepare<
        unknown[],
        ComAtprotoLabelDefs.Label
      >(`SELECT * FROM labels WHERE uri = ? AND val LIKE '${prefix}${category}-%' AND neg = false ORDER BY cts DESC LIMIT 1`)
      .all(did);
    labelCategories[category] = query.length > 0 ? query[0].val : null;
    console.log(`${category} label:`, labelCategories[category]);
  }

  return labelCategories;
}

async function massDeleteLabels(did: string, labelCategories: Record<string, string | null>) {
  console.log('Attempting to mass-delete labels for:', did);
  const labelsToDelete = Object.values(labelCategories).filter((label) => label !== null) as string[];

  if (labelsToDelete.length === 0) {
    console.log('No labels to mass-delete for', did);
    return;
  }

  console.log('Labels to delete:', labelsToDelete);
  try {
    await server.createLabels({ uri: did }, { negate: labelsToDelete });
    console.log(`Successfully deleted all labels for ${did}`);
  } catch (error) {
    console.error('Error during mass deletion:', error);
  }
}

async function addOrUpdateLabel(did: string, rkey: string, labelCategories: Record<string, string | null>) {
  console.log('Adding or updating label for:', did);
  const newLabel = findLabelByPost(rkey);
  if (!newLabel) {
    console.log('No matching label found for rkey:', rkey);
    return;
  }

  const category = getCategoryFromLabel(newLabel.label);
  const existingLabel = labelCategories[category];

  console.log('Category:', category);
  console.log('Existing label:', existingLabel);
  console.log('New label:', newLabel.label);

  if (existingLabel && existingLabel !== newLabel.label) {
    console.log('Negating existing label:', existingLabel);
    try {
      await server.createLabels({ uri: did }, { negate: [existingLabel] });
      console.log('Successfully negated existing label');
    } catch (error) {
      console.error('Error negating existing label:', error);
    }
  }

  if (!existingLabel || existingLabel !== newLabel.label) {
    console.log('Adding new label:', newLabel.label);
    try {
      await server.createLabel({ uri: did, val: newLabel.label });
      console.log(`Successfully labeled ${did} with ${newLabel.label}`);
      labelCategories[category] = newLabel.label;
    } catch (error) {
      console.error('Error adding new label:', error);
    }
  } else {
    console.log(`Label ${newLabel.label} already exists for ${did}`);
  }
}

function findLabelByPost(rkey: string) {
  console.log('Finding label for rkey:', rkey);
  for (const category of ['sun', 'moon', 'rising'] as const) {
    const found = SIGNS[category].find((sign) => sign.post === rkey);
    if (found) {
      console.log('Found label:', found);
      return found;
    }
  }
  console.log('No label found for rkey:', rkey);
  return null;
}

function getCategoryFromLabel(label: string): 'sun' | 'moon' | 'rising' {
  console.log('Getting category for label:', label);
  if (label.startsWith('aaa-sun-')) return 'sun';
  if (label.startsWith('bbb-moon-')) return 'moon';
  if (label.startsWith('ccc-rising-')) return 'rising';
  console.error('Invalid label:', label);
  throw new Error(`Invalid label: ${label}`);
}
