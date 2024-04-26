import { resolve, join } from 'path';
import { ALLOWED_CONTENT_TYPES, CUSTOM_TRANSFER_TOKEN_ACCESS_KEY } from '../constants';

const {
  file: {
    providers: { createLocalFileSourceProvider },
  },
  strapi: {
    providers: { createRemoteStrapiDestinationProvider },
  },
  engine: { createTransferEngine },
} = require('@strapi/data-transfer');

/**
 * Reset the DB and import data from a DTS backup
 * This function ensures we keep all admin user's and roles in the DB
 * see: https://docs.strapi.io/developer-docs/latest/developer-resources/data-management.html
 * @param {String} filePath the path to a DTS backup
 */
export const resetDatabaseAndImportDataFromPath = async (file) => {
  const filePath = join('./tests/e2e/data/', file);
  const source = createSourceProvider(filePath);
  const destination = createDestinationProvider();

  const engine = createTransferEngine(source, destination, {
    versionStrategy: 'ignore',
    schemaStrategy: 'ignore',
    only: ['content', 'files'],
    transforms: {
      links: [
        {
          filter(link) {
            return (
              ALLOWED_CONTENT_TYPES.includes(link.left.type) &&
              (ALLOWED_CONTENT_TYPES.includes(link.right.type) || link.right.type === undefined)
            );
          },
        },
      ],
      entities: [
        {
          filter(entity) {
            return ALLOWED_CONTENT_TYPES.includes(entity.type);
          },
        },
      ],
    },
  });

  engine.diagnostics.onDiagnostic(console.log);

  try {
    // reset the transfer token to allow the transfer if it's been wiped (that is, not included in previous import data)
    const res = await fetch(
      `http://127.0.0.1:${process.env.PORT ?? 1337}/api/config/resettransfertoken`,
      {
        method: 'POST',
      }
    );
  } catch (err) {
    console.error('Token reset failed.' + JSON.stringify(err, null, 2));
    process.exit(1);
  }

  try {
    await engine.transfer();
  } catch {
    console.error('Import process failed.');
    process.exit(1);
  }
};

const createSourceProvider = (filePath) =>
  createLocalFileSourceProvider({
    file: { path: resolve(filePath) },
    encryption: { enabled: false },
    compression: { enabled: false },
  });

const createDestinationProvider = () => {
  return createRemoteStrapiDestinationProvider({
    url: new URL(`http://127.0.0.1:${process.env.PORT ?? 1337}/admin`),
    auth: { type: 'token', token: CUSTOM_TRANSFER_TOKEN_ACCESS_KEY },
    strategy: 'restore',
    restore: {
      assets: true,
      entities: {
        include: ALLOWED_CONTENT_TYPES,
      },
      configuration: {
        coreStore: false,
        webhook: false,
      },
    },
  });
};
