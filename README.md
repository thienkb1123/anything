# Anything

## Make content
```
http://localhost:3333/make-youtube-content
```

## Quick start
Local running:
```sh

# Create config
$ make file .env from .env.example

# Install dependencies
$ npm i

# Run app
$ node ace serve --watch

# Run seeders
$ node ace db:seed

# Run and rollback migrations
$ node ace migration:run

# Drop tables and migrate
$ node ace migration:fresh

# List routes
$ node ace list:routes

# Validator classes
node ace make:validator CreateUser


```