import { type DateFormat, DateFormatter } from '../../../utils/DateFormatter.ts';
import { Typography } from '../../Typography/Typography.ts';

type DateCellOptions = {
  format?: DateFormat;
};

export class DateCell extends Typography {
  constructor(date: Date | string, { format }: DateCellOptions = {}) {
    const parsedDate = date instanceof Date ? date : new Date(date);
    const formattedDate = new DateFormatter(format).formatter.format(parsedDate);

    super({ text: formattedDate });
    this.setStyle({ whiteSpace: 'nowrap' });
  }
}
