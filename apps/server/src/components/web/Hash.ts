import { scrypt, scryptSync } from 'node:crypto';

const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;

export class Hash {
  static #instance: Hash;

  #seed: Buffer;

  constructor() {
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

    this.#seed = Buffer.from(seed);
  }

  static get instance() {
    if (!Hash.#instance) {
      Hash.#instance = new Hash();
    }

    return Hash.#instance;
  }

  hashPassword(password: string) {
    return new Promise<Buffer<ArrayBufferLike>>((resolve, reject) => {
      scrypt(password, this.#seed, 82, (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          resolve(derivedKey);
        }
      });
    });
  }

  hashPasswordSync(password: string) {
    return scryptSync(password, this.#seed, 82);
  }
}
