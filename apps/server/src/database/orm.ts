import type { GroupDb } from '@pk/types/group.js';
import { ORM } from '../classes/ORM.ts';
import { query } from './client.ts';

export const orm = new ORM<['groups']>(query);

orm.define<GroupDb>('groups', ['field_of_study_id', 'group_uid', 'name', 'object_type_id', 'year'], 'group_uid');
