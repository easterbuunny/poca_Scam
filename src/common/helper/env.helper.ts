import { resolve } from 'path';

export function getEnvPath(dest: string): string {
  const env: string = process.env.NODE_ENV || 'development';
  return resolve(`${dest}/${env}.env`);
}
