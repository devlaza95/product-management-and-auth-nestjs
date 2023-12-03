# Product Management System

## Assignment requirements

Napraviti API koji omogućava upravljanje proizvodima korišćenjem Node.js, poželjno je da se
koristi Nest.js https://nestjs.com/.
Api treba da ima sljedeće endpoint-e:

`(POST) /user/register | treba omogućiti korisniku da se registruje
(email, password, first name, last name, phone)`

`(POST) /user/login | treba omogućiti korisniku da se loguje na platformu.`

Ovaj endpoint bi trebao da vraća jwt token koji će se koristiti za
autentikaciju

`(POST) /products | logovani korisnik treba da ima mogućnost da se kreira novi product`

Product: (name, description, price, quantity)

`(GET) /products | logovani korisnik može da vidi sve produkte na platformi`

`(GET) /products/:id | logovani korisnik može dobije product po id`

`(DELETE) /product/:id | logovani korisnik može izbrisati samo svoj product`

Potrebno dokumentovati API u swagger-u.

Rok izrade: 3 radna dana
Dostava urađenog zadatka: Github Repository link putem email-a

## Technical requirements

- Node.js
- Nest.js "^10.0.0",
- Docker
- Bash/Zsh
- pnpm

## How to run

1. Clone repository
2. Run `pnpm install`
3. Copy `.env.example` and rename it to `.env`
4. There is a `run.sh` script that will build and run the docker image from docker-compose.yml, also it will run the migrations and seed the database with initial user data.

### Note

To run the script you need to have docker installed and running on your machine.

Also, in order to execute the script you need to have the permission to execute it. You can do that by running `chmod +x run.sh` in the root of the project.

#### Run the shell script
`./run.sh`

You should see something like this in the terminal:

    ✔ Container product-management-redis-insights  Started                                                                                                                                                                         0.0s 
    ✔ Container product-management-db              Started                                                                                                                                                                         0.0s
    ✔ Container product-management-redis           Started                                                                                                                                                                                    0.0s
    
    > product-management@0.0.1 migration-fresh-seed /Users/...
    > npx mikro-orm migration:fresh --seed
    
    Processing 'Migration20231202155831'
    Applied 'Migration20231202155831'
    Processing 'Migration20231202174424'
    Applied 'Migration20231202174424'
    Successfully migrated up to the latest version
    ✅ Seeded Test user data
    ✅ Seeded Test Products data
    Database seeded successfully with seeder class 

**You will get 1 user and 50 products seeded into your local database.**

## Runing the app

When everything is successfully installed you can run the server with `pnpm run start:dev` command.

### Verify following:

- [x] Server is running on `http://localhost:3001`
- [x] Swagger is running on `http://localhost:3001/api/docs`
- [x] RedisInsight is running on `http://localhost:8001`

## Connect to RedisInsight

To examine redis data you can connect to RedisInsight with following steps:

- Open RedisInsight on `http://localhost:8001`
- Click on `Add Redis Connection`
- Enter `product-management-redis` as `Host`
- Enter `6379` as `Port`
- Enter `product-management-redis` as `Name`
- Click `Connect`

## Testing the api

As you seeded the data by running the `run.sh` script you can now use these credentials to play around in Swagger:

- email: `john@doe.com`
- password: `ASDasd123!!!!`

This specific user will - as mentioned above - have 50 products seeded into the database.

Or you can create your own user by using the `POST /api/v1/authentication/sign-up` endpoint and create your own products 🚀


