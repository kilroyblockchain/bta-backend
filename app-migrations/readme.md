# Application

## Data migration

-   Migrate data to mongodb after building nest app

### Tech

It uses [migrate-mongoose](https://github.com/balmasi/migrate-mongoose) package

### Installation

```sh
$ cd app
$ npm install migrate-mongoose
```

### Create migration file

You should create a config file default migrate.json or [other].json, refer migrate.json.sample

#### For default

```sh
$ node_modules/.bin/migrate create sample-migrate
```

#### For custom

```sh
$ node_modules/.bin/migrate create sample-migrate --config custom-migration.json
```

### Migration Script

For compiling ts files

```sh
$ npm run build
```

For migrating admin user to mongodb

```sh
$ npm run start:migrate
```

For running app

```sh
$ nest start --debug --watch
```

For all in one

```sh
$ npm run build && npm run start:migrate && nest start --debug --watch
```

Or

```sh
$ npm run debug
```

### Description

-   First it will build .ts file into dist folder
-   It will run migrate.js file which is in ancestor-culture-migrations/admin-user-migrate folder
-   migrate.js file migrate admin user into database
-   After migration nest app is run in debug mode

### Migration Documentation

[You can find here!!!](https://github.com/balmasi/migrate-mongoose)
