import { AppBskyActorDefs, ComAtprotoLabelDefs } from '@atproto/api';
import { DID, PORT, SIGNS, SIGNING_KEY, DELETE } from './constants.js';
import { CATEGORY_PREFIXES } from './types.js';
import type { Category } from './types.js';
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
  console.log(`Received rkey: ${rkey}`);

  try {
    const labelCategories = fetchCurrentLabels(did);

    if (rkey.includes(DELETE)) {
      console.log('Delete operation detected');
      await deleteAllLabels(did, labelCategories);
    } else {
      console.log('Add/Update operation detected');
      await addOrUpdateLabel(did, rkey, labelCategories);
    }
  } catch (error) {
    console.error('Error in label function:', error);
  }
};

function fetchCurrentLabels(did: string) {
  console.log('Fetching current labels for:', did);
  const categories = ['sun', 'moon', 'rising'];
  const labelCategories: Record<string, string | null> = {};

  for (const category of categories) {
    const prefix = category === 'sun' ? 'aaa-' : category === 'moon' ? 'bbb-' : 'ccc-';
    const query = server.db
      .prepare<
        unknown[],
        ComAtprotoLabelDefs.Label
      >(`SELECT * FROM labels WHERE uri = ? AND val LIKE '${prefix}${category}-%' ORDER BY cts DESC`)
      .all(did);

    let currentLabel: string | null = null;
    let negationCount = 0;
    let additionCount = 0;

    for (const label of query) {
      if (label.neg) {
        negationCount++;
      } else {
        additionCount++;
        if (!currentLabel) {
          currentLabel = label.val;
        }
      }
    }

    if (negationCount > additionCount) {
      console.warn(`Warning: More negations than additions for ${category} (${did}). Database may be inconsistent.`);
      currentLabel = null; // Treat as if no label was set
    }

    labelCategories[category] = currentLabel;
    console.log(`${category} label:`, labelCategories[category]);
  }

  return labelCategories;
}

async function deleteAllLabels(did: string, labelCategories: Record<string, string | null>) {
  console.log('Attempting to delete all labels for:', did);
  const labelsToDelete = Object.values(labelCategories).filter((label) => label !== null);

  if (labelsToDelete.length === 0) {
    console.log('No labels to delete for', did);
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

function getCategoryFromLabel(label: string): Category {
  for (const [category, prefix] of Object.entries(CATEGORY_PREFIXES)) {
    if (label.startsWith(`${prefix}-${category}-`)) {
      return category as Category;
    }
  }

  throw new Error(`Invalid label: ${label}`);
}
