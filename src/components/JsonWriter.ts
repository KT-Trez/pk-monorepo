import fs from 'fs';
import { WriterInterface } from '../types';

export class JsonWriter<T> implements WriterInterface<T> {
  write(dataT: T, jsonPath: string) {
    if (fs.existsSync(jsonPath)) {
      fs.rmSync(jsonPath);
    }

    fs.writeFileSync(jsonPath, JSON.stringify(dataT), { encoding: 'utf-8' });
  }
}
