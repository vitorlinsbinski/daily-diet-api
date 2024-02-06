<div align="center">
  <img src="./assets/node-logo.svg"/>
</div>

<h1 align = "center">Daily Diet API</h1>

<p>The Daily Diet API is designed to assist users in managing their daily dietary habits. Whether you are trying to maintain a healthy lifestyle or follow a specific diet plan, this API enables you to track your meals, analyze dietary patterns, and retrieve personalized metrics. It provides a seamless experience for creating, editing, and deleting meals.</p>

<div align="center">
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <img src="https://img.shields.io/static/v1?label=node&message=v20.11.1&color=blue&style=plastic&logo="/>
    <img src="https://img.shields.io/static/v1?label=fastify&message=v4.26.0&color=blue&style=plastic&logo="/>
    <img src="https://img.shields.io/static/v1?label=knex&message=v3.1.0&color=blue&style=plastic&logo="/>
  </div>
</div>

<h4 align="center"> 
	Daily Diet API | Status: Done ✔️
</h4>

## Table of Contents

- [API Endpoints](#api-endpoints)
- [Requirements to run the project](#requirements-to-run-the-project)
- [Running the application](#running-the-application)
- [Tests](#tests)
- [Main Technologies](#main-technologies)
- [License](#license)
- [Author](#author)

## API endpoints

## • Meals

#### GET /meals

Retrieve all meals for the authenticated user.

#### GET /meals/:id

Retrieve details of a specific meal for the authenticated user.

#### POST /meals

Create a new meal for the authenticated user in the format bellow:

```json
{
  "name": "Meal name",
  "description": "Meal description",
  "is_on_diet": true
}
```

#### PUT /meals/:id

Update details of a specific meal for the authenticated user, sending the data through body request in the format bellow:

```json
{
  "name": "Meal name UPDATED",
  "description": "Meal description UPDATED",
  "is_on_diet": false
}
```

#### DELETE /meals/:id

Delete a specific meal for the authenticated user.

## • User

#### GET /user:

Retrieve details of the authenticated user.

#### GET /user/metrics:

Retrieve metrics for the authenticated user.

## • Authentication

#### POST /sign-up:

Create a new user account with "name" and "email" fields.

#### POST /sign-in:

Sign in with an existing user account by sending the email registered.

#### DELETE /sign-out:

Sign out the authenticated user.

## Requirements to run the project

<p>Before you run the project, check if you have [Node.js](https://nodejs.org/en/) installed on your machine, as well [Git](https://git-scm.com) to clone this repository.</p>

<p>You must create a ".env" file, for development and production, and ".env.test", for testing, to insert environment variables. Check the ".env" examples provided in the root directory.</p>

## Running the application

```bash
    # Clone this repository on your machine:
    $ git clone https://github.com/vitorlinsbinski/daily-diet-api.git

    # Access the project folder in your terminal:
    $ cd daily-diet-api

    # Install all dependencies:
    $ npm install

    # Run the application:
    $ node run dev
```

<p>After that, you may use some API Client to send HTTP requests to the server, like Insomnia.</p>

## Tests

<p>In this project, Vitest was used as a testing tool to provide us E2E (end-to-end) tests in our routes.</p>

<span>Command to run the tests: </span>

```bash
    npm run test
```

## Main Technologies

- [Node.js](https://nodejs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Fastify](https://www.fastify.io/)
- [Knex.js](http://knexjs.org/)
- [SQLite](https://www.sqlite.org/)
- [Zod](https://github.com/colinhacks/zod)
- [Dotenv](https://github.com/motdotla/dotenv)
- [Vitest](https://vitest.dev/)
- [Supertest](https://github.com/ladjs/supertest)

## License

This project is licensed under [MIT](https://choosealicense.com/licenses/mit/) License.

### Author

<a href="https://github.com/vitorlinsbinski">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/69444717?v=4" width="100px;" alt=""/>
 <br />
 <sub><b>Vitor Linsbinski</b></sub></a> <a href="https://github.com/vitorlinsbinski" title="">🚀</a>

Developed by Vitor Linsbinski

[![Linkedin Badge](https://img.shields.io/badge/-Vitor-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/vitorlinsbinski/)](https://www.linkedin.com/in/vitorlinsbinski/)
