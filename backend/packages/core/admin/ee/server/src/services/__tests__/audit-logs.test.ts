import EE from '@strapi/strapi/dist/utils/ee';
import auditLogs from '@strapi/provider-audit-logs-local';
import { scheduleJob } from 'node-schedule';
import createAuditLogsService from '../audit-logs';
import createEventHub from '../../../../../../strapi/dist/services/event-hub';
import '@strapi/types';
import { LoadedStrapi } from '@strapi/types';

const { register } = auditLogs;

jest.mock('../../../../../server/src/register');

jest.mock('../../utils', () => ({
  getService: jest.fn().mockReturnValue({}),
}));

jest.mock('@strapi/strapi/dist/utils/ee', () => ({
  features: {
    isEnabled: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock('@strapi/provider-audit-logs-local', () => ({
  register: jest.fn(),
}));

jest.mock('node-schedule', () => ({
  scheduleJob: jest.fn(),
}));

// import eeAdminRegister from '../../register';

describe('Audit logs service', () => {
  afterEach(() => {
    jest.resetModules();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Init with audit logs disabled', () => {
    beforeAll(() => {
      // @ts-expect-error - isEnabled is a mock
      EE.features.isEnabled.mockReturnValue(false);
    });

    it('should not register the audit logs service when is disabled by the user', async () => {
      const eeAdminRegister = require('../../register').default;
      const mockRegister = jest.fn();

      const strapi = {
        container: {
          register: mockRegister,
        },
        config: {
          get: () => false,
        },
      } as any;

      await eeAdminRegister({ strapi });

      expect(mockRegister).not.toHaveBeenCalledWith('audit-logs', expect.anything());
    });

    it('should not subscribe to events when the license does not allow it', async () => {
      const mockSubscribe = jest.fn();

      const strapi = {
        container: {
          register: jest.fn(),
        },
        config: {
          get(key: any) {
            switch (key) {
              case 'admin.auditLogs.enabled':
                return true;
              case 'admin.auditLogs.retentionDays':
                return undefined;
              default:
                return null;
            }
          },
        },
        eventHub: {
          ...createEventHub(),
          subscribe: mockSubscribe,
        },
        hook: () => ({
          register: jest.fn(),
        }),
      } as any;

      // Should not subscribe to events at first
      const auditLogsService = createAuditLogsService(strapi);
      await auditLogsService.register();
      expect(mockSubscribe).not.toHaveBeenCalled();

      // Should subscribe to events when license gets enabled
      // @ts-expect-error - isEnabled is a mock
      EE.features.isEnabled.mockImplementationOnce(() => true);
      await strapi.eventHub.emit('ee.enable');
      expect(mockSubscribe).toHaveBeenCalled();

      // Should unsubscribe to events when license gets disabled
      mockSubscribe.mockClear();
      // @ts-expect-error - isEnabled is a mock
      EE.features.isEnabled.mockImplementationOnce(() => false);
      await strapi.eventHub.emit('ee.disable');
      expect(mockSubscribe).not.toHaveBeenCalled();

      // Should recreate the service when license updates
      const destroySpy = jest.spyOn(auditLogsService, 'destroy');
      const registerSpy = jest.spyOn(auditLogsService, 'register');
      await strapi.eventHub.emit('ee.update');
      expect(destroySpy).toHaveBeenCalled();
      expect(registerSpy).toHaveBeenCalled();
    });
  });

  describe('Init with audit logs enabled', () => {
    const mockRegister = jest.fn();
    const mockScheduleJob = jest.fn((rule, callback) => callback());

    // Audit logs Local Provider mocks
    const mockSaveEvent = jest.fn();
    const mockFindOne = jest.fn();
    const mockFindMany = jest.fn();
    const mockDeleteExpiredEvents = jest.fn();

    let strapi = {} as LoadedStrapi;

    beforeAll(() => {
      // @ts-expect-error - isEnabled is a mock
      EE.features.isEnabled.mockReturnValue(true);
      // @ts-expect-error - register is a mock
      register.mockReturnValue({
        saveEvent: mockSaveEvent,
        findOne: mockFindOne,
        findMany: mockFindMany,
        deleteExpiredEvents: mockDeleteExpiredEvents,
      });
      // @ts-expect-error - scheduleJob is a mock
      scheduleJob.mockImplementation(mockScheduleJob);

      strapi = {
        admin: {
          services: {
            permission: {
              actionProvider: { registerMany: jest.fn() },
            },
          },
        },
        container: {
          register: mockRegister,
        },
        eventHub: createEventHub(),
        hook: () => ({ register: () => this }),
        config: {
          get: () => 90,
        },
        db: {
          transaction(cb: any) {
            const opt = {
              onCommit(func: any) {
                return func();
              },
            };
            return cb(opt);
          },
        },
      } as unknown as LoadedStrapi;
    });

    afterEach(() => {
      mockSaveEvent.mockClear();
      mockFindMany.mockClear();
      mockScheduleJob.mockClear();
    });

    beforeEach(() => {
      strapi.requestContext = {
        // @ts-expect-error - mocking the request context
        get() {
          return {
            state: {
              user: {
                id: 1,
              },
              auth: {
                strategy: {
                  name: 'admin',
                },
              },
            },
          };
        },
      };
    });

    it('should register and init the audit logs service when registered', async () => {
      const eeAdminRegister = require('../../register').default;
      await eeAdminRegister({ strapi });

      expect(mockRegister).toHaveBeenCalledWith('audit-logs', expect.anything());
    });

    it('should emit an event and capture it in the audit logs', async () => {
      const auditLogsService = createAuditLogsService(strapi);
      await auditLogsService.register();

      jest.useFakeTimers().setSystemTime(new Date('1970-01-01T00:00:00.000Z'));

      await strapi.eventHub.emit('entry.create', { meta: 'test' });

      // Sends the processed event to a provider
      expect(mockSaveEvent).toHaveBeenCalledTimes(1);
      expect(mockSaveEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'entry.create',
          date: '1970-01-01T00:00:00.000Z',
          payload: { meta: 'test' },
          userId: 1,
        })
      );
    });

    it('ignores events that are not in the event map', async () => {
      const auditLogsService = createAuditLogsService(strapi);
      auditLogsService.register();

      const eventName = 'unknown';
      const eventPayload = { meta: 'test' };
      await strapi.eventHub.emit(eventName, eventPayload);

      expect(mockSaveEvent).not.toHaveBeenCalled();
    });

    it('ignores entry events from the upload plugin', async () => {
      const auditLogsService = createAuditLogsService(strapi);
      auditLogsService.register();

      await strapi.eventHub.emit('entry.create', { uid: 'plugin::upload.file' });
      await strapi.eventHub.emit('entry.update', { uid: 'plugin::upload.folder' });

      expect(mockSaveEvent).not.toHaveBeenCalled();
    });

    it('should find many audit logs with the right params', async () => {
      const auditLogsService = createAuditLogsService(strapi);
      await auditLogsService.register();
      mockFindMany.mockResolvedValueOnce({ results: [], pagination: {} });

      await strapi.eventHub.emit('entry.create', { meta: 'test' });

      const params = { page: 1, pageSize: 10, order: 'createdAt:DESC' };
      const result = await auditLogsService.findMany(params);

      expect(mockFindMany).toHaveBeenCalledTimes(1);
      expect(mockFindMany).toHaveBeenCalledWith(params);
      expect(result).toEqual({ results: [], pagination: {} });
    });

    it('should find one audit log with the right params', async () => {
      const auditLogsService = createAuditLogsService(strapi);
      await auditLogsService.register();
      mockFindOne.mockResolvedValueOnce({ id: 1, user: null });

      await strapi.eventHub.emit('entry.create', { meta: 'test' });

      const result = await auditLogsService.findOne(1);

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: 1, user: null });
    });

    it('should create a cron job that executed one time a day', async () => {
      const auditLogsService = createAuditLogsService(strapi);
      await auditLogsService.register();

      expect(mockScheduleJob).toHaveBeenCalledTimes(1);
      expect(mockScheduleJob).toHaveBeenCalledWith('0 0 * * *', expect.any(Function));
      expect(mockDeleteExpiredEvents).toHaveBeenCalledWith(expect.any(Date));
    });

    it('should not log event if strategy is not admin', async () => {
      strapi.requestContext = {
        // @ts-expect-error - mocking the request context
        get() {
          return {
            state: {
              auth: {
                strategy: {
                  name: 'content-api',
                },
              },
            },
          };
        },
      };

      const auditLogsService = createAuditLogsService(strapi);
      await auditLogsService.register();

      await strapi.eventHub.emit('entry.create', { meta: 'test' });

      expect(mockSaveEvent).not.toHaveBeenCalled();
    });
  });
});
