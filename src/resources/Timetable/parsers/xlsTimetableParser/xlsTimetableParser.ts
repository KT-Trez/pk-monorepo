import type { EndStartTime, Lesson, ParserInterfaceV2, RowType } from '@types';
import xlsx from 'node-xlsx';
import type { TimeTableParserArgs, TimeTableParserReturn } from '../../types';
import { GroupsParser } from './GroupsParser';
import { LessonTime } from './LessonTime';
import { Row } from './Row';
import type { Groups, GroupTypeAndRowIndexKey } from './types';

export class XlsTimetableParser implements ParserInterfaceV2<TimeTableParserArgs, TimeTableParserReturn> {
  rows: Row[];
  #groups: Groups = {
    groupsIndexes: [],
    groupsMap: new Map(),
  };

  constructor(path: string) {
    const sheets = xlsx.parse<RowType>(path, {
      cellDates: true,
    });

    const firstSheetData = sheets.at(0)?.data;
    const rows = firstSheetData?.reduce<Row[]>((acc, rowData) => {
      const newRow = new Row(rowData);
      if (newRow.isValid) {
        acc.push(newRow);
      }

      if (newRow.isValid && this.#groups.groupsMap.size === 0 && GroupsParser.isGroupRow(rowData)) {
        const parser = new GroupsParser();
        this.#groups = parser.parse(rowData);

        console.log(this.#groups);
      }

      return acc;
    }, []);

    this.rows = rows || [];
  }

  parse(): TimeTableParserReturn {
    const lessons: Lesson[] = [];

    let date: Date = new Date(0);
    let hour: EndStartTime = LessonTime.default();

    for (const row of this.rows) {
      if (row.hasDate()) date = row.getDate();
      if (row.hasHour()) hour = row.getHour();

      if (row.hasHour()) {
        lessons.concat(this.#readLessons(date, hour, row));
      }
    }

    return {
      lessons,
    };
  }

  #readLessons(date: Date, hour: EndStartTime, row: Row): Lesson[] {
    const lessons: Lesson[] = [];

    const endData = new Date(date);
    endData.setHours(hour.end.hours);
    endData.setMinutes(hour.end.minutes);

    const startDate = new Date(date);
    startDate.setHours(hour.start.hours);
    startDate.setMinutes(hour.start.minutes);

    for (const groupIndex of this.#groups.groupsIndexes) {
      const content = row.readContent(groupIndex);
      if (!content) continue;

      const groupType = GroupsParser.determineGroupType(content);
      const groupKey: GroupTypeAndRowIndexKey = `${groupType}-${groupIndex}`;

      const group = this.#groups.groupsMap.get(groupKey);
      if (!group) {
        console.log(groupKey, content);
        continue;
      }

      lessons.push({
        details: content,
        end: endData,
        group,
        start: startDate,
      });
    }

    // console.log(lessons);
    return lessons;
  }
}
