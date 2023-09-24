import path from 'path';

export const cuotOrigin = 'https://it.pk.edu.pl/';
export const cuotRssOrigin = 'https://it.pk.edu.pl/rss';
export const cuotTimeTableOrigin = 'https://it.pk.edu.pl/?page=rz';
export const torusOrigin = 'torus.uck.pk.edu.pl';

export const resourcesDir = 'resources';
export const timetableIcsPath = path.resolve(resourcesDir, 'timetable.ics');
export const timetableJsonPath = path.resolve(resourcesDir, 'timetable.json');
export const timetableLockfilePath = path.resolve(
  resourcesDir,
  'timetable.lock',
);
export const timetableXlsPath = path.resolve(resourcesDir, 'timetable.xls');
export const torusUploadPath = 'public_html/pkplan';
