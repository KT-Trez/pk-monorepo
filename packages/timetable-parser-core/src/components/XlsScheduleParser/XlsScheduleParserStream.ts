import { Transform, type TransformCallback } from 'node:stream';
import type { ClassInfo } from '../../types/classInfo.js';
import type { XlsRowData } from '../../types/xls.js';
import { XlsRowDataParser } from './XlsRowParsers/XlsRowDataParser.ts';

export class XlsScheduleParserStream extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(row: XlsRowData, _: BufferEncoding, callback: TransformCallback) {
    const { classes, groups, timeRange } = new XlsRowDataParser().parse(row);

    if (!(classes && timeRange)) {
      return callback();
    }

    for (const [groupType, descriptions] of classes) {
      for (const [column, description] of descriptions) {
        const group = groups.get(groupType)?.get(column);

        if (!group) {
          throw new Error('Class description does was parsed for not existing group');
        }

        const classInfo: ClassInfo = {
          details: description.details,
          endsAt: timeRange.end,
          group,
          location: description.location,
          startsAt: timeRange.start,
        };

        this.push(classInfo);
      }
    }

    callback();
  }
}
