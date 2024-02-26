import path from 'path';

export const cuotOrigin = 'https://it.pk.edu.pl/';
export const cuotRssOrigin = 'https://it.pk.edu.pl/rss';
export const cuotTimeTableOrigin = 'https://it.pk.edu.pl/?page=rz';
export const currentYear = 2;
export const torusOrigin = 'torus.uck.pk.edu.pl';

export const resourcesDir = 'resources';

export const timetableLockfilePath = path.resolve(resourcesDir, 'timetable.lock');
export const timetableXlsPath = path.resolve(resourcesDir, 'timetable.xls');
export const torusUploadPath = 'public_html/pkplan';

// file paths
export const timetableForGroupIcsPath = (group: number) => path.resolve(resourcesDir, `timetable-${group}.ics`);
export const timetableIcsPath = path.resolve(resourcesDir, 'timetable.ics');

export const timetableForGroupJsonPath = (group: number) => path.resolve(resourcesDir, `timetable-${group}.json`);
export const timetableJsonPath = path.resolve(resourcesDir, 'timetable.json');
