import { Class } from './Class';

export type IScheduleParser = {
  parseClasses(): Class[];
  parseYear(): string;
};
