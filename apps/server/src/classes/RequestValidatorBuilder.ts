import type { ValueValidator } from '@pk/types/valueValidator.js';
import type { WebServerRequest } from '../../lib/WebServerRequest.ts';
import type { WebServerResponse } from '../../lib/WebServerResponse.ts';
import { BadRequestError } from '../../lib/errors/BadRequestError.ts';
import type { HttpHandle, NextFunction } from '../../lib/types.ts';

type CheckFunction = (req: WebServerRequest) => readonly [string, boolean];

type ValueGetter = (req: WebServerRequest) => unknown;

export class RequestValidatorBuilder {
  chain: ValidationChain | null = null;
  #resource = '';

  build(): HttpHandle {
    return async (req: WebServerRequest, _: WebServerResponse, next: NextFunction) => {
      if (!this.chain) {
        throw new Error('RequestValidatorBuilder has not been initialized');
      }

      const errors = this.chain.checks.reduce<string[]>((acc, check) => {
        const [message, isValid] = check(req);

        if (!isValid) {
          acc.push(message);
        }

        return acc;
      }, []);

      if (errors.length > 0) {
        next(new BadRequestError(errors, this.#resource));
      }
    };
  }

  body() {
    this.#resource = 'body';

    return new ValidationChain(this, req => req.body);
  }

  searchParam(name: string) {
    this.#resource = `search param "${name}"`;

    return new ValidationChain(this, req => req.parsedURL.searchParams.get(name));
  }
}

class ValidationChain {
  checks: CheckFunction[] = [];

  readonly #validator: RequestValidatorBuilder;
  readonly #valueGetter: ValueGetter;

  constructor(validator: RequestValidatorBuilder, valueGetter: ValueGetter) {
    this.#validator = validator;
    this.#valueGetter = valueGetter;
  }

  addCheck(validate: ValueValidator, message: string) {
    const check = (req: WebServerRequest) => {
      const value = this.#valueGetter(req);

      if (validate(value)) {
        return [message, true] as const;
      }

      return [message, false] as const;
    };

    this.checks.push(check);

    return this;
  }

  end() {
    this.#validator.chain = this;

    return this.#validator;
  }
}
