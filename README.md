# Bitespeed backend task

## Tech

The backend was built on top of following tech-stack using TypeScript as preferred Language:

- NestJS (Framework)
- Express (Server)
- MySQL (Database)
- Docker

### Routes

The API doc can be accessed at: http://localhost:3000/api

### ENV Variables

Project can be configured using different environment variables. These variables can be found in `.env.example` file.

### Demo

For the simplicity of demo, the project has been configured to used Docker as well.

Simply run the following command: `docker-compose up`

Once the containers are up and running, you may visit http://localhost:3000/api to access route information.

### Future enhancements

Few things were scaled down due to the scope of the task/requirement mentioned. Some of them includes (but not limited to):

- Phone number validation.
- DB optimization (Tree entity) 
