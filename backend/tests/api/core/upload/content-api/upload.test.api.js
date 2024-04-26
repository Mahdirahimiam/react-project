'use strict';

const fs = require('fs');
const path = require('path');
const get = require('lodash/get');

// Helpers.
const { createTestBuilder } = require('api-tests/builder');
const { createStrapiInstance } = require('api-tests/strapi');
const { createContentAPIRequest } = require('api-tests/request');

const builder = createTestBuilder();
const data = { dogs: [] };
let strapi;
let rq;

const dogModel = {
  displayName: 'Dog',
  singularName: 'dog',
  pluralName: 'dogs',
  kind: 'collectionType',
  attributes: {
    profilePicture: {
      type: 'media',
    },
  },
};

const todoListModel = {
  displayName: 'TodoList',
  singularName: 'todolist',
  pluralName: 'todolists',
  kind: 'collectionType',
  attributes: {
    title: {
      type: 'string',
    },
    todo: {
      displayName: 'todo',
      type: 'component',
      repeatable: true,
      component: 'default.todo',
    },
  },
};

const todoComponent = {
  displayName: 'Todo',
  attributes: {
    docs: {
      allowedTypes: ['images', 'files', 'videos', 'audios'],
      type: 'media',
      multiple: true,
    },
    task: {
      type: 'string',
    },
  },
};

