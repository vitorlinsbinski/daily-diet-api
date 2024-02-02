import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { randomUUID } from 'crypto';

export async function signInRoutes(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const userDataBodySchema = z.object({
      email: z.string(),
    });

    const { email } = userDataBodySchema.parse(req.body);

    const sessionId = randomUUID();

    if (sessionId) {
      return res.status(200).send('User is already logged in.');
    }

    const user = await knex('users').where('email', email).first();

    if (user) {
      const sessionId = randomUUID();

      await knex('sessions').insert({
        id: sessionId,
        user_id: user.id,
      });

      res.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return res.status(200).send('Login successful.');
    } else {
      return res.status(401).send('User not found.');
    }
  });
}
