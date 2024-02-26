import { NodeSSH } from 'node-ssh';
import process from 'process';
import { URL } from 'url';
import { CuotTimetableOriginParser, StreamWriter } from '../components';
import { cuotOrigin, cuotTimeTableOrigin, timetableXlsPath, torusOrigin, torusUploadPath } from '../config';

export const downloadToXls = async (timetableURL: URL) => {
  if (process.env.DEBUG) {
    console.info('Downloading XLS timetable');
  }

  await new StreamWriter().write(timetableURL, timetableXlsPath);
};

export const parseDownloadURLFromWeb = async () => {
  const downloads = await new CuotTimetableOriginParser().parse(cuotTimeTableOrigin);
  const isComputerScienceTimetable = (path: string) => /informatyka/i.test(path) && /niestacjonarn[ea]/i.test(path);

  const timetablePath = downloads.find(isComputerScienceTimetable);

  if (!timetablePath) {
    throw Error('Timetable not found');
  }

  return new URL(timetablePath, cuotOrigin);
};

export const uploadToTorus = async (files: { localPath: string; remoteName: string }[]) => {
  if (process.env.DEBUG) {
    console.info('Uploading to torus');
  }

  const ssh = new NodeSSH();
  await ssh.connect({
    host: torusOrigin,
    username: process.env.TORUS_USERNAME,
    password: process.env.TORUS_PASSWORD,
  });

  await ssh.putFiles(
    files.map(({ remoteName, localPath }) => ({
      local: localPath,
      remote: `${torusUploadPath}/${remoteName}`,
    })),
  );
};
