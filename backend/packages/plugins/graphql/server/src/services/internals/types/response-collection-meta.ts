import { objectType } from 'nexus';
import { sanitize, validate } from '@strapi/utils';
import type { Context } from '../../types';

export default ({ strapi }: Context) => {
  const { RESPONSE_COLLECTION_META_TYPE_NAME, PAGINATION_TYPE_NAME } = strapi
    .plugin('graphql')
    .service('constants');

  return {
    /**
     * A shared type definition used in EntitiesResponseCollection
     * to have information about the collection as a whole
     * @type {NexusObjectTypeDef}
     */
    ResponseCollectionMeta: objectType({
      name: RESPONSE_COLLECTION_META_TYPE_NAME,

      definition(t) {
        t.nonNull.field('pagination', {
          type: PAGINATION_TYPE_NAME,

          async resolve(parent, _childArgs, ctx) {
            const { args, resourceUID } = parent;
            const { start, limit } = args;
            const safeLimit = Math.max(limit, 1);
            const contentType = strapi.getModel(resourceUID);
            await validate.contentAPI.query(args, contentType, {
              auth: ctx?.state?.auth,
            });
            const sanitizedQuery = await sanitize.contentAPI.query(args, contentType, {
              auth: ctx?.state?.auth,
            });
            const total = await strapi.entityService!.count(resourceUID, sanitizedQuery);
            const pageSize = limit === -1 ? total - start : safeLimit;
            const pageCount = limit === -1 ? safeLimit : Math.ceil(total / safeLimit);
            const page = limit === -1 ? safeLimit : Math.floor(start / safeLimit) + 1;

            return { total, page, pageSize, pageCount };
          },
        });
      },
    }),
  };
};
