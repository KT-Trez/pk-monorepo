import type { XlsRowData } from '../../../types/xls.ts';
import type { XlsRowParserStrategy } from '../xlsRowParserStrategy.ts';
import type { ClassDescriptionsCollection } from './ClassDescriptionsCollection.ts';
import type { GroupsCollection } from './GroupsCollection.ts';
import { XlsClassDescriptionsRowParser } from './XlsClassDescriptionsRowParser.ts';
import { XlsGroupsRowParser } from './XlsGroupsRowParser.ts';
import { XlsReferenceDateRowParser } from './XlsReferenceDateRowParser.ts';
import { XlsTimeRangeRowParser } from './XlsTimeRangeRowParser.ts';

export type XlsRowDataParsingResult = {
  classes: ClassDescriptionsCollection | null;
  groups: GroupsCollection;
  timeRange: { end: Date; start: Date } | null;
};

export class XlsRowDataParser implements XlsRowParserStrategy<XlsRowDataParsingResult> {
  parse(row: XlsRowData) {
    const referenceDateParser = new XlsReferenceDateRowParser();
    const referenceDate = referenceDateParser.parse(row);

    const groupsParser = new XlsGroupsRowParser();
    const groups = groupsParser.parse(row);

    const classDescriptionsParser = new XlsClassDescriptionsRowParser(groups);
    const timeRangeParser = new XlsTimeRangeRowParser(referenceDate);

    const result: XlsRowDataParsingResult = {
      classes: classDescriptionsParser.parse(row),
      groups,
      timeRange: timeRangeParser.parse(row),
    };

    return result;
  }
}
