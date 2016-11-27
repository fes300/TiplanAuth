# NodeJS JWT Authentication API

#### POST `/users`

You can do a POST to `/users` to create a new user.

The body must have:

* `username`: The username
* `password`: The password

It returns the following:

```json
{
  "id_token": {jwt}
}
```

#### POST `/sessions/create`

You can do a POST to `/sessions/create` to log a user in.

The body must have:

* `username`: The username
* `password`: The password

It returns the following:

```json
{
  "id_token": {jwt}
}
```


### Quotes API

#### GET `/api/random-quote`

It returns a String with a Random quote from Chuck Norris. It doesn't require authentication.

## Running it

Just clone the repository, run `npm install` and then `node server.js`.

## Running it with Docker

pull the app image:
`docker pull fes300/triplan-api:0.0.1`

pull last mongo image (will download mongo at `:latest` tag):
`docker pull mongo`

run mongo container as daemon and name = 'mongo-container'
`docker run -d --name mongo-container mongo`

run app container as daemon, link port 3001 of your local machine to port 3001 of the running container and set current folder as shared volume
`docker run --link=mongo-container:mongodb -p 3001:3001 -v $(pwd):/usr/src/app -d fes300/triplan-api:0.0.1`

now the api sould be listening up and running at `localhost:3001`

to access the container image:
`docker exec -it [container-id] bash`
