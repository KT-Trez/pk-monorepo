import {
  type Group,
  GroupType,
  type GroupTypeValues,
  type ParserInterfaceV2,
  type RowType,
} from '@types';
import type {
  GroupRegexesConfig,
  GroupsMapKey,
  GroupsParserArgs,
  GroupsParserReturn,
} from './types';

export class GroupsParser
  implements ParserInterfaceV2<GroupsParserArgs, GroupsParserReturn>
{
  static determineGroupType(
    text: string,
    regexesConfig?: Partial<GroupRegexesConfig>,
  ): GroupTypeValues {
    const combineRegexes = (
      regex: RegExp | RegExp[],
      regexesFromConfig?: RegExp[],
    ) => {
      const regExps = Array.isArray(regex) ? regex : [regex];
      if (!regexesFromConfig) return regExps;

      return regExps.concat(regexesFromConfig);
    };

    const regExps: GroupRegexesConfig = {
      [GroupType.ENGLISH]: combineRegexes(
        /ang/i,
        regexesConfig?.[GroupType.ENGLISH],
      ),
      [GroupType.EXERCISE]: combineRegexes(
        /[cć]wiczenia/i,
        regexesConfig?.[GroupType.EXERCISE],
      ),
      [GroupType.LABORATORY]: combineRegexes(
        /lab/i,
        regexesConfig?.[GroupType.LABORATORY],
      ),
      [GroupType.LECTURE]: combineRegexes(
        [/wyk[lł]ad/i, /zdalnie/i],
        regexesConfig?.[GroupType.LECTURE],
      ),
    };

    for (const [group, regexes] of Object.entries(regExps)) {
      if (regexes.some((regex) => regex.test(text))) {
        return group as GroupTypeValues;
      }
    }

    return GroupType.UNKNOWN;
  }

  static isGroupRow(row: RowType, groupRegExp = /[1234]\d/): boolean {
    return row.some((cell) => {
      const isNumber = typeof cell === 'number';
      const hasCorrectFormat = groupRegExp.test(String(cell));

      return isNumber && hasCorrectFormat;
    });
  }

  parse(row: GroupsParserArgs): GroupsParserReturn {
    const extractGroup = this.#createGroupExtractor();
    const extractGroupColumnIndex = this.#createGroupColumnIndexExtractor();

    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      // handle a cell format
      const columnCell = row.at(columnIndex);
      if (typeof columnCell !== 'number') continue;

      // parse exercise group number and group year
      const groupString = String(columnCell);
      const exerciseGroupNumber = groupString.at(1);
      const groupYear = groupString.at(0);
      if (!exerciseGroupNumber || !groupYear) continue;

      extractGroup(columnIndex, exerciseGroupNumber, groupYear);
      extractGroupColumnIndex(columnIndex);
    }

    return {
      groupsIndexes: extractGroupColumnIndex(),
      groupsMap: extractGroup(),
    };
  }

  #createGroupColumnIndexExtractor() {
    const groupsColumnIndexes: number[] = [];

    return (columnIndex?: number) => {
      if (!columnIndex) return groupsColumnIndexes;

      if (!groupsColumnIndexes.includes(columnIndex)) {
        groupsColumnIndexes.push(columnIndex);
        groupsColumnIndexes.push(columnIndex + 1);
      }

      return groupsColumnIndexes;
    };
  }

  #createGroupExtractor() {
    const groupsMap = new Map<GroupsMapKey, Group>();
    const mappedExerciseGroups: string[] = [];
    const mappedYears: string[] = [];

    return (
      columnIndex?: number,
      exerciseGroupNumber?: string,
      groupYear?: string,
    ) => {
      if (!columnIndex || !exerciseGroupNumber || !groupYear) return groupsMap;

      const key = (
        groupType: GroupTypeValues,
        providedColumnIndex?: number,
      ): GroupsMapKey => `${groupType}-${providedColumnIndex ?? columnIndex}`;

      if (!mappedYears.includes(groupYear)) {
        const englishGroup = this.#createGroup(1, GroupType.ENGLISH, groupYear);
        const lectureGroup = this.#createGroup(1, GroupType.LECTURE, groupYear);
        const unknownGroup = this.#createGroup(1, GroupType.UNKNOWN, groupYear);

        groupsMap.set(key(GroupType.ENGLISH), englishGroup);
        groupsMap.set(key(GroupType.LECTURE), lectureGroup);
        groupsMap.set(GroupType.UNKNOWN, unknownGroup);

        mappedYears.push(groupYear);
      }

      const exerciseGroupId = `${exerciseGroupNumber}-y${groupYear}`;
      if (!mappedExerciseGroups.includes(exerciseGroupId)) {
        const labGroupNumber = Number(exerciseGroupNumber) * 2;

        const exerciseGroup = this.#createGroup(
          exerciseGroupNumber,
          GroupType.EXERCISE,
          groupYear,
        );
        const firstLabGroup = this.#createGroup(
          labGroupNumber - 1,
          GroupType.LABORATORY,
          groupYear,
        );
        const secondLabGroup = this.#createGroup(
          labGroupNumber,
          GroupType.LABORATORY,
          groupYear,
        );

        groupsMap.set(key(GroupType.EXERCISE), exerciseGroup);
        groupsMap.set(key(GroupType.LABORATORY), firstLabGroup);
        groupsMap.set(
          key(GroupType.LABORATORY, columnIndex + 1),
          secondLabGroup,
        );

        mappedExerciseGroups.push(exerciseGroupId);
      }

      return groupsMap;
    };
  }

  #createGroup(
    number: number | string,
    type: GroupTypeValues,
    year: number | string,
  ): Group {
    return {
      number: typeof number === 'number' ? number : Number(number),
      type,
      year: typeof year === 'number' ? year : Number(year),
    };
  }
}
