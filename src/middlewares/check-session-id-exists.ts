import { FastifyReply, FastifyRequest } from 'fastify';
import { knex } from '../database';

export async function checkSessionIdExists(
  req: FastifyRequest,
  res: FastifyReply
) {
  const sessionId = req.cookies.sessionId;

  const session = await knex('meals').where('id', sessionId).first();

  if (!sessionId && !session) {
    return res.status(401).send({
      error: 'Unauthorized. Please, sign-in or sign-up.',
    });
  }
}
