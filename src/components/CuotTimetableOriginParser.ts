// noinspection JSUnresolvedReference

import { ParserInterface } from '../types';

export class CuotTimetableOriginParser
  implements ParserInterface<Promise<string[]>>
{
  async parse(cuotTimetableOrigin: string): Promise<string[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const cuotTimetableRes = await fetch(cuotTimetableOrigin);
    const cuotTimetableOriginString = await cuotTimetableRes.text();

    const downloads = cuotTimetableOriginString.match(
      /(?<=\/)download.*(?=")/gm,
    );
    if (!downloads) {
      return [];
    }
    return downloads;
  }
}
