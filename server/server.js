const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const validator = require("validator");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

require('dotenv').config();

const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const withAuth = function(req, res, next) {
    const authHeaders = req.headers["authorization"]
    const token = authHeaders && authHeaders.split(" ")[1];
    if (token === null) {
    res.status(401).json({ message: "unauthorized, no token provided" });
    } else {
    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
        res.status(401).json({ message: "unauthorized, invalid token" });
        } else {
        req.userId = decoded.userId;
        req.username = decoded.username;
        next();
        }
    });
    };
};

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    insecureAuth: true
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ');
        return;
    };
    console.log('Connected to the database');
});

app.listen(port);

app.post("/signup", async (req, res) => {
    try{
        const { username, email, password } = req.body.formData;
        const saltRounds = 12;
        const userId = uuid.v4();
        const emailIsValid = validator.isEmail(email);
        if(!emailIsValid) {
            return res.status(400).json({ message: "not email" });
        };
        const checkEmailUnique =  () => {
            const checkQuery = "SELECT * FROM users WHERE email = ?"
            return new Promise ((resolve, reject) => {
                connection.query(checkQuery, email, (err, results) => {
                    if(err) {
                        console.log(err);
                        reject(err);
                    } else if(results.length === 0){
                        return resolve(true);
                    }else {
                        console.log(results);
                        return reject(false);
                    };
                });
            })
        };
        const emailIsUnique = await checkEmailUnique().catch(error => console.error(error));
        if(emailIsUnique) {
                console.log({true: emailIsUnique})
                const hashedPassword = await bcrypt.hash(password, saltRounds);
            const signupQuery = "INSERT INTO users (userId, username, email, password_hash) VALUES(?, ?, ?, ?)";
            const signupValues = [userId, username, email, hashedPassword];
                connection.query(signupQuery, signupValues, (err) => {
                    if(err) {
                        console.log(err);
                    } else { 
                        console.log("inserted successfully");
                        const payload = { userId: userId, username: username };
                        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
                        res.status(200).json({ message: "account created", token: token });
                    }
                });
            } else {
                console.log({false: emailIsUnique})
            }
        
        
    } catch(err) {
        console.log(err);
    };
});

app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    if(!email) {
        return res.status(400).json({ message: "no email" });
    };
    if(!password) {
        return res.status(400).json({ message: "no password" });
    };
    const comparePassword = () => {
        const compareQuery = "SELECT password_hash FROM users WHERE email = ?";
        return new Promise ((resolve, reject) => {
            connection.query(compareQuery, email, (err, results) => {
                if(err) {
                    console.log(err);
                    reject(err);
                } else if(results.length === 0){
                    return res.status(400).json({ message: "invalid email" })
                }else {
                    const hashedPassword = results[0].password_hash;
                    bcrypt.compare(password, hashedPassword, (err, results) => {
                        if(err) {
                            reject(err);
                        } else {
                            return resolve(results);
                        };
                    });
                };
            });
        });
    };
    const queryUserIdAndUsername = async () => {
        const userIdQuery = "SELECT userId, username FROM users WHERE email = ?";
        return new Promise ((resolve, reject) => {
            connection.query(userIdQuery, email, (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                };
            });
        });
    };
    const passwordMatch = await comparePassword();
    if(passwordMatch) {
        queryUserIdAndUsername()
        .then(queryResults => {
            const payload = { userId: queryResults[0].userId, username: queryResults[0].username };
            const expirationTime = Math.floor(Date.now() / 1000) + 3600; // Expires in 1 hour
            const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expirationTime });
            res.status(200).json({ message: "password matches", token: token });
        });
    } else {
        res.status(400).json({ message: "password doesn't match" });
    };
});

app.post("/add-todo", withAuth, (req) => {
    const todo = req.body.todo;
    const userId = req.userId;
    const todoId = uuid.v4();
    const insertQuery = "INSERT INTO todos(todoId, userId, todo) VALUES(?, ?, ?)";
    const values = [todoId, userId, todo];
    connection.query(insertQuery, values, (err) => {
        if(err) {
            console.log(err);
        } else {
            console.log("insert succussful");
        };
    });
});

app.post("/get-todolist", withAuth, (req, res) => {
    const userId = req.userId;
    const username = req.username;
    const fetchQuery = "SELECT todo, todoId FROM todos WHERE userId = ?";
    connection.query(fetchQuery, userId, (err, results) => {
        if(err) {
            console.log(err);
        } else {
            console.log("got em");
            res.status(200).json({ results: results, message: "got todolist", userId: userId, username: username });
        };
    });
});

app.delete("/delete-todo", withAuth, (req, res) => {
    const todoId = req.body.todoId;
    console.log(todoId);
    const deleteQuery = "DELETE FROM todos WHERE todoId = ?";
    connection.query(deleteQuery, todoId, (err) => {
        if(err) {
            console.log(err);
        } else {
            console.log("deleted");
            res.status(200).json({ message: "deleted successfully" });
        };
    });
});

app.put("/update-todo", withAuth, (req, res) => {
    const { todoId, todo } = req.body;
    const updateQuery = `UPDATE todos SET todo = ? WHERE todoId = ?`;
    const updateValues = [todo, todoId];
    console.log(todoId);
    connection.query(updateQuery, updateValues, (err, results) => {
        if(err) {
            console.log(err);
        } else {
            console.log(results);
            res.status(200).json({ message: "updated successfully" });
        };
    });
});