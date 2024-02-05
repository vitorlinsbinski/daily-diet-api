import { FastifyInstance } from 'fastify';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';
import { z } from 'zod';
import { knex } from '../database';

export async function userRoutes(app: FastifyInstance) {
  app.get(
    '/:id/metrics',
    { preHandler: [checkSessionIdExists] },
    async (req, res) => {
      const getUserParamsSchema = z.object({
        id: z.string(),
      });

      const { id: userId } = getUserParamsSchema.parse(req.params);

      try {
        const user = await knex('users').where('id', userId).first();

        if (!user) {
          return res
            .status(404)
            .send({ error: 'User not found or unauthorized' });
        }

        const userMeals = await knex('meals')
          .where('user_id', userId)
          .select('*');

        const mealsWithinTheDiet = userMeals.filter((meal) => meal.is_on_diet);

        let currentSequenceLength = 0;
        let longestSequenceLength = 0;
        let startIndexOfLongestSequence = 0;
        let endIndexOfLongestSequence = 0;

        for (let i = 0; i < userMeals.length; i++) {
          const meal = userMeals[i];

          if (meal.is_on_diet) {
            currentSequenceLength++;

            endIndexOfLongestSequence = i;
          } else {
            currentSequenceLength = 0;
          }

          if (currentSequenceLength > longestSequenceLength) {
            longestSequenceLength = currentSequenceLength;
            startIndexOfLongestSequence = i - currentSequenceLength + 1;
          }
        }

        const longestDietSequence = userMeals.slice(
          startIndexOfLongestSequence,
          endIndexOfLongestSequence + 1
        );

        return {
          metrics: {
            total_meals: userMeals.length,
            meals_within_diet: mealsWithinTheDiet.length,
            meals_off_diet: userMeals.length - mealsWithinTheDiet.length,
            best_sequence_within_diet: longestDietSequence,
          },
        };
      } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );
}
