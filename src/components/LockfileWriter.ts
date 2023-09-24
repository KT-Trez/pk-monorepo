import fs from 'fs';
import { WriterInterface } from '../types';

export class LockfileWriter implements WriterInterface<string> {
  write(pubDate: string, lockfilePath: string) {
    if (fs.existsSync(lockfilePath)) {
      fs.rmSync(lockfilePath);
    }

    fs.writeFileSync(lockfilePath, pubDate);
  }
}
