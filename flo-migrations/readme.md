# FLO Web

## Country-state data migration

-   Migrate country and state data to mongodb after building nest app

### Tech

It uses [migrate-mongoose](https://github.com/balmasi/migrate-mongoose) package

### Installation

```sh
$ cd flo
$ npm install migrate-mongoose
```

### Migration Script

For compiling ts files

```sh
$ npm run build
```

For migrating country and state to mongodb

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
-   It will run migrate.js file which is in country-migrate folder
-   migrate.js file migrate country and state into database
-   After migration nest app is run in debug mode

### Migration Documentation

[You can find here!!!](https://github.com/balmasi/migrate-mongoose)
