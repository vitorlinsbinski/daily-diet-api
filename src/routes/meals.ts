import { FastifyInstance } from 'fastify';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';
import { knex } from '../database';
import { z } from 'zod';
import { randomUUID } from 'crypto';

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists] }, async (req, res) => {
    const { sessionId } = req.cookies;

    const meals = await knex('meals')
      .join('sessions', 'meals.user_id', '=', 'sessions.user_id')
      .where('sessions.id', sessionId)
      .select('meals.*');

    return { meals };
  });

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (req, res) => {
    const getMealParamSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getMealParamSchema.parse(req.params);
    const sessionId = req.cookies.sessionId;

    const meal = await knex('meals')
      .join('sessions', 'meals.user_id', '=', 'sessions.user_id')
      .where('meals.id', id)
      .andWhere('sessions.id', sessionId)
      .select('meals.*')
      .first();

    if (!meal) {
      return res.status(404).send({ error: 'Meal not found.' });
    }

    return { meal };
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

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      is_on_diet: isOnDiet,
      user_id: session?.user_id,
    });

    return res.status(201).send();
  });

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (req, res) => {
      const getMealParamSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getMealParamSchema.parse(req.params);

      const sessionId = req.cookies.sessionId;

      try {
        const session = await knex('sessions').where('id', sessionId).first();

        const mealDeletion = await knex('meals')
          .where({
            id,
            user_id: session?.user_id,
          })
          .delete();

        if (mealDeletion > 0) {
          return res.status(204).send();
        } else {
          return res
            .status(404)
            .send({ error: 'Meal not found or unauthorized' });
        }
      } catch (error) {
        console.log(error);

        return res
          .status(500)
          .send({ error: 'Internal Server Error: ${error}' });
      }
    }
  );

  app.put('/:id', { preHandler: [checkSessionIdExists] }, async (req, res) => {
    const sessionId = req.cookies.sessionId;

    const getMealParamSchema = z.object({
      id: z.string().uuid(),
    });

    const updateMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      is_on_diet: z.boolean(),
    });

    const { id } = getMealParamSchema.parse(req.params);

    const {
      name,
      description,
      is_on_diet: isOnDiet,
    } = updateMealBodySchema.parse(req.body);

    try {
      const session = await knex('sessions').where('id', sessionId).first();

      const updateMeal = await knex('meals')
        .where({
          id,
          user_id: session?.user_id,
        })
        .update({
          name,
          description,
          is_on_diet: isOnDiet,
          updated_at: knex.fn.now(),
        });

      if (updateMeal > 0) {
        return res.status(204).send();
      } else {
        return res
          .status(400)
          .send({ error: 'Meal not found or unauthorized' });
      }
    } catch (error) {
      console.log(error);

      return res.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
