export class EnvUtil {
  private static readonly PRODUCTION = 'production';
  private static readonly DEVELOPMENT = 'development';
  private static readonly LOCAL = 'local';

  public static isProd(env: string = process.env.NODE_ENV) {
    return env === this.PRODUCTION;
  }

  public static isDev(env: string = process.env.NODE_ENV) {
    return env === this.DEVELOPMENT;
  }

  public static isLocal(env: string = process.env.NODE_ENV) {
    return env === this.LOCAL;
  }
}
