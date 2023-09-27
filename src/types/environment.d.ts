// noinspection JSUnusedGlobalSymbols

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DEBUG?: string;
      UPLOAD?: string;
      TORUS_USERNAME?: string;
      TORUS_PASSWORD?: string;
    }
  }
}
