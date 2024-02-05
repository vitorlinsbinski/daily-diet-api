import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
    };

    sessions: {
      id: string;
      user_id: string;
      created_at: string;
      expires_at: string;
    };

    meals: {
      id: string;
      name: string;
      description: string;
      created_at: string;
      is_on_diet: boolean;
      user_id: string;
      updated_at: string;
    };
  }
}
