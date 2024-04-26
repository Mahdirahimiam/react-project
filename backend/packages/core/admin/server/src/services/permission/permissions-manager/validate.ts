import { subject as asSubject, detectSubjectType } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import {
  defaults,
  omit,
  isArray,
  isEmpty,
  isNil,
  flatMap,
  some,
  prop,
  uniq,
  intersection,
  getOr,
  isObject,
} from 'lodash/fp';

import { contentTypes, traverseEntity, traverse, validate, pipeAsync, errors } from '@strapi/utils';
import { ADMIN_USER_ALLOWED_FIELDS } from '../../../domain/user';

const { ValidationError } = errors;
const { throwPassword, throwDisallowedFields } = validate.visitors;

const { constants, isScalarAttribute, getNonVisibleAttributes, getWritableAttributes } =
  contentTypes;
const {
  ID_ATTRIBUTE,
  CREATED_AT_ATTRIBUTE,
  UPDATED_AT_ATTRIBUTE,
  PUBLISHED_AT_ATTRIBUTE,
  CREATED_BY_ATTRIBUTE,
  UPDATED_BY_ATTRIBUTE,
} = constants;

const COMPONENT_FIELDS = ['__component'];

const STATIC_FIELDS = [ID_ATTRIBUTE];

const throwInvalidParam = ({ key }: any) => {
  throw new ValidationError(`Invalid parameter ${key}`);
};

export default ({ action, ability, model }: any) => {
  const schema = strapi.getModel(model);

  const createValidateQuery = (options = {} as any) => {
    const { fields } = options;

    // TODO: validate relations to admin users in all validators
    const permittedFields = fields.shouldIncludeAll ? null : getQueryFields(fields.permitted);

    const validateFilters = pipeAsync(
      traverse.traverseQueryFilters(throwDisallowedFields(permittedFields), { schema }),
      traverse.traverseQueryFilters(throwDisallowedAdminUserFields, { schema }),
      traverse.traverseQueryFilters(throwPassword, { schema }),
      traverse.traverseQueryFilters(
        ({ key, value }) => {
          if (isObject(value) && isEmpty(value)) {
            throwInvalidParam({ key });
          }
        },
        { schema }
      )
    );

    const validateSort = pipeAsync(
      traverse.traverseQuerySort(throwDisallowedFields(permittedFields), { schema }),
      traverse.traverseQuerySort(throwDisallowedAdminUserFields, { schema }),
      traverse.traverseQuerySort(throwPassword, { schema }),
      traverse.traverseQuerySort(
        ({ key, attribute, value }) => {
          if (!isScalarAttribute(attribute) && isEmpty(value)) {
            throwInvalidParam({ key });
          }
        },
        { schema }
      )
    );

    const validateFields = pipeAsync(
      traverse.traverseQueryFields(throwDisallowedFields(permittedFields), { schema }),
      traverse.traverseQueryFields(throwPassword, { schema })
    );

    return async (query: any) => {
      if (query.filters) {
        await validateFilters(query.filters);
      }

      if (query.sort) {
        await validateSort(query.sort);
      }

      if (query.fields) {
        await validateFields(query.fields);
      }

      return true;
    };
  };

  const createValidateInput = (options = {} as any) => {
    const { fields } = options;

    const permittedFields = fields.shouldIncludeAll ? null : getInputFields(fields.permitted);

    return pipeAsync(
      // Remove fields hidden from the admin
      traverseEntity(throwHiddenFields, { schema }),
      // Remove not allowed fields (RBAC)
      // @ts-expect-error lodash types
      traverseEntity(throwDisallowedFields(permittedFields), { schema }),
      // Remove roles from createdBy & updatedBy fields
      omitCreatorRoles
    );
  };

  const wrapValidate = (createValidateFunction: any) => {
    // TODO
    // @ts-expect-error define the correct return type
    const wrappedValidate = async (data, options = {}): Promise<unknown> => {
      if (isArray(data)) {
        return Promise.all(data.map((entity: unknown) => wrappedValidate(entity, options)));
      }

      const { subject, action: actionOverride } = getDefaultOptions(data, options);

      const permittedFields = permittedFieldsOf(ability, actionOverride, subject, {
        fieldsFrom: (rule) => rule.fields || [],
      });

      const hasAtLeastOneRegistered = some(
        (fields) => !isNil(fields),
        flatMap(prop('fields'), ability.rulesFor(actionOverride, detectSubjectType(subject)))
      );
      const shouldIncludeAllFields = isEmpty(permittedFields) && !hasAtLeastOneRegistered;

      const validateOptions = {
        ...options,
        fields: {
          shouldIncludeAll: shouldIncludeAllFields,
          permitted: permittedFields,
          hasAtLeastOneRegistered,
        },
      };

      const validateFunction = createValidateFunction(validateOptions);

      return validateFunction(data);
    };

    return wrappedValidate;
  };

  const getDefaultOptions = (data: any, options: unknown) => {
    return defaults({ subject: asSubject(model, data), action }, options);
  };

  /**
   * Omit creator fields' (createdBy & updatedBy) roles from the admin API responses
   */
  const omitCreatorRoles = omit([`${CREATED_BY_ATTRIBUTE}.roles`, `${UPDATED_BY_ATTRIBUTE}.roles`]);

  /**
   * Visitor used to remove hidden fields from the admin API responses
   */
  const throwHiddenFields = ({ key, schema }: any) => {
    const isHidden = getOr(false, ['config', 'attributes', key, 'hidden'], schema);

    if (isHidden) {
      throwInvalidParam({ key });
    }
  };

  /**
   * Visitor used to omit disallowed fields from the admin users entities & avoid leaking sensitive information
   */
  const throwDisallowedAdminUserFields = ({ key, attribute, schema }: any) => {
    if (schema.uid === 'admin::user' && attribute && !ADMIN_USER_ALLOWED_FIELDS.includes(key)) {
      throwInvalidParam({ key });
    }
  };

  const getInputFields = (fields = []) => {
    const nonVisibleAttributes = getNonVisibleAttributes(schema);
    const writableAttributes = getWritableAttributes(schema);

    const nonVisibleWritableAttributes = intersection(nonVisibleAttributes, writableAttributes);

    return uniq([...fields, ...COMPONENT_FIELDS, ...nonVisibleWritableAttributes]);
  };

  const getQueryFields = (fields = []) => {
    return uniq([
      ...fields,
      ...STATIC_FIELDS,
      ...COMPONENT_FIELDS,
      CREATED_AT_ATTRIBUTE,
      UPDATED_AT_ATTRIBUTE,
      PUBLISHED_AT_ATTRIBUTE,
    ]);
  };

  return {
    validateQuery: wrapValidate(createValidateQuery),
    validateInput: wrapValidate(createValidateInput),
  };
};
