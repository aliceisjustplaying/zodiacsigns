import { AppBskyActorDefs, ComAtprotoLabelDefs } from '@atproto/api';
import { LabelerServer } from '@skyware/labeler';

import { DID, PORT, SIGNING_KEY } from './config.js';
import { DELETE, SIGNS } from './constants.js';
import logger from './logger.js';
import { CATEGORY_PREFIXES } from './types.js';
import type { Category } from './types.js';

const server = new LabelerServer({ did: DID, signingKey: SIGNING_KEY });

server.start(PORT, (error, address) => {
  if (error) {
    logger.error('Error starting server:', error);
  } else {
    logger.info(`Labeler server listening on ${address}`);
  }
});

export const label = async (subject: string | AppBskyActorDefs.ProfileView, rkey: string) => {
  const did = AppBskyActorDefs.isProfileView(subject) ? subject.did : subject;
  logger.info(`>>> Labeling ${did}`);
  logger.info(`Received rkey: ${rkey}`);

  if (rkey === 'self') {
    logger.info(`${DID} liked the labeler.`);
    return;
  }
  try {
    const labelCategories = fetchCurrentLabels(did);

    if (rkey.includes(DELETE)) {
      logger.info('>>> Deleting all labels');
      await deleteAllLabels(did, labelCategories);
      logger.info('<<< Deleted all labels');
    } else {
      logger.info('>>> Adding/updating label...');
      await addOrUpdateLabel(did, rkey, labelCategories);
      logger.info('<<< Added/updated labels');
    }
  } catch (error) {
    logger.error('Error in `label` function:', error);
  } finally {
    logger.info(`<<< ${DID} labeling complete`);
  }
};

function fetchCurrentLabels(did: string) {
  logger.info('>>> fetchCurrentLabels started');
  logger.info('DID:', did);
  const categories = ['sun', 'moon', 'rising'];
  const labelCategories: Record<string, Set<string>> = {};

  for (const category of categories) {
    logger.info(`>>> Finding category ${category}`);
    const prefix =
      category === 'sun' ? 'aaa-'
      : category === 'moon' ? 'bbb-'
      : 'ccc-';
    const query = server.db
      .prepare<
        unknown[],
        ComAtprotoLabelDefs.Label
      >(`SELECT * FROM labels WHERE uri = ? AND val LIKE '${prefix}${category}-%' ORDER BY cts DESC`)
      .all(did);

    const labels = query.reduce((set, label) => {
      if (!label.neg) set.add(label.val);
      else set.delete(label.val);
      return set;
    }, new Set<string>());

    labelCategories[category] = labels;
    logger.info(`Labels:`, Array.from(labels));
    logger.info(`<<< Finding category ${category} complete`);
  }

  logger.info('<<< fetchCurrentLabels returning');
  return labelCategories;
}

async function deleteAllLabels(did: string, labelCategories: Record<string, Set<string>>) {
  logger.info('>>> deleteAllLabels started');
  logger.info('DID:', did);
  const labelsToDelete = Object.values(labelCategories).flatMap((set) => Array.from(set));

  if (labelsToDelete.length === 0) {
    logger.info('No labels to delete');
  } else {
    logger.info('Labels to delete:', labelsToDelete);
    try {
      await server.createLabels({ uri: did }, { negate: labelsToDelete });
      logger.info('Successfully deleted all labels');
    } catch (error) {
      logger.error('Error deleting all labels:', error);
    } finally {
      logger.info('<<< deleteAllLabels returning');
    }
  }
}

async function addOrUpdateLabel(did: string, rkey: string, labelCategories: Record<string, Set<string>>) {
  logger.info('>>> addOrUpdateLabel');
  logger.info('DID:', did, 'rkey:', rkey);
  const newLabel = findLabelByPost(rkey);
  if (!newLabel) {
    logger.info('No matching label found for rkey');
    logger.info('<<< addOrUpdateLabel returning');
    return;
  }

  const category = getCategoryFromLabel(newLabel.label);
  const existingLabels = labelCategories[category];

  logger.info('Category:', category);
  logger.info('Existing labels:', existingLabels);
  logger.info('New label:', newLabel.label);

  if (existingLabels.size > 0) {
    logger.info('>>> Negating existing labels');
    try {
      await server.createLabels({ uri: did }, { negate: Array.from(existingLabels) });
      logger.info('Successfully negated existing labels');
    } catch (error) {
      logger.error('Error negating existing labels:', error);
    } finally {
      logger.info('<<< Negating all labels complete');
    }
  }

  logger.info('>>> Adding new label');
  try {
    await server.createLabel({ uri: did, val: newLabel.label });
    logger.info('Successfully labeled');
    labelCategories[category] = new Set([newLabel.label]);
  } catch (error) {
    logger.error('Error adding new label:', error);
  } finally {
    logger.info('<<< Adding new label complete');
  }

  logger.info('<<< addOrUpdateLabel returning');
}

function findLabelByPost(rkey: string) {
  logger.info('>>> findLabelByPost started');
  logger.info('rkey:', rkey);
  for (const category of ['sun', 'moon', 'rising'] as const) {
    const found = SIGNS[category].find((sign) => sign.post === rkey);
    if (found) {
      logger.info('Found label:', found);
      logger.info('<<< findLabelByPost returning');
      return found;
    }
  }
  logger.info('No label found');
  logger.info('<<< findLabelByPost returning');
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
