import { GroupType, type GroupTypeValues, type Lesson, type ParserInterfaceV2, type WriterInterfaceV2 } from '@types';
import type { TimetableParserArgs, TimetableParserReturn, TimetableQueryArgs } from './types';

/**
 * The Timetable class represents a timetable with a list of lessons.
 *
 * @property {Lesson[]} lessons - An array of Lesson objects representing the lessons in the timetable.
 */
export class Timetable {
  lessons: Lesson[] = [];

  /**
   * This method is used to parse the timetable.
   *
   * @param parser - The parser to be used for parsing the timetable.
   * @returns The instance of the Timetable class after parsing the lessons.
   */
  parse(parser: ParserInterfaceV2<TimetableParserArgs, TimetableParserReturn>): Timetable {
    const { lessons } = parser.parse(undefined);
    this.lessons = lessons;

    return this;
  }

  /**
   * This method is used to query the lessons based on the provided parameters.
   *
   * @param query - An object containing the exercise group, laboratory group, and year to be queried.
   * @returns An array of Lesson objects that match the query parameters.
   */
  query(query: TimetableQueryArgs): Lesson[] {
    const exerciseGroup = query?.exerciseGroup;
    const laboratoryGroup = query?.laboratoryGroup;

    const onePerYearLessons: GroupTypeValues[] = [GroupType.ENGLISH, GroupType.LECTURE, GroupType.UNKNOWN];
    const queriedLessons: Lesson[] = [];

    for (const lesson of this.lessons) {
      const isYearValid = lesson.group.year === query.year;
      const isOnePerYearGroup = onePerYearLessons.includes(lesson.group.type);
      const isWholeYearSelected = !exerciseGroup && !laboratoryGroup;

      const isQueriedGroup =
        (lesson.group.type === GroupType.EXERCISE && exerciseGroup === lesson.group.number) ||
        (lesson.group.type === GroupType.LABORATORY && laboratoryGroup === lesson.group.number);

      if (isYearValid && (isOnePerYearGroup || isWholeYearSelected || isQueriedGroup)) {
        queriedLessons.push(lesson);
      }
    }

    return queriedLessons;
  }

  /**
   * This method is used to write the queried lessons to a file.
   *
   * @template TOutput - The type of the output that the writer will produce.
   * @param writer - The writer to be used for writing the lessons to a file.
   * @param query - The query to be used for querying the lessons.
   * @returns The instance of the Timetable class after writing the lessons to a file.
   */
  writeToFile<TOutput>(writer: WriterInterfaceV2<Lesson[], TOutput>, query: TimetableQueryArgs): Timetable {
    const queriedLessons = this.query(query);

    if (writer.transform) writer.transform(queriedLessons);
    writer.write();

    return this;
  }
}
