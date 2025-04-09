import process from 'node:process';
import { Severity } from '@/types/severity';
import type { LogStrategy } from '@/types/strategies';
import { NodeSSH } from 'node-ssh';

export type UploadItem = {
  local: string;
  remoteName: string;
};

type UploadToServerArgs = {
  directory: string;
  files: UploadItem[];
  host: string;
  logger?: LogStrategy;
};

export const uploadToServer = async ({ directory, files, host, logger }: UploadToServerArgs) => {
  logger?.log('Uploading files to server', Severity.INFO);

  const upload = files.map(({ local, remoteName }) => ({
    local,
    remote: `${directory}/${remoteName}`,
  }));
  const ssh = new NodeSSH();

  try {
    await ssh.connect({
      host,
      username: process.env.UPLOAD_SERVER_USERNAME,
      password: process.env.UPLOAD_SERVER_PASSWORD,
    });

    await ssh.putFiles(upload);

    logger?.log('Files uploaded', Severity.SUCCESS);
  } catch (err) {
    logger?.log(`Error uploading files: ${err}`, Severity.ERROR);
  }
};
