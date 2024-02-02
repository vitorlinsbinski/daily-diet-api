import { FastifyInstance } from 'fastify';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';
import { knex } from '../database';
import { z } from 'zod';
import { randomUUID } from 'crypto';

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists] }, async (req, res) => {
    const { sessionId } = req.cookies;

    const session = await knex('sessions').where('id', sessionId).first();

    const meals = await knex('meals')
      .where('user_id', session?.user_id)
      .select();

    return { meals };
  });

  app.post('/', { preHandler: [checkSessionIdExists] }, async (req, res) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      is_on_diet: z.boolean(),
    });

    const {
      name,
      description,
      is_on_diet: isOnDiet,
    } = createMealBodySchema.parse(req.body);

    let sessionId = req.cookies.sessionId;

    const session = await knex('sessions').where('id', sessionId).first();

    console.log('session: ', session);

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      is_on_diet: isOnDiet,
      user_id: session?.user_id,
    });

    return res.status(201).send();
  });
}
