import { UserRoleEnum } from '@pk/types/user.js';
import { Severity } from '@pk/utils/Logger/types.js';
import type { DataSource } from 'typeorm';
import type { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { logger } from '../../components/logger/logger.ts';
import { User } from '../../entity/User.ts';
import { UserAuth } from '../../entity/UserAuth.ts';
import { UserRole } from '../../entity/UserRole.ts';

export default class UserSeeder implements Seeder {
  track = true;

  public async run(dataSource: DataSource, _: SeederFactoryManager) {
    const userAuthRepository = dataSource.getRepository(UserAuth);
    const userRepository = dataSource.getRepository(User);
    const userRoleRepository = dataSource.getRepository(UserRole);

    const adminRole = await userRoleRepository.findOneByOrFail({ id: UserRoleEnum.Admin });
    const memberRole = await userRoleRepository.findOneByOrFail({ id: UserRoleEnum.Member });

    const admin = User.create({
      email: 'admin.calendar@pk.edu.pl',
      name: 'Admin',
      roles: [adminRole, memberRole],
      surname: 'Calendar',
    });

    const system = User.create({
      email: 'api.calendar@pk.edu.pl',
      name: 'API',
      roles: [adminRole],
      surname: 'Calendar',
    });

    if (!process.env.PK_PASSWORD) {
      throw new Error('"PK_PASSWORD" environment variable is not set');
    }

    const adminAuth = await UserAuth.create({ password: process.env.PK_PASSWORD, user: admin });

    await userRepository.save([admin, system]);
    await userAuthRepository.save([adminAuth]);

    logger.log({ message: `Operation using "${this.constructor.name}" has finished`, severity: Severity.Success });
  }
}
