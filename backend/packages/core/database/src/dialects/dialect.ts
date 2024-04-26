import type { Database } from '..';
import type { Schema } from '../schema';

export interface SchemaInspector {
  getSchema(): Promise<Schema>;
}

export default class Dialect {
  db: Database;

  schemaInspector: SchemaInspector = {} as SchemaInspector;

  client: string;

  constructor(db: Database, client: string) {
    this.db = db;
    this.client = client;
  }

  configure() {}

  initialize() {}

  getSqlType(type: unknown) {
    return type;
  }

  canAlterConstraints() {
    return true;
  }

  usesForeignKeys() {
    return false;
  }

  useReturning() {
    return false;
  }

  supportsUnsigned() {
    return false;
  }

  supportsWindowFunctions() {
    return true;
  }

  supportsOperator(operator?: string): boolean;
  supportsOperator(): boolean {
    return true;
  }

  async startSchemaUpdate() {
    // noop
  }

  async endSchemaUpdate() {
    // noop
  }

  transformErrors(error: Error | { message: string }) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(error.message);
  }

  canAddIncrements() {
    return true;
  }
}
