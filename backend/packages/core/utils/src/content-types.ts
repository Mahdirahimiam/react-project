import _ from 'lodash';
import { has, getOr, union } from 'lodash/fp';
import type {
  Model,
  Kind,
  Attribute,
  RelationalAttribute,
  ComponentAttribute,
  DynamicZoneAttribute,
  WithRequired,
} from './types';

const SINGLE_TYPE = 'singleType';
const COLLECTION_TYPE = 'collectionType';

const ID_ATTRIBUTE = 'id';
const PUBLISHED_AT_ATTRIBUTE = 'publishedAt';
const CREATED_BY_ATTRIBUTE = 'createdBy';
const UPDATED_BY_ATTRIBUTE = 'updatedBy';

const CREATED_AT_ATTRIBUTE = 'createdAt';
const UPDATED_AT_ATTRIBUTE = 'updatedAt';

const DP_PUB_STATE_LIVE = 'live';
const DP_PUB_STATE_PREVIEW = 'preview';
const DP_PUB_STATES = [DP_PUB_STATE_LIVE, DP_PUB_STATE_PREVIEW];

const constants = {
  ID_ATTRIBUTE,
  PUBLISHED_AT_ATTRIBUTE,
  CREATED_BY_ATTRIBUTE,
  UPDATED_BY_ATTRIBUTE,
  CREATED_AT_ATTRIBUTE,
  UPDATED_AT_ATTRIBUTE,
  DP_PUB_STATES,
  DP_PUB_STATE_LIVE,
  DP_PUB_STATE_PREVIEW,
  SINGLE_TYPE,
  COLLECTION_TYPE,
};

const getTimestamps = (model: Model) => {
  const attributes = [];

  if (has(CREATED_AT_ATTRIBUTE, model.attributes)) {
    attributes.push(CREATED_AT_ATTRIBUTE);
  }

  if (has(UPDATED_AT_ATTRIBUTE, model.attributes)) {
    attributes.push(UPDATED_AT_ATTRIBUTE);
  }

  return attributes;
};

const getCreatorFields = (model: Model) => {
  const attributes = [];

  if (has(CREATED_BY_ATTRIBUTE, model.attributes)) {
    attributes.push(CREATED_BY_ATTRIBUTE);
  }

  if (has(UPDATED_BY_ATTRIBUTE, model.attributes)) {
    attributes.push(UPDATED_BY_ATTRIBUTE);
  }

  return attributes;
};

const getNonWritableAttributes = (model: Model) => {
  if (!model) return [];

  const nonWritableAttributes = _.reduce(
    model.attributes,
    (acc, attr, attrName) => (attr.writable === false ? acc.concat(attrName) : acc),
    [] as string[]
  );

  return _.uniq([ID_ATTRIBUTE, ...getTimestamps(model), ...nonWritableAttributes]);
};

const getWritableAttributes = (model: Model) => {
  if (!model) return [];

  return _.difference(Object.keys(model.attributes), getNonWritableAttributes(model));
};

const isWritableAttribute = (model: Model, attributeName: string) => {
  return getWritableAttributes(model).includes(attributeName);
};

const getNonVisibleAttributes = (model: Model) => {
  const nonVisibleAttributes = _.reduce(
    model.attributes,
    (acc, attr, attrName) => (attr.visible === false ? acc.concat(attrName) : acc),
    [] as string[]
  );

  return _.uniq([ID_ATTRIBUTE, ...getTimestamps(model), ...nonVisibleAttributes]);
};

const getVisibleAttributes = (model: Model) => {
  return _.difference(_.keys(model.attributes), getNonVisibleAttributes(model));
};

const isVisibleAttribute = (model: Model, attributeName: string) => {
  return getVisibleAttributes(model).includes(attributeName);
};

const getOptions = (model: Model) =>
  _.assign({ draftAndPublish: false }, _.get(model, 'options', {}));

