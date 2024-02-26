// noinspection JSUnresolvedReference

import type { WriterInterface } from '@types';
import fs from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

export class StreamWriter implements WriterInterface<URL> {
  async write(streamURL: URL, streamFilePath: string) {
    if (fs.existsSync(streamFilePath)) {
      fs.rmSync(streamFilePath);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const stream = await fetch(streamURL.toString());

    await finished(Readable.fromWeb(stream.body).pipe(fs.createWriteStream(streamFilePath)));
  }
}
