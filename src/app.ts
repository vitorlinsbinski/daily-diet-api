import fastify from 'fastify';
import cookie from '@fastify/cookie';
import { mealsRoutes } from './routes/meals';
import { signUpRoutes } from './routes/sign-up';
import { signInRoutes } from './routes/sign-in';
import { userRoutes } from './routes/user';
import { SignOutRoutes } from './routes/sign-out';
import cronJob from './utils/cleanExpiredSessions';

export const app = fastify();

app.register(cookie);

cronJob.start();

app.register(signUpRoutes, {
  prefix: '/sign-up',
});

app.register(signInRoutes, {
  prefix: '/sign-in',
});

app.register(SignOutRoutes, {
  prefix: '/sign-out',
});

app.register(mealsRoutes, {
  prefix: '/meals',
});

app.register(userRoutes, {
  prefix: '/user',
});
