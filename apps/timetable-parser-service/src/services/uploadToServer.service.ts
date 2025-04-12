import process from 'node:process';
import type { LoggerFields } from '@pk/utils/Logger/Logger.js';
import { type LoggerStrategy, type Severities, Severity } from '@pk/utils/Logger/types.js';
import { NodeSSH } from 'node-ssh';

export type UploadItem = {
  local: string;
  remoteName: string;
};

type UploadToServerArgs = {
  directory: string;
  files: UploadItem[];
  host: string;
  logger?: LoggerStrategy<Severities, LoggerFields>;
};

export const uploadToServer = async ({ directory, files, host, logger }: UploadToServerArgs) => {
  logger?.log({ message: 'Uploading files to server', severity: Severity.Info });

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

    logger?.log({ message: 'Files uploaded:', severity: Severity.Success });
  } catch (err) {
    logger?.log({ message: `Error uploading files: ${err}`, severity: Severity.Error });
  }
};