describe('Upload plugin', () => {
  beforeAll(async () => {
    await builder
      .addContentType(dogModel)
      .addComponent(todoComponent)
      .addContentType(todoListModel)
      .build();
    strapi = await createStrapiInstance();
    rq = createContentAPIRequest({ strapi });
  });

  afterAll(async () => {
    await strapi.destroy();
    await builder.cleanup();
  });

  describe('Create', () => {
    test('Simple image upload', async () => {
      const res = await rq({
        method: 'POST',
        url: '/upload',
        formData: {
          files: fs.createReadStream(path.join(__dirname, '../utils/rec.jpg')),
        },
      });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toEqual(
        expect.objectContaining({
          id: expect.anything(),
          name: 'rec.jpg',
          ext: '.jpg',
          mime: 'image/jpeg',
          hash: expect.any(String),
          size: expect.any(Number),
          width: expect.any(Number),
          height: expect.any(Number),
          url: expect.any(String),
          provider: 'local',
        })
      );
    });

    test('Rejects when no files are provided', async () => {
      const res = await rq({ method: 'POST', url: '/upload', formData: {} });
      expect(res.statusCode).toBe(400);
    });

    test('Generates a thumbnail on large enough files', async () => {
      const res = await rq({
        method: 'POST',
        url: '/upload',
        formData: {
          files: fs.createReadStream(path.join(__dirname, '../utils/thumbnail_target.png')),
        },
      });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toEqual(
        expect.objectContaining({
          id: expect.anything(),
          name: 'thumbnail_target.png',
          ext: '.png',
          mime: 'image/png',
          hash: expect.any(String),
          size: expect.any(Number),
          width: expect.any(Number),
          height: expect.any(Number),
          url: expect.any(String),
          provider: 'local',
          formats: {
            thumbnail: {
              name: 'thumbnail_thumbnail_target.png',
              hash: expect.any(String),
              ext: '.png',
              mime: 'image/png',
              size: expect.any(Number),
              sizeInBytes: expect.any(Number),
              width: expect.any(Number),
              height: expect.any(Number),
              url: expect.any(String),
              path: null,
            },
          },
        })
      );
    });
  });

  describe('Read', () => {
    test('Get files', async () => {
      const getRes = await rq({ method: 'GET', url: '/upload/files' });

      expect(getRes.statusCode).toBe(200);
      expect(getRes.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.anything(),
            url: expect.any(String),
          }),
        ])
      );
    });
    test('Get one file', async () => {
      const dogEntity = await strapi.entityService.create('api::dog.dog', {
        data: {},
        files: {
          profilePicture: {
            path: path.join(__dirname, '../utils/rec.jpg'),
            name: 'rec',
            type: 'jpg',
            size: 0,
          },
        },
        populate: 'profilePicture',
      });
      const getRes = await rq({
        method: 'GET',
        url: `/upload/files/${dogEntity.profilePicture.id}`,
      });

      expect(getRes.statusCode).toBe(200);
      expect(getRes.body).toEqual(
        expect.objectContaining({
          id: expect.anything(),
          url: expect.any(String),
        })
      );
      await strapi.entityService.delete('api::dog.dog', dogEntity.id);
      await strapi.entityService.delete('plugin::upload.file', dogEntity.profilePicture.id);
    });
  });

  describe('Create an entity with a file', () => {
    test('With an image', async () => {
      const res = await rq({
        method: 'POST',
        url: '/dogs?populate=*',
        formData: {
          data: '{}',
          'files.profilePicture': fs.createReadStream(path.join(__dirname, '../utils/rec.jpg')),
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        data: {
          attributes: {
            profilePicture: {
              data: {
                id: expect.anything(),
                attributes: {
                  provider: 'local',
                },
              },
            },
          },
          id: expect.anything(),
        },
      });

      data.dogs.push(res.body);
    });

    test('With a pdf', async () => {
      const res = await rq({
        method: 'POST',
        url: '/dogs?populate=*',
        formData: {
          data: '{}',
          'files.profilePicture': fs.createReadStream(path.join(__dirname, '../utils/rec.pdf')),
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        data: {
          attributes: {
            profilePicture: {
              data: {
                id: expect.anything(),
                attributes: {
                  provider: 'local',
                },
              },
            },
          },
          id: expect.anything(),
        },
      });
      data.dogs.push(res.body);
    });
    test('File should have related field', async () => {
      const fileId = get(data, 'dogs[0].data.attributes.profilePicture.data.id');

      expect(fileId).toBeDefined();

      const getRes = await rq({
        method: 'GET',
        url: `/upload/files/${fileId}`,
        qs: { populate: '*' },
      });

      expect(getRes.statusCode).toBe(200);
      expect(getRes.body).toEqual(
        expect.objectContaining({
          id: fileId,
          related: [expect.any(Object)],
        })
      );
    });
  });

  describe('Create an entity with a component with a file', () => {
    test('With an image', async () => {
      const res = await rq({
        method: 'POST',
        url: '/todolists',
        formData: {
          data: '{"title":"Test todolist title","todo":[{"task":"First todo"},{"task":"Second todo"}]}',
          'files.todo.0.docs': fs.createReadStream(path.join(__dirname, '../utils/rec.jpg')),
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        data: {
          attributes: {
            title: 'Test todolist title',
          },
          id: expect.anything(),
        },
      });
      const newlyCreatedTodolist = await rq({
        method: 'GET',
        url: `/todolists/${res.body.data.id}`,
        qs: {
          populate: ['todo', 'todo.docs'],
        },
      });

      expect(newlyCreatedTodolist.body).toBeDefined();
      expect(newlyCreatedTodolist.body).toMatchObject({
        data: {
          attributes: {
            title: 'Test todolist title',
            todo: [
              {
                id: expect.anything(),
                task: 'First todo',
                docs: {
                  data: [
                    {
                      id: expect.anything(),
                      attributes: {
                        mime: 'image/jpeg',
                        name: 'rec.jpg',
                      },
                    },
                  ],
                },
              },
              expect.any(Object),
            ],
          },
        },
      });
    });
  });

  // see https://github.com/strapi/strapi/issues/14125
  describe('File relations are correctly removed', () => {
    test('Update an entity with a file correctly removes the relation between the entity and its old file', async () => {
      const res = await rq({
        method: 'PUT',
        url: `/dogs/${data.dogs[0].data.id}?populate=*`,
        formData: {
          data: '{}',
          'files.profilePicture': fs.createReadStream(path.join(__dirname, '../utils/strapi.jpg')),
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.attributes.profilePicture.data.id).not.toBe(
        data.dogs[0].data.attributes.profilePicture.data.id
      );

      data.dogs[0] = res.body;
    });

    test('Update a file with an entity correctly removes the relation between the entity and its old file', async () => {
      const fileId = data.dogs[1].data.attributes.profilePicture.data.id;
      await strapi.entityService.update('plugin::upload.file', fileId, {
        data: {
          related: [
            {
              id: data.dogs[0].data.id,
              __type: 'api::dog.dog',
              __pivot: { field: 'profilePicture' },
            },
          ],
        },
      });

      const res = await rq({
        method: 'GET',
        url: `/dogs/${data.dogs[0].data.id}?populate=*`,
      });
      expect(res.body.data.attributes.profilePicture.data.id).toBe(fileId);

      data.dogs[0] = res.body;
    });
  });

  describe('Filtering data based on media attributes', () => {
    let uploadRes;
    let dogRes;

    beforeAll(async () => {
      await Promise.all(
        data.dogs.map((dog) => {
          return strapi.entityService.delete('api::dog.dog', dog.data.id);
        })
      );

      uploadRes = await rq({
        method: 'POST',
        url: '/upload',
        formData: {
          files: fs.createReadStream(path.join(__dirname, '../utils/rec.jpg')),
          fileInfo: JSON.stringify({
            alternativeText: 'rec',
            caption: 'my caption',
          }),
        },
      });

      dogRes = await rq({
        method: 'POST',
        url: '/dogs',
        body: {
          data: {
            profilePicture: {
              id: uploadRes.body[0].id,
            },
          },
        },
      });
    });

    afterAll(async () => {
      await rq({
        method: 'DELETE',
        url: `/dogs/${dogRes.body.data.id}`,
      });

      await rq({
        method: 'DELETE',
        url: `/upload/files/${uploadRes.body[0].id}`,
      });
    });

    test('can filter on notNull', async () => {
      let res;

      res = await rq({
        method: 'GET',
        url: '/dogs',
        qs: {
          filters: {
            profilePicture: { $notNull: true },
          },
        },
      });

      expect(res.body.data.length).toBe(1);

      res = await rq({
        method: 'GET',
        url: '/dogs',
        qs: {
          filters: {
            profilePicture: { $notNull: false },
          },
        },
      });

      expect(res.body.data.length).toBe(0);
    });

    test('can filter on null', async () => {
      let res;

      res = await rq({
        method: 'GET',
        url: '/dogs',
        qs: {
          filters: {
            profilePicture: { $null: true },
          },
        },
      });

      expect(res.body.data.length).toBe(0);

      res = await rq({
        method: 'GET',
        url: '/dogs',
        qs: {
          filters: {
            profilePicture: { $null: false },
          },
        },
      });

      expect(res.body.data.length).toBe(1);
    });

    test('can filter on id', async () => {
      let res;

      res = await rq({
        method: 'GET',
        url: '/dogs',
        qs: {
          filters: {
            profilePicture: uploadRes.body[0].id,
          },
        },
      });

      expect(res.body.data.length).toBe(1);

      res = await rq({
        method: 'GET',
        url: '/dogs',
        qs: {
          filters: {
            profilePicture: 999999999,
          },
        },
      });

      expect(res.body.data.length).toBe(0);
    });

    test('can filter media attribute', async () => {
      let res;

      res = await rq({
        method: 'GET',
        url: '/dogs',
        qs: {
          filters: {
            profilePicture: { ext: '.jpg' },
          },
        },
      });

      expect(res.body.data.length).toBe(1);

      res = await rq({
        method: 'GET',
        url: '/dogs',
        qs: {
          filters: {
            profilePicture: { ext: '.pdf' },
          },
        },
      });

      expect(res.body.data.length).toBe(0);
    });

    test('can filter media attribute with operators', async () => {
      let res;

      res = await rq({
        method: 'GET',
        url: '/dogs',
        qs: {
          filters: {
            profilePicture: {
              caption: {
                $contains: 'my',
              },
            },
          },
        },
      });

      expect(res.body.data.length).toBe(1);

      res = await rq({
        method: 'GET',
        url: '/dogs',
        qs: {
          filters: {
            profilePicture: {
              caption: {
                $contains: 'not',
              },
            },
          },
        },
      });

      expect(res.body.data.length).toBe(0);
    });
  });
});
