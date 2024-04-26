import { extendType } from 'nexus';
import type * as Nexus from 'nexus';
import type { Schema } from '@strapi/types';
import type { Context } from '../../types';

export default ({ strapi }: Context) => {
  const { service: getService } = strapi.plugin('graphql');

  const { naming } = getService('utils');
  const { transformArgs, getContentTypeArgs } = getService('builders').utils;
  const { toEntityResponse, toEntityResponseCollection } = getService('format').returnTypes;

  const {
    getFindOneQueryName,
    getEntityResponseName,
    getFindQueryName,
    getEntityResponseCollectionName,
  } = naming;

  const buildCollectionTypeQueries = (contentType: Schema.CollectionType) => {
    const findOneQueryName = `Query.${getFindOneQueryName(contentType)}`;
    const findQueryName = `Query.${getFindQueryName(contentType)}`;

    const extension = getService('extension');

    const registerAuthConfig = (action: string, auth: any) => {
      return extension.use({ resolversConfig: { [action]: { auth } } });
    };

    const isActionEnabled = (action: string) => {
      return extension.shadowCRUD(contentType.uid).isActionEnabled(action);
    };

    const isFindOneEnabled = isActionEnabled('findOne');
    const isFindEnabled = isActionEnabled('find');

    if (isFindOneEnabled) {
      registerAuthConfig(findOneQueryName, { scope: [`${contentType.uid}.findOne`] });
    }

    if (isFindEnabled) {
      registerAuthConfig(findQueryName, { scope: [`${contentType.uid}.find`] });
    }

    return extendType({
      type: 'Query',

      definition(t) {
        if (isFindOneEnabled) {
          addFindOneQuery(t, contentType);
        }

        if (isFindEnabled) {
          addFindQuery(t, contentType);
        }
      },
    });
  };

  /**
   * Register a "find one" query field to the nexus type definition
   */
  const addFindOneQuery = (
    t: Nexus.blocks.ObjectDefinitionBlock<'Query'>,
    contentType: Schema.CollectionType
  ) => {
    const { uid } = contentType;

    const findOneQueryName = getFindOneQueryName(contentType);
    const responseTypeName = getEntityResponseName(contentType);

    t.field(findOneQueryName, {
      type: responseTypeName,

      args: getContentTypeArgs(contentType, { multiple: false }),

      async resolve(parent, args, ctx) {
        const transformedArgs = transformArgs(args, { contentType });

        const { findOne } = getService('builders')
          .get('content-api')
          .buildQueriesResolvers({ contentType });

        // queryResolvers will sanitize params
        const value = findOne(parent, transformedArgs, ctx);

        return toEntityResponse(value, { args: transformedArgs, resourceUID: uid });
      },
    });
  };

  /**
   * Register a "find" query field to the nexus type definition
   */
  const addFindQuery = (
    t: Nexus.blocks.ObjectDefinitionBlock<'Query'>,
    contentType: Schema.CollectionType
  ) => {
    const { uid } = contentType;

    const findQueryName = getFindQueryName(contentType);
    const responseCollectionTypeName = getEntityResponseCollectionName(contentType);

    t.field(findQueryName, {
      type: responseCollectionTypeName,

      args: getContentTypeArgs(contentType),

      async resolve(parent, args, ctx) {
        const transformedArgs = transformArgs(args, { contentType, usePagination: true });

        const { find } = getService('builders')
          .get('content-api')
          .buildQueriesResolvers({ contentType });

        // queryResolvers will sanitize params
        const nodes = await find(parent, transformedArgs, ctx);

        return toEntityResponseCollection(nodes, { args: transformedArgs, resourceUID: uid });
      },
    });
  };

  return { buildCollectionTypeQueries };
};
