declare global {
  // biome-ignore lint/style/noNamespace: this declaration extends the global namespace
  namespace NodeJS {
    interface ProcessEnv {
      UPLOAD?: string;
      UPLOAD_SERVER_PASSWORD?: string;
      UPLOAD_SERVER_USERNAME?: string;
      npm_package_version: string;
    }
  }
}

export {};
