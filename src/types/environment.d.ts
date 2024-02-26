// noinspection JSUnusedGlobalSymbols

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DEBUG?: string;
      DEBUG_MISSING_KEYS?: string;
      npm_package_version: string;
      UPDATE_ON_START?: string;
      UPLOAD?: string;
      TORUS_USERNAME?: string;
      TORUS_PASSWORD?: string;
    }
  }
}
