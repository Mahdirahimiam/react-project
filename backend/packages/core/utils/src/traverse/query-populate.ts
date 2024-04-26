import {
  curry,
  isString,
  isArray,
  isEmpty,
  split,
  isObject,
  trim,
  isNil,
  cloneDeep,
  join,
  first,
  omit,
  merge,
} from 'lodash/fp';

import traverseFactory from './factory';
import { Attribute } from '../types';
import { isMorphToRelationalAttribute } from '../content-types';

const isKeyword = (keyword: string) => {
  return ({ key, attribute }: { key: string; attribute: Attribute }) => {
    return !attribute && keyword === key;
  };
};

const isStringArray = (value: unknown): value is string[] =>
  isArray(value) && value.every(isString);

const isWildCardConstant = (value: unknown): value is '*' => value === '*';

const isObj = (value: unknown): value is Record<string, unknown> => isObject(value);

const populate = traverseFactory()
  // Array of strings ['foo', 'foo.bar'] => map(recurse), then filter out empty items
  .intercept(isStringArray, async (visitor, options, populate, { recurse }) => {
    const visitedPopulate = await Promise.all(
      populate.map((nestedPopulate) => recurse(visitor, options, nestedPopulate))
    );

    return visitedPopulate.filter((item) => !isNil(item));
  })
  // Transform wildcard populate to an exhaustive list of attributes to populate.
  .intercept(isWildCardConstant, (visitor, options, _data, { recurse }) => {
    const attributes = options.schema?.attributes;

    // This should never happen, but adding the check in
    // case this method is called with wrong parameters
    if (!attributes) {
      return '*';
    }

    const parsedPopulate = Object.entries(attributes)
      // Get the list of all attributes that can be populated
      .filter(([, value]) => ['relation', 'component', 'dynamiczone', 'media'].includes(value.type))
      // Only keep the attributes key
      .reduce((acc, [key]) => ({ ...acc, [key]: true }), {});

    return recurse(visitor, options, parsedPopulate);
  })
  // Parse string values
  .parse(isString, () => {
    const tokenize = split('.');
    const recompose = join('.');

    return {
      transform: trim,

      remove(key, data) {
        const [root] = tokenize(data);

        return root === key ? undefined : data;
      },

      set(key, value, data) {
        const [root] = tokenize(data);

        if (root !== key) {
          return data;
        }

        return isNil(value) || isEmpty(value) ? root : `${root}.${value}`;
      },

      keys(data) {
        const v = first(tokenize(data));
        return v ? [v] : [];
      },

      get(key, data) {
        const [root, ...rest] = tokenize(data);

        return key === root ? recompose(rest) : undefined;
      },
    };
  })
  // Parse object values
  .parse(isObj, () => ({
    transform: cloneDeep,

    remove(key, data) {
      // eslint-disable-next-line no-unused-vars
      const { [key]: ignored, ...rest } = data;

      return rest;
    },

    set(key, value, data) {
      return { ...data, [key]: value };
    },

    keys(data) {
      return Object.keys(data);
    },

    get(key, data) {
      return data[key];
    },
  }))
  .ignore(({ key, attribute }) => {
    return ['sort', 'filters', 'fields'].includes(key) && !attribute;
  })
  .on(
    // Handle recursion on populate."populate"
    isKeyword('populate'),
    async ({ key, visitor, path, value, schema }, { set, recurse }) => {
      const newValue = await recurse(visitor, { schema, path }, value);

      set(key, newValue);
    }
  )
  .on(isKeyword('on'), async ({ key, visitor, path, value }, { set, recurse }) => {
    const newOn: Record<string, unknown> = {};

    if (!isObj(value)) {
      return;
    }

    for (const [uid, subPopulate] of Object.entries(value)) {
      const model = strapi.getModel(uid);
      const newPath = { ...path, raw: `${path.raw}[${uid}]` };

      newOn[uid] = await recurse(visitor, { schema: model, path: newPath }, subPopulate);
    }

    set(key, newOn);
  })
  // Handle populate on relation
  .onRelation(async ({ key, value, attribute, visitor, path, schema }, { set, recurse }) => {
    if (isNil(value)) {
      return;
    }

    if (isMorphToRelationalAttribute(attribute)) {
      // Don't traverse values that cannot be parsed
      if (!isObject(value) || !('on' in value && isObject(value?.on))) {
        return;
      }

      // If there is a populate fragment defined, traverse it
      const newValue = await recurse(visitor, { schema, path }, { on: value?.on });

      set(key, { on: newValue });
    }

    const targetSchemaUID = attribute.target;
    const targetSchema = strapi.getModel(targetSchemaUID);

    const newValue = await recurse(visitor, { schema: targetSchema, path }, value);

    set(key, newValue);
  })
  // Handle populate on media
  .onMedia(async ({ key, path, visitor, value }, { recurse, set }) => {
    if (isNil(value)) {
      return;
    }

    const targetSchemaUID = 'plugin::upload.file';
    const targetSchema = strapi.getModel(targetSchemaUID);

    const newValue = await recurse(visitor, { schema: targetSchema, path }, value);

    set(key, newValue);
  })
  // Handle populate on components
  .onComponent(async ({ key, value, visitor, path, attribute }, { recurse, set }) => {
    if (isNil(value)) {
      return;
    }

    const targetSchema = strapi.getModel(attribute.component);

    const newValue = await recurse(visitor, { schema: targetSchema, path }, value);

    set(key, newValue);
  })
  // Handle populate on dynamic zones
  .onDynamicZone(async ({ key, value, attribute, schema, visitor, path }, { set, recurse }) => {
    if (isNil(value)) {
      return;
    }

    if (isObject(value)) {
      const { components } = attribute;

      const newValue = {};

      // Handle legacy DZ params
      let newProperties: unknown = omit('on', value);

      for (const componentUID of components) {
        const componentSchema = strapi.getModel(componentUID);

        const properties = await recurse(visitor, { schema: componentSchema, path }, value);
        newProperties = merge(newProperties, properties);
      }

      Object.assign(newValue, newProperties);

      // Handle new morph fragment syntax
      if ('on' in value && value.on) {
        const newOn = await recurse(visitor, { schema, path }, { on: value.on });

        // Recompose both syntaxes
        Object.assign(newValue, newOn);
      }

      set(key, newValue);
    } else {
      const newValue = await recurse(visitor, { schema, path }, value);

      set(key, newValue);
    }
  });

export default curry(populate.traverse);
