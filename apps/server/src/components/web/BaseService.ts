export abstract class BaseService {
  abstract asyncConstructor(): Promise<BaseService>;
}
