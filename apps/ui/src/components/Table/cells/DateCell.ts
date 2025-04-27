import { Typography } from '../../Typography/Typography.ts';

export class DateCell extends Typography {
  static formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  constructor(date: Date | string) {
    const parsedDate = date instanceof Date ? date : new Date(date);
    const formattedDate = DateCell.formatter.format(parsedDate);

    super({ text: formattedDate });
    this.setStyle({ whiteSpace: 'nowrap' });
  }

  render(): HTMLElement {
    return this.root;
  }
}
