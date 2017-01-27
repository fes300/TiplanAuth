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
`docker run --link=mongo-container:mongodb -p 3001:3001 -v $(pwd):/usr/src/app -d fes300/triplan-api:0.0.1`
(don't run `npm install` on your local machine before launching this command! - if it' not working try checking what's wrong with `docker logs -f [container-id]`, then access the image with `docker exec -it [container-id] bash` and try to fix it)

now the api sould be listening up and running at `localhost:3001`

to access the container image:
`docker exec -it [container-id] bash`


after you created the container you just start/stop it with
`docker stop [container-id]`
`docker start [container-id]`

[the mongo container should be stateful (retain the data you put in)]

## Running it with Docker compose

you need to have docker-compose installed. When you have it, just type `docker-compose up` from your terminal. it will do everything you need (use -d flag if you don't want to tail the logs of the containers).

You can directly access mongo container from web container using `mongodb`, as it is the alias specified in the `docker-compose.yml` file under the `links` voice of the web container.

If you want to rebuild the image use `docker-compose up --build`.


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
