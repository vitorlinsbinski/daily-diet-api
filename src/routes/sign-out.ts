import { FastifyInstance } from 'fastify';
import { knex } from '../database';

export async function signOutRoutes(app: FastifyInstance) {
  app.delete('/', async (req, res) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      return res.status(400).send({ error: 'User is not signed in.' });
    }

    try {
      const session = await knex('sessions').where('id', sessionId).delete();

      if (!session) {
        return res.status(401).send({ error: 'Session not found.' });
      }

      res.clearCookie('sessionId');

      return res.status(200).send({ message: 'User is now signed out.' });
    } catch (error) {
      console.log(error);

      return res.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
