import crypto from 'node:crypto';
import { type FullUserApi, UserRole } from '@pk/types/user.js';
import { Severity } from '@pk/utils/Logger/types.js';
import { enrichedUserRepository } from '../../main.ts';
import { logger } from '../logger/logger.ts';
import { BaseService } from './BaseService.ts';
import { Hash } from './Hash.ts';

export class RegisterToDatabaseService extends BaseService {
  static readonly adminUser: Partial<FullUserApi> = {
    email: 'admin.calendar@pk.edu.pl',
    name: 'Admin',
    roles: [UserRole.Admin, UserRole.Member],
    surname: 'Calendar',
  };

  static readonly serviceUser: Partial<FullUserApi> = {
    email: 'api.calendar@pk.edu.pl',
    name: 'API',
    roles: [UserRole.Admin, UserRole.Member],
    surname: 'Calendar',
  };

  async asyncConstructor() {
    await this.registerAdmin();
    await this.registerServiceUser();

    logger.log({ message: 'Registered required records to database', severity: Severity.Success });

    return this;
  }

  async registerAdmin() {
    const password = process.env.AUTH_ADMIN_PASSWORD ?? 'q';

    return enrichedUserRepository.findOneOrCreate(
      {
        email: RegisterToDatabaseService.adminUser.email,
      },
      {
        ...RegisterToDatabaseService.adminUser,
        password: await Hash.instance.hashPassword(password),
      },
    );
  }

  registerServiceUser() {
    return enrichedUserRepository.findOneOrCreate(
      {
        email: RegisterToDatabaseService.serviceUser.email,
      },
      {
        ...RegisterToDatabaseService.serviceUser,
        password: crypto.randomBytes(128),
      },
    );
  }
}
