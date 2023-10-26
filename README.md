# Full Stack Todo App

## Project Overview
Full Stack CRUD App with React Frontend, Express Backend, linked to MySQL DB, Styled with Tailwind

## Features
- Sign Up
- Sign In
- Log Out
- Create Todo
- Edit Todo
- Delete Todo

## Environment Requirements
Node.js, MySQL

## To Run Locally
1. clone repo

2. Create .env file in server folder
- Assign key-value pairs:
ACCESS_TOKEN_SECRET
DB_HOST
DB_DATABASE
DB_USER
DB_PASSWORD

3. Set up DB:
CREATE DATABASE your_db_name
CREATE TABLE users

4. Set up tailwind:
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch

5. Set up client:
cd client npm install npm run dev

6. Set up server:
cd server npm install npm run dev




