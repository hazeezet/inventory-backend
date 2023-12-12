# Inventory Backend

## Localhost config

copy .env.example to .env

fill all options

> run the migration to update your database

```bash
npx sequelize-cli db:migrate
```

> start the development server

```bash
npm run dev
```

## Production config

> Build your application

```bash
npm run build
```

put all the environment variables to your server

> run the migration

```bash
npx sequelize-cli db:migrate
```

> start the app

```bash
npm start
```

## Testing

Each test is independent, and it involves logging in multiple times
because of this you need to disable rate limit temporarily in login route

either: 
- comment off line `15` - `36`
- increase the `max` to something like 9999999999

as you wish

*REMEMBER TO UNDO*

### Test

the test depends on the build version of the application, so make sure build is available
```bash
npm run build
```

there is an `env` called `.env.test.example` copy it to `.env.test`

and fill all details, that is where the test will get informations from

then run

```bash
npm run test
```

each test is grouped because there are some test that does not involve testing over and over again like registration route

when you run the command above you will be prompt to enter the group

`Enter the test group to run (or 'all' for all):`

type `v1/auth` to run authentication test

type `all` to run all test

type `v1` to run all version 1 API test

Think of grouping like a folder

```
v1/
  ├── auth/
  │    └── ...
  ├── branch/
  │    └── ...
  └── ...
```