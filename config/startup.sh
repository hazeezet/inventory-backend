#!/bin/sh

# updated the database
npx sequelize-cli db:migrate

# state the server
npm start
