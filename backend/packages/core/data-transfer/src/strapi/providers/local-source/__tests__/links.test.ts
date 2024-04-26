import { Readable } from 'stream';

import { createLinksStream } from '../links';
import { collect, getStrapiFactory } from '../../../../__tests__/test-utils';

// TODO: entityService needs to be replaced with a mocked wrapper of db.connection and provide real metadata
describe.skip('Local Strapi Source Provider - Entities Streaming', () => {
  describe('Create Links Stream', () => {
    test('should return an empty stream if no content types ', async () => {
      const strapi = getStrapiFactory({
        contentTypes: {},
        components: {},
        entityService: { findMany: jest.fn(() => []) },
      })();

      const stream = createLinksStream(strapi);

      expect(stream).toBeInstanceOf(Readable);

      const links = await collect(stream);

      expect(strapi.entityService.findMany).not.toHaveBeenCalled();
      expect(links).toHaveLength(0);
    });

    test('should return an empty stream if content types but without links (but has components, dynamic zones) ', async () => {
      const strapi = getStrapiFactory({
        contentTypes: {
          blog: {
            uid: 'blog',
            attributes: {
              title: {
                type: 'string',
              },
              compo: {
                type: 'component',
                component: 'somecomponent',
              },
              dz: {
                type: 'dynamiczone',
                components: ['somecomponent'],
              },
            },
          },
        },
        components: {
          somecomponent: {
            uid: 'somecomponent',
            attributes: {
              title: {
                type: 'string',
              },
            },
          },
        },
        entityService: {
          findMany: jest.fn(() => [{ id: 1 }, { id: 2 }]),
        },
      })();

      const stream = createLinksStream(strapi);

      expect(stream).toBeInstanceOf(Readable);

      const links = await collect(stream);

      expect(strapi.entityService.findMany).toHaveBeenCalledTimes(1);
      expect(strapi.entityService.findMany).toHaveBeenCalledWith('blog', {
        fields: ['id'],
        // We should not populate the component & dynamic zone
        // attributes since they do not contains any relations
        populate: {},
      });
      expect(links).toHaveLength(0);
    });

    test('Should return an empty stream if no links have been created for the relations', async () => {
      const strapi = getStrapiFactory({
        contentTypes: {
          blog: {
            uid: 'blog',
            attributes: {
              title: {
                type: 'string',
              },
              compo: {
                type: 'component',
                component: 'somecomponent',
              },
              dz: {
                type: 'dynamiczone',
                components: ['somecomponent'],
              },
              blog: {
                type: 'relation',
                relation: 'oneToOne',
                target: 'blog',
              },
            },
          },
        },
        components: {
          somecomponent: {
            uid: 'somecomponent',
            attributes: {
              title: {
                type: 'string',
              },
              blog: {
                type: 'relation',
                target: 'blog',
                relation: 'oneToOne',
              },
            },
          },
        },
        entityService: {
          findMany: jest.fn(() => [
            {
              id: 1,
              compo: { id: 1, blog: null },
              dz: [
                { __component: 'somecomponent', id: 1, blog: null },
                { __component: 'somecomponent', id: 2, blog: null },
              ],
              blog: null,
            },
            {
              id: 2,
              compo: { id: 3, blog: null },
              dz: [
                { __component: 'somecomponent', id: 2, blog: null },
                { __component: 'somecomponent', id: 3, blog: null },
              ],
              blog: null,
            },
          ]),
        },
      })();

      const stream = createLinksStream(strapi);

      expect(stream).toBeInstanceOf(Readable);

      const links = await collect(stream);

      expect(strapi.entityService.findMany).toHaveBeenCalledTimes(1);
      expect(strapi.entityService.findMany).toHaveBeenCalledWith('blog', {
        fields: ['id'],
        populate: {
          blog: {
            fields: ['id'],
          },
          compo: {
            fields: ['id'],
            populate: {
              blog: {
                fields: ['id'],
              },
            },
          },
          dz: {
            fields: ['id'],
            populate: {
              blog: {
                fields: ['id'],
              },
            },
          },
        },
      });
      expect(links).toHaveLength(0);
    });

    test('Should return a populated stream if there are content types with actual relation items', async () => {
      const strapi = getStrapiFactory({
        contentTypes: {
          blog: {
            uid: 'blog',
            attributes: {
              title: {
                type: 'string',
              },
              compo: {
                type: 'component',
                component: 'somecomponent',
              },
              dz: {
                type: 'dynamiczone',
                components: ['somecomponent'],
              },
              blog: {
                type: 'relation',
                relation: 'oneToOne',
                target: 'blog',
              },
            },
          },
        },
        components: {
          somecomponent: {
            uid: 'somecomponent',
            attributes: {
              title: {
                type: 'string',
              },
              blog: {
                type: 'relation',
                target: 'blog',
                relation: 'oneToOne',
              },
            },
          },
        },
        entityService: {
          findMany: jest.fn(() => [
            {
              id: 1,
              compo: { id: 1, blog: { id: 2 } },
              dz: [
                { __component: 'somecomponent', id: 2, blog: { id: 2 } },
                { __component: 'somecomponent', id: 3, blog: null },
              ],
              blog: { id: 2 },
            },
            {
              id: 2,
              compo: { id: 4, blog: null },
              dz: [
                { __component: 'somecomponent', id: 5, blog: null },
                { __component: 'somecomponent', id: 6, blog: { id: 1 } },
              ],
              blog: null,
            },
          ]),
        },
      })();

      const stream = createLinksStream(strapi);

      expect(stream).toBeInstanceOf(Readable);

      const links = await collect(stream);

      expect(strapi.entityService.findMany).toHaveBeenCalledTimes(1);
      expect(strapi.entityService.findMany).toHaveBeenCalledWith('blog', {
        fields: ['id'],
        populate: {
          blog: {
            fields: ['id'],
          },
          compo: {
            fields: ['id'],
            populate: {
              blog: {
                fields: ['id'],
              },
            },
          },
          dz: {
            fields: ['id'],
            populate: {
              blog: {
                fields: ['id'],
              },
            },
          },
        },
      });
      expect(links).toHaveLength(4);
      expect(links).toMatchObject(
        expect.objectContaining([
          {
            kind: 'relation.basic',
            relation: 'oneToOne',
            left: {
              type: 'somecomponent',
              ref: 1,
              field: 'blog',
            },
            right: {
              type: 'blog',
              ref: 2,
            },
          },
          {
            kind: 'relation.basic',
            relation: 'oneToOne',
            left: {
              type: 'somecomponent',
              ref: 2,
              field: 'blog',
            },
            right: {
              type: 'blog',
              ref: 2,
            },
          },
          {
            kind: 'relation.circular',
            relation: 'oneToOne',
            left: {
              type: 'blog',
              ref: 1,
              field: 'blog',
            },
            right: {
              type: 'blog',
              ref: 2,
            },
          },
          {
            kind: 'relation.basic',
            relation: 'oneToOne',
            left: {
              type: 'somecomponent',
              ref: 6,
              field: 'blog',
            },
            right: {
              type: 'blog',
              ref: 1,
            },
          },
        ])
      );
    });
  });
});
