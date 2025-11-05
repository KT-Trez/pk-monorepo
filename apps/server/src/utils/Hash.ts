import { type BinaryLike, randomBytes, scrypt } from 'node:crypto';

// biome-ignore lint/complexity/noStaticOnlyClass: this is a utility class
export class HashUtilities {
  static generateSalt(size = 128) {
    return randomBytes(size);
  }

  static hashPassword(password: string, salt: BinaryLike) {
    return new Promise<Buffer<ArrayBufferLike>>((resolve, reject) => {
      scrypt(password, salt, 128, (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          resolve(derivedKey);
        }
      });
    });
  }
}
