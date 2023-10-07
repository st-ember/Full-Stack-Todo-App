const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const validator = require("validator");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const port = 3001;

require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());

const secret = process.env.ACCESS_TOKEN_SECRET;

// middleware to validate token and decode payload
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
        const { username, email, password } = req.body;
        const saltRounds = 12;
        const userId = uuid.v4();
        const emailIsValid = validator.isEmail(email);
        if(!emailIsValid) {
            return res.status(400).json({ message: "Not email" });
        };
        // return true or false from promise to determine if email already exists in db
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
        // if email is unique, insert data into db, else tell client to use different email
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
                        const token = jwt.sign(payload, secret);
                        res.status(200).json({ message: "Account created", token: token });
                    }
                });
            } else {
                res.status(400).json({ message: "An account already exists with this email" })
            }
        
        
    } catch(err) {
        console.log(err);
    };
});

app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    if(!email) {
        return res.status(400).json({ message: "No email" });
    };
    if(!password) {
        return res.status(400).json({ message: "No password" });
    };
    // compare password with bcrypt
    const comparePassword = () => {
        const compareQuery = "SELECT password_hash FROM users WHERE email = ?";
        return new Promise ((resolve, reject) => {
            connection.query(compareQuery, email, (err, results) => {
                if(err) {
                    console.log(err);
                    reject(err);
                } else if(results.length === 0){
                    return res.status(400).json({ message: "No account created with this email" })
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
    // if password matches, send token with userId and username as payload
    const passwordMatch = await comparePassword();
    if(passwordMatch) {
        queryUserIdAndUsername()
        .then(queryResults => {
            const payload = { userId: queryResults[0].userId, username: queryResults[0].username };
            // Expires in 1 hour
            const expirationTime = Math.floor(Date.now() / 1000) + 3600;
            const token = jwt.sign(payload, secret, { expiresIn: expirationTime });
            res.status(200).json({ message: "password matches", token: token });
        });
    } else {
        res.status(400).json({ message: "Password does not match email" });
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
