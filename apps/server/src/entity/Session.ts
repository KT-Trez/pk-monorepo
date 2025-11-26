import type { SessionApi } from '@pk/types/session.js';
import { permissionsByRole } from '@pk/utils/permissions/permissionsByRole.js';
import type { PermissionsByResource } from '@pk/utils/permissions/types.js';
import { Column, Entity, JoinColumn, ManyToOne, type Relation } from 'typeorm';
import { Base } from './Base.ts';
import { User } from './User.ts';

@Entity()
export class Session extends Base implements SessionApi {
  @Column('timestamptz', { default: () => "(NOW() + '23:59:00'::INTERVAL)", nullable: false })
  expiresAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  user!: Relation<User>;

  hasPermission<R extends keyof PermissionsByResource, A extends keyof PermissionsByResource[R]>(
    resource: R,
    action: A,
    data?: PermissionsByResource[R][A],
  ) {
    if (!this.user) {
      return false;
    }

    console.log(this.user);

    return this.user.roles.some(role => {
      const permission = permissionsByRole[role.id][resource]?.[action];

      if (permission === undefined) {
        return false;
      }

      if (typeof permission === 'boolean') {
        return permission;
      }

      return permission(this.user, data);
    });
  }
}
