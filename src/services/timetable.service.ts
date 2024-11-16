import process from 'node:process';
import { torusOrigin, torusUploadPath } from '@/config';
import { NodeSSH } from 'node-ssh';
import { logger } from './logging.service';

export const uploadToTorus = async (files: { localPath: string; remoteName: string }[]) => {
  if (process.env.DEBUG) {
    logger.log('Uploading to torus');
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
