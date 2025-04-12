import { GroupType } from '../../../types/classInfo.ts';
import type { XlsRowData } from '../../../types/xls.ts';
import type { XlsRowParserStrategy } from '../xlsRowParserStrategy.ts';
import { GroupsCollection } from './GroupsCollection.ts';
import { GROUPS_REGEX } from './regexes.ts';

export class XlsGroupsRowParser implements XlsRowParserStrategy<GroupsCollection> {
  static #groups = new GroupsCollection();
  static readonly #groupsColumn = 'B';
  static readonly #groupsRegex = GROUPS_REGEX;

  parse(row: XlsRowData) {
    const group = row[XlsGroupsRowParser.#groupsColumn];

    if (typeof group === 'string' && XlsGroupsRowParser.#groupsRegex.test(group)) {
      XlsGroupsRowParser.#groups = this.#parse(row);
    }

    return XlsGroupsRowParser.#groups;
  }

  #parse(row: XlsRowData) {
    const groups = new GroupsCollection();

    for (const column in row) {
      const group = row[column];
      if (typeof group !== 'number') {
        continue;
      }

      const nextColumn = String.fromCharCode(column.charCodeAt(0) + 1);

      const groupString = group.toString();
      const index = Number(groupString[1] ?? -1);
      const year = Number(groupString[0] ?? -1);

      groups.get(GroupType.Exercise)?.set(column, { index, type: GroupType.Exercise, year });

      // groups are indexed from 1, so we need to subtract 1 to get the correct values after multiplication
      groups.get(GroupType.Laboratory)?.set(column, { index: (index - 1) * 2 + 1, type: GroupType.Laboratory, year });
      groups.get(GroupType.Laboratory)?.set(nextColumn, {
        index: (index - 1) * 2 + 2,
        type: GroupType.Laboratory,
        year,
      });

      groups.get(GroupType.Lecture)?.set(column, { index: 1, type: GroupType.Lecture, year });
      groups.get(GroupType.Language)?.set(column, { index, type: GroupType.Language, year });
      groups.get(GroupType.Unknown)?.set(column, { index: 1, type: GroupType.Unknown, year });
    }

    return groups;
  }
}
