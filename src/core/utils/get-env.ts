import { IncomingHttpHeaders } from "http";

export class GetEnv {
  static getEnv(headers?: IncomingHttpHeaders): string {
    const env = headers?.['x-env'] || headers?.['env'] || 'default';
    return String(env);
  }
}