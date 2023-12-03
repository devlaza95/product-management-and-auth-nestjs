#!/bin/bash


cd src/infrastructure/docker || exit

# Run the docker-compose file
docker-compose up -d

sleep 0.5

cd ../../../

pnpm run migration-fresh-seed
