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
Assign key-value pairs:  
ACCESS_TOKEN_SECRET  
DB_HOST  
DB_DATABASE  
DB_USER  
DB_PASSWORD  

3. Set up DB:  
`CREATE DATABASE your_db_name`
  
  `CREATE TABLE users (userId VARCHAR(36), username VARCHAR(50), email VARCHAR(50), password_hash VARCHAR(60)
)`  
  
   `CREATE TABLE todos ()VARCHAR`

5. Set up tailwind:  
`npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch`

6. Set up client:  
`cd client npm install npm run dev`

7. Set up server:  
`cd server npm install npm run dev`
