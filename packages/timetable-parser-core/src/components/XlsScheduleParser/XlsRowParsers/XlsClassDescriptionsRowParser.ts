import type { XlsRowData } from '../../../types/xls.ts';
import type { XlsRowParserStrategy } from '../xlsRowParserStrategy.ts';
import { ClassDescriptionsCollection } from './ClassDescriptionsCollection.ts';
import { GroupsCollection } from './GroupsCollection.ts';
import { CLASSES_AND_TIME_RANGE_REGEX } from './regexes.ts';

const EMPTY_SPACE_REGEX = /\s+/g;

export class XlsClassDescriptionsRowParser implements XlsRowParserStrategy<ClassDescriptionsCollection | null> {
  static readonly #classesColumn = 'B';
  static readonly #classesRegex = CLASSES_AND_TIME_RANGE_REGEX;

  readonly #groups: GroupsCollection;

  constructor(groups: GroupsCollection) {
    this.#groups = groups;
  }

  parse(row: XlsRowData) {
    const classes = row[XlsClassDescriptionsRowParser.#classesColumn];

    if (typeof classes !== 'string' || !XlsClassDescriptionsRowParser.#classesRegex.test(classes)) {
      return null;
    }

    return this.#parse(row);
  }

  #parse(row: XlsRowData) {
    const classDescriptions = new ClassDescriptionsCollection();

    for (const [groupType, groups] of this.#groups) {
      for (const [column] of groups) {
        const details = row[column];

        if (typeof details !== 'string') {
          continue;
        }

        const normalizedDetails = details.replace(EMPTY_SPACE_REGEX, ' ').toLowerCase();

        if (GroupsCollection.groupRegexes[groupType].test(normalizedDetails)) {
          classDescriptions.get(groupType)?.set(column, { details: normalizedDetails, groupType, location: '' });
        }
      }
    }

    return classDescriptions;
  }
}
