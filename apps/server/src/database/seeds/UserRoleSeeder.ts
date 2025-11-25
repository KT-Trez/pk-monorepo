import { UserRoleEnum } from '@pk/types/user.js';
import { Severity } from '@pk/utils/Logger/types.js';
import type { DataSource } from 'typeorm';
import type { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { logger } from '../../components/logger/logger.ts';
import { UserRole } from '../../entity/UserRole.ts';

export default class UserRoleSeeder implements Seeder {
  track = true;

  public async run(dataSource: DataSource, _: SeederFactoryManager) {
    const userRoleRepository = dataSource.getRepository(UserRole);

    const admin = UserRole.create({ id: UserRoleEnum.Admin, name: 'Admin' });
    const member = UserRole.create({ id: UserRoleEnum.Member, name: 'Member' });

    await userRoleRepository.save([admin, member]);

    logger.log({ message: `Operation using "${this.constructor.name}" has finished`, severity: Severity.Success });
  }
}
