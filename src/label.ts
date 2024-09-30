import { AppBskyActorDefs, ComAtprotoLabelDefs } from '@atproto/api';
import { LabelerServer } from '@skyware/labeler';

import { DID, SIGNING_KEY } from './config.js';
import { DELETE, SIGNS } from './constants.js';
import logger from './logger.js';
import { CATEGORY_PREFIXES } from './types.js';
import type { Category } from './types.js';

export const labelerServer = new LabelerServer({ did: DID, signingKey: SIGNING_KEY });

export const label = async (subject: string | AppBskyActorDefs.ProfileView, rkey: string) => {
  const did = AppBskyActorDefs.isProfileView(subject) ? subject.did : subject;
  logger.info(`Received rkey: ${rkey} for ${did}`);

  if (rkey === 'self') {
    logger.info(`${did} liked the labeler. Returning.`);
    return;
  }
  try {
    const labelCategories = fetchCurrentLabels(did);

    if (rkey.includes(DELETE)) {
      await deleteAllLabels(did, labelCategories);
    } else {
      await addOrUpdateLabel(did, rkey, labelCategories);
    }
  } catch (error) {
    logger.error(`Error in \`label\` function: ${error}`);
  }
};

function fetchCurrentLabels(did: string) {
  const categories = ['sun', 'moon', 'rising'];
  const labelCategories: Record<string, Set<string>> = {};

  for (const category of categories) {
    const prefix = CATEGORY_PREFIXES[category as Category];
    const query = labelerServer.db
      .prepare<
        unknown[],
        ComAtprotoLabelDefs.Label
      >(`SELECT * FROM labels WHERE uri = ? AND val LIKE ? ORDER BY cts DESC`)
      .all(did, `${prefix}-${category}-%`);

    const labels = query.reduce((set, label) => {
      if (!label.neg) set.add(label.val);
      else set.delete(label.val);
      return set;
    }, new Set<string>());

    labelCategories[category] = labels;
    logger.info(`Current labels: ${Array.from(labels).join(', ')}`);
  }

  return labelCategories;
}

async function deleteAllLabels(did: string, labelCategories: Record<string, Set<string>>) {
  const labelsToDelete: string[] = Object.values(labelCategories).flatMap((set) => Array.from(set));

  if (labelsToDelete.length === 0) {
    logger.info(`No labels to delete`);
  } else {
    logger.info(`Labels to delete: ${labelsToDelete.join(', ')}`);
    try {
      await labelerServer.createLabels({ uri: did }, { negate: labelsToDelete });
      logger.info('Successfully deleted all labels');
    } catch (error) {
      logger.error(`Error deleting all labels: ${error}`);
    }
  }
}

async function addOrUpdateLabel(did: string, rkey: string, labelCategories: Record<string, Set<string>>) {
  const newLabel = findLabelByPost(rkey);
  if (!newLabel) {
    logger.info(`No matching label found for rkey: ${rkey}`);
    return;
  }

  const category = getCategoryFromLabel(newLabel.label);
  const existingLabels = labelCategories[category];

  logger.info(`Category: ${category}`);
  logger.info(`Existing labels: ${Array.from(existingLabels)}`);
  logger.info(`New label: ${newLabel.label}`);

  if (existingLabels.size > 0) {
    try {
      await labelerServer.createLabels({ uri: did }, { negate: Array.from(existingLabels) });
      logger.info('Successfully negated existing labels');
    } catch (error) {
      logger.error(`Error negating existing labels: ${error}`);
    }
  }

  logger.info(`Adding new label ${newLabel.label} for ${did}`);
  try {
    await labelerServer.createLabel({ uri: did, val: newLabel.label });
    logger.info('Successfully labeled');
    labelCategories[category] = new Set([newLabel.label]);
  } catch (error) {
    logger.error(`Error adding new label: ${error}`);
  }
}

function findLabelByPost(rkey: string) {
  for (const category of ['sun', 'moon', 'rising'] as const) {
    const label = SIGNS[category].find((sign) => sign.post === rkey);
    if (label) {
      return label;
    }
  }
}

const getCategoryFromLabel = (label: string): Category => {
  return Object.entries(CATEGORY_PREFIXES).find(([category, prefix]) =>
    label.startsWith(`${prefix}-${category}-`),
  )?.[0] as Category;
};
