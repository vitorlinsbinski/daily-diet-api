import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { randomUUID } from 'crypto';

export async function signUpRoutes(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const userDataBodySchema = z.object({
      name: z.string(),
      email: z.string(),
    });

    const { name, email } = userDataBodySchema.parse(req.body);

    const isUserAlreadyRegistered = await knex('users')
      .where('email', email)
      .first();

    if (!isUserAlreadyRegistered) {
      await knex('users').insert({
        id: randomUUID(),
        name,
        email,
      });

      return res.status(201).send();
    }

    return res.status(409).send({ error: 'User already exists.' });
  });
}
