declare global {
  // biome-ignore lint/style/noNamespace: this declaration extends the global namespace
  namespace NodeJS {
    interface ProcessEnv {
      DEBUG?: string;
      npm_package_version: string;
      UPLOAD?: string;
      TORUS_USERNAME?: string;
      TORUS_PASSWORD?: string;
    }
  }
}

export {};
