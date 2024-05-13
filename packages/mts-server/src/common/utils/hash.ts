import * as crypto from 'crypto';

export function hash(value: string): string {
  return crypto.createHash('md5').update(value).digest('hex');
}

export function compare(value: string, hashString: string): boolean {
  return hash(value) === hashString;
}
