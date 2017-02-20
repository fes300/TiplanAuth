# NodeJS JWT Authentication API

## Running it

Just clone the repository, run `npm install` and then `node server.js`.

## Running it with Docker

pull the app image:
`docker pull fes300/triplan-api`

pull last mongo image (will download mongo at `:latest` tag):
`docker pull mongo`

run mongo container as daemon and name = 'mongo-container'
`docker run -d --name mongo-container mongo`

run app container as daemon, link port 3001 of your local machine to port 3001 of the running container and set current folder as shared volume
`docker run --link=mongo-container:mongodb -p 4001:4001 -v $(pwd):/usr/src/app -d fes300/triplan-api:latest`
(don't run `npm install` on your local machine before launching this command!)

now the api sould be listening up and running at `localhost:4001`


## Not protected paths

### Quotes API

#### GET `/quotes`

It returns a String with a Random quote from Chuck Norris. It doesn't require authentication.


## Protected paths

First make a POST call to `/sessions/create` to log in:

#### POST `/sessions/create`

The body must have:

* `username`: The username
* `password`: The password

If successful, it returns the following:

```json
{
  "id_token": {jwt}
}
```

Then you must save somewhere in the client the token and all subsequent requests must have the the header
"Authorization: Bearer `id_token`". For instance, to create a new user:

#### POST `/users/user`

The body must have:

* `username`: The username || `email`: The e-mail
* `password`: The password

It returns the following:

```json
{
  "id_token": {jwt}
}
```

to delete a user:
#### DELETE `/users/user/id`
