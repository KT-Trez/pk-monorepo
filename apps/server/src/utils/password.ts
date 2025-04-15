import { scrypt, scryptSync } from 'node:crypto';

const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;

const SALT = (() => {
  const seed = process.env.AUTH_SEED;

  if (!seed) {
    throw new Error('AUTH_SEED is not set');
  }

  if (seed.length < 16) {
    throw new Error('AUTH_SEED must be at least 16 characters long');
  }

  if (seed.length > 64) {
    throw new Error('AUTH_SEED must be at most 64 characters long');
  }

  if (!ALPHANUMERIC_REGEX.test(seed)) {
    throw new Error('AUTH_SEED must be alphanumeric');
  }

  return Buffer.from(seed);
})();

export const hashPassword = (password: string) => {
  return new Promise<Buffer<ArrayBufferLike>>((resolve, reject) => {
    scrypt(password, SALT, 82, (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(derivedKey);
      }
    });
  });
};

export const hashPasswordSync = (password: string) => {
  return scryptSync(password, SALT, 82);
};
