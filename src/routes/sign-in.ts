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

    const sessionId = req.cookies.sessionId;

    const user = await knex('users').where('email', email).first();

    if (sessionId && user) {
      return res.status(200).send('User is already logged in.');
    }

    if (user) {
      const newSessionId = randomUUID();

      const expiresIn = 60 * 60 * 24 * 7; // 7 days in seconds

      await knex('sessions').insert({
        id: newSessionId,
        user_id: user.id,
        expires_at: knex.raw('CURRENT_TIMESTAMP + 604800'),
      });

      res.cookie('sessionId', newSessionId, {
        path: '/',
        expires: new Date(Date.now() + expiresIn * 1000),
        httpOnly: true,
      });

      return res.status(200).send('Login successful.');
    } else {
      return res.status(401).send('User not found.');
    }
  });
}
