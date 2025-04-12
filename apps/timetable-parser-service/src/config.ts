import path from 'node:path';

export const wiitScheduleOrigin = 'https://it.pk.edu.pl/studenci/na-studiach/rozklady-zajec';
export const uploadServerOrigin = 'torus.uck.pk.edu.pl';

export const tempDir = 'tmp';
export const scheduleOutPath = path.resolve(tempDir, 'out.json');
export const scheduleXlsPath = path.resolve(tempDir, 'timetable.xls');
export const uploadServerDirectory = 'public_html/pkplan';
