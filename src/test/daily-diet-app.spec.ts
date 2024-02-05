import { it, expect, beforeAll, beforeEach, afterAll, describe } from 'vitest';
import { execSync } from 'child_process';
import request from 'supertest';
import { app } from '../app';

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

beforeEach(() => {
  execSync('npm run knex -- migrate:rollback --all');
  execSync('npm run knex -- migrate:latest');
});

describe('Meals routes', () => {
  it('should be able to create a new meal', async () => {
    await request(app.server)
      .post('/sign-up')
      .send({
        name: 'Vitor Linsbinski',
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(201);

    const signInResponse = await request(app.server)
      .post('/sign-in')
      .send({
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(200);

    const cookies = signInResponse.get('Set-Cookie');

    const createMealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'Description of meal 1',
        is_on_diet: true,
      });

    expect(createMealResponse.statusCode).toEqual(201);
  });

  it('should be able to list all the meals', async () => {
    await request(app.server)
      .post('/sign-up')
      .send({
        name: 'Vitor Linsbinski',
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(201);

    const signInResponse = await request(app.server)
      .post('/sign-in')
      .send({
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(200);

    const cookies = signInResponse.get('Set-Cookie');

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'Description of meal 1',
        is_on_diet: true,
      })
      .expect(201);

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200);

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: expect.any(String),
        description: expect.any(String),
        is_on_diet: expect.any(Number),
      }),
    ]);
  });

  it('should be able to get a meal with a specific id', async () => {
    await request(app.server)
      .post('/sign-up')
      .send({
        name: 'Vitor Linsbinski',
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(201);

    const signInResponse = await request(app.server)
      .post('/sign-in')
      .send({
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(200);

    const cookies = signInResponse.get('Set-Cookie');

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'new meal',
      description: 'meal description',
      is_on_diet: false,
    });

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200);

    const mealId = listMealsResponse.body.meals[0].id;

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies);

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'new meal',
        description: 'meal description',
        is_on_diet: 0, // false
      })
    );
  });

  it('should be able to edit a meal', async () => {
    await request(app.server)
      .post('/sign-up')
      .send({
        name: 'Vitor Linsbinski',
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(201);

    const signInResponse = await request(app.server)
      .post('/sign-in')
      .send({
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(200);

    const cookies = signInResponse.get('Set-Cookie');

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'meal',
      description: 'meal description',
      is_on_diet: false,
    });

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200);

    const mealId = listMealsResponse.body.meals[0].id;

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'meal edited',
        description: 'meal description edited',
        is_on_diet: true,
      })
      .expect(204);
  });

  it('should be able to delete a meal', async () => {
    await request(app.server)
      .post('/sign-up')
      .send({
        name: 'Vitor Linsbinski',
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(201);

    const signInResponse = await request(app.server)
      .post('/sign-in')
      .send({
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(200);

    const cookies = signInResponse.get('Set-Cookie');

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'meal',
      description: 'meal description',
      is_on_diet: false,
    });

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200);

    const mealId = listMealsResponse.body.meals[0].id;

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(204);
  });
});

describe('Sign-in routes', () => {
  it('should be able to sign-in if the account is registered', async () => {
    await request(app.server)
      .post('/sign-up')
      .send({
        name: 'Vitor Linsbinski',
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(201);

    await request(app.server)
      .post('/sign-in')
      .send({
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(200);
  });

  it('should not be able to sign-in if the account is not registered', async () => {
    await request(app.server)
      .post('/sign-in')
      .send({
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(401);
  });
});

describe('Sign-up routes', () => {
  it('should be able to register an account if it does not exist', async () => {
    await request(app.server)
      .post('/sign-up')
      .send({
        name: 'Vitor Linsbinski',
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(201);
  });

  it('should not be able to register an account if it already exists', async () => {
    await request(app.server)
      .post('/sign-up')
      .send({
        name: 'Vitor Linsbinski',
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(201);

    await request(app.server)
      .post('/sign-up')
      .send({
        name: 'Vitor Linsbinski',
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(409);
  });
});

describe('Sign-out routes', () => {
  it('should be able to sign-out if the user is signed-in', async () => {
    await request(app.server)
      .post('/sign-up')
      .send({
        name: 'Vitor Linsbinski',
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(201);

    const signInResponse = await request(app.server)
      .post('/sign-in')
      .send({
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(200);

    const cookiesAfterSignIn = signInResponse.get('Set-Cookie');
    expect(cookiesAfterSignIn).toBeDefined();

    await request(app.server)
      .delete('/sign-out')
      .set('Cookie', cookiesAfterSignIn)
      .expect(200);
  });

  it('should not be able to sign-out if the user is not signed-in', async () => {
    await request(app.server).delete('/sign-out').expect(400);
  });
});

describe('User routes', () => {
  it("should be able to list user's metrics", async () => {
    await request(app.server)
      .post('/sign-up')
      .send({
        name: 'Vitor Linsbinski',
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(201);

    const signInResponse = await request(app.server)
      .post('/sign-in')
      .send({
        email: 'vitor.linsbinski@hotmail.com',
      })
      .expect(200);

    const cookies = signInResponse.get('Set-Cookie');

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Breakfast',
      description: 'Break, eggs, coffee and milk',
      is_on_diet: true,
    });

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Morning Snack',
      description: 'Chocolate',
      is_on_diet: false,
    });

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Lunch',
      description: 'Rice, beans, meat, salad',
      is_on_diet: true,
    });
    const getUserMetricsResponse = await request(app.server)
      .get('/user/metrics')
      .set('Cookie', cookies)
      .expect(200);

    expect(getUserMetricsResponse.body.metrics).toEqual(
      expect.objectContaining({
        total_meals: 3,
        meals_within_diet: 2,
        meals_off_diet: 1,
        best_sequence_within_diet: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            is_on_diet: expect.any(Number),
          }),
        ]),
      })
    );
  });
});
