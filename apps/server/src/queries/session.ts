import type { SessionDb } from '@pk/types/session.js';
import { query } from '../database/client.ts';

export const deleteSessionBySessionUid = (sessionUid: string) => {
  return query(
      `DELETE
       FROM sessions
       WHERE session_uid = $1`,
      [sessionUid],
  );
};

export const createSession = (userUid: string) => {
  return query(
      `INSERT INTO sessions (acl, user_uid)
       VALUES (GET_USER_ACL($1), $1)`,
      [userUid],
  );
};

export const selectSessionBySessionUid = (sessionUid: string) => {
  return query<SessionDb>(
      `SELECT acl, expires_at, session_uid, user_uid
       FROM sessions
       WHERE session_uid = $1`,
      [sessionUid],
  );
};

export const selectSessionByUserUid = (userUid: string) => {
  return query<SessionDb>(
      `SELECT acl, expires_at, session_uid, user_uid
       FROM sessions
       WHERE user_uid = $1`,
      [userUid],
  );
};
