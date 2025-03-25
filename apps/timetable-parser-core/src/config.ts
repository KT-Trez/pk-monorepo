import path from 'node:path';

export const cuotTimetableOrigin = 'https://it.pk.edu.pl/studenci/na-studiach/rozklady-zajec';
export const torusOrigin = 'torus.uck.pk.edu.pl';

export const tempDir = 'tmp';
export const timetableOutPath = path.resolve(tempDir, 'out.json');
export const timetableXlsPath = path.resolve(tempDir, 'timetable.xls');
export const torusUploadDirectory = 'public_html/pkplan';
