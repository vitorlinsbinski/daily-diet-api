import fastify from 'fastify';
import cookie from '@fastify/cookie';
import { mealsRoutes } from './routes/meals';
import { signUpRoutes } from './routes/sign-up';
import { signInRoutes } from './routes/sign-in';

export const app = fastify();

app.register(cookie);

app.register(signUpRoutes, {
  prefix: '/sign-up',
});

app.register(signInRoutes, {
  prefix: '/sign-in',
});

app.register(mealsRoutes, {
  prefix: '/meals',
});