const hasDraftAndPublish = (model: Model) =>
  _.get(model, 'options.draftAndPublish', false) === true;

const isDraft = <T extends object>(data: T, model: Model) =>
  hasDraftAndPublish(model) && _.get(data, PUBLISHED_AT_ATTRIBUTE) === null;

const isSingleType = ({ kind = COLLECTION_TYPE }) => kind === SINGLE_TYPE;
const isCollectionType = ({ kind = COLLECTION_TYPE }) => kind === COLLECTION_TYPE;
const isKind = (kind: Kind) => (model: Model) => model.kind === kind;

const getStoredPrivateAttributes = (model: Model) =>
  union(
    (strapi?.config?.get('api.responses.privateAttributes', []) ?? []) as Array<string>,
    getOr([], 'options.privateAttributes', model)
  );

const getPrivateAttributes = (model: Model) => {
  return _.union(
    getStoredPrivateAttributes(model),
    _.keys(_.pickBy(model.attributes, (attr) => !!attr.private))
  );
};

const isPrivateAttribute = (model: Model, attributeName: string) => {
  if (model?.attributes?.[attributeName]?.private === true) {
    return true;
  }
  return getStoredPrivateAttributes(model).includes(attributeName);
};

const isScalarAttribute = (attribute: Attribute) => {
  return !['media', 'component', 'relation', 'dynamiczone'].includes(attribute?.type);
};
const isMediaAttribute = (attribute: Attribute) => attribute?.type === 'media';
const isRelationalAttribute = (attribute: Attribute): attribute is RelationalAttribute =>
  attribute?.type === 'relation';

const isComponentAttribute = (
  attribute: Attribute
): attribute is ComponentAttribute | DynamicZoneAttribute =>
  ['component', 'dynamiczone'].includes(attribute?.type);

const isDynamicZoneAttribute = (attribute: Attribute): attribute is DynamicZoneAttribute =>
  attribute?.type === 'dynamiczone';
const isMorphToRelationalAttribute = (attribute: Attribute) => {
  return isRelationalAttribute(attribute) && attribute?.relation?.startsWith?.('morphTo');
};

const getComponentAttributes = (schema: Model) => {
  return _.reduce(
    schema.attributes,
    (acc, attr, attrName) => {
      if (isComponentAttribute(attr)) acc.push(attrName);
      return acc;
    },
    [] as string[]
  );
};

const getScalarAttributes = (schema: Model) => {
  return _.reduce(
    schema.attributes,
    (acc, attr, attrName) => {
      if (isScalarAttribute(attr)) acc.push(attrName);
      return acc;
    },
    [] as string[]
  );
};

/**
 * Checks if an attribute is of type `type`
 * @param {object} attribute
 * @param {string} type
 */
const isTypedAttribute = (attribute: Attribute, type: string) => {
  return _.has(attribute, 'type') && attribute.type === type;
};

/**
 *  Returns a route prefix for a contentType
 * @param {object} contentType
 * @returns {string}
 */
const getContentTypeRoutePrefix = (contentType: WithRequired<Model, 'info'>) => {
  return isSingleType(contentType)
    ? _.kebabCase(contentType.info.singularName)
    : _.kebabCase(contentType.info.pluralName);
};

export {
  isScalarAttribute,
  isMediaAttribute,
  isRelationalAttribute,
  isComponentAttribute,
  isDynamicZoneAttribute,
  isMorphToRelationalAttribute,
  isTypedAttribute,
  getPrivateAttributes,
  isPrivateAttribute,
  constants,
  getNonWritableAttributes,
  getComponentAttributes,
  getScalarAttributes,
  getWritableAttributes,
  isWritableAttribute,
  getNonVisibleAttributes,
  getVisibleAttributes,
  getTimestamps,
  getCreatorFields,
  isVisibleAttribute,
  hasDraftAndPublish,
  getOptions,
  isDraft,
  isSingleType,
  isCollectionType,
  isKind,
  getContentTypeRoutePrefix,
};
