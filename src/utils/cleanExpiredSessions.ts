import cron from 'node-cron';
import { knex } from '../database';

const cronJob = cron.schedule('0 * * * *', async () => {
  try {
    await knex('sessions').where('expiry_time', '<', new Date()).delete();
  } catch (error) {
    console.error('Erro ao limpar sessões expiradas:', error);
  }
});

export default cronJob;
