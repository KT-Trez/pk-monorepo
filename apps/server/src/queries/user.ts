import type { UserDb } from '@pk/types/user.js';
import { query } from '../database/client.ts';

export const selectUserByEmail = (email: string) => {
  return query<UserDb>(
      `SELECT album, email, first_name, last_name, object_type_id, password, user_uid
       FROM users
       WHERE email = $1`,
      [email],
  );
};
