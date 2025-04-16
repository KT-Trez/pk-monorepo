import type { UserDb } from '@pk/types/user.js';
import pg from 'pg';
import { query } from '../database/client.ts';

const { escapeIdentifier } = pg;

const USER_FIELDS = 'album, email, first_name, last_name, object_type_id, password, user_uid';

export const create = (user: Partial<UserDb>) => {
  const normalizedAttributes = Object.keys(user)
      .map(attribute => escapeIdentifier(attribute))
      .join(', ');

  const values = Object.values(user);
  const valuesParams = values.map((_, index) => `$${index + 1}`).join(', ');

  return query<UserDb>(
      `INSERT INTO users (${normalizedAttributes})
       VALUES (${valuesParams})`,
      values,
  );
};

export const deleteUserByUid = (userUid: string) => {
  return query<UserDb>(
      `DELETE
       FROM users
       WHERE user_uid = $1`,
      [userUid],
  );
};

export const selectUserByEmail = (email: string) => {
  return query<UserDb>(
      `SELECT ${USER_FIELDS}
       FROM users
       WHERE email = $1`,
      [email],
  );
};

export const selectUserByUid = (userUid: string) => {
  return query<UserDb>(
      `SELECT ${USER_FIELDS}
       FROM users
       WHERE user_uid = $1`,
      [userUid],
  );
};

export const updateUser = (user: Partial<UserDb>) => {
  const { user_uid, ...userUpdate } = user;

  const normalizedAttributes = Object.keys(userUpdate)
      .map((attribute, index) => `${escapeIdentifier(attribute)}=$${index + 1}`)
      .join(', ');

  const values = Object.values(userUpdate);

  return query<UserDb>(
      `UPDATE users
       SET ${normalizedAttributes}
       WHERE user_uid = $${values.length + 1}`,
      [...values, user_uid],
  );
};
