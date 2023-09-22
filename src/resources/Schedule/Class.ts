export class Class {
  constructor(
    private date: Date,
    private group: string,
    private hour: string,
    private name: string,
  ) {}
}

export class ClassBuilder {
  private date: Date;
  private group: string;
  private hour: string;
  private name: string;

  constructor() {
    this.date = new Date();
    this.group = '';
    this.hour = '';
    this.name = '';
  }

  build(): Class {
    return new Class(this.date, this.group, this.hour, this.name);
  }

  setContent(content: string) {
    this.name = content;
    return this;
  }

  setDate(date: Date) {
    this.date = date;
    return this;
  }

  setGroup(group: string) {
    this.group = group;
    return this;
  }

  setHour(hour: string) {
    this.hour = hour;
    return this;
  }
}
