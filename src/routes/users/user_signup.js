
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const {sequelize, Sequelize} = require("../../../server");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authUser = require("../../validations/authUser");
const signature = "mySignature";

const sRounds = 10;

router.use(body_parser.json());

const validateUsernameExists = (req, res, next) => {
    const username = req.body.username;
    
    sequelize.query('SELECT * FROM users WHERE username = :username', {
        type: Sequelize.QueryTypes.SELECT,
        replacements:{username}
    }).then((response) =>{
        if (response == "") {
            next();
        } else{
            res.status(404).json({err: "User already exists"});            
        }
    }).catch(err => console.log(err))
}

const createUser = (req, res, next) => {
    const { fullName, email, phone, user_address, user_password, username, is_admin } = req.body;

    sequelize.query('INSERT INTO users VALUES (NULL, :fullName, :email, :phone, :user_address, :user_password, :username, :is_admin, NULL, NULL)', {
        replacements: {
            fullName,
            email,
            phone,
            user_address,
            user_password,
            username,
            is_admin
        }
    }).then((response) =>{
        next();
    }).catch(err => res.json(err));
}

router.post("/user/signup", [validateUsernameExists, createUser], (req, res) =>{
    const {username, user_password} = req.body;

    bcrypt.hash(user_password, sRounds, (err, hash) =>{
        if (hash) {
            sequelize.query('UPDATE users SET hash = :hash WHERE username = :username AND user_password = :user_password',{
                replacements: {
                    hash,
                    username,
                    user_password
                }
            }).then((response) =>{
                res.status(201).json({msg: "User created succesfully"});
            }).catch(e => res.status(400).json(e));
        } else{
            res.status(400).json({err});
        }
    });
});

const validateWithJWT = (req, res, next) =>{
    const {username} = req.body;
    req.params.token = jwt.sign(username, signature);
    next();
}

router.post("/user/auth", validateWithJWT, (req, res) =>{
    const {username} = req.body;
    const adminToken = req.params.token;
    res.status(201).json({msg: `User *${username}* succesfully authenticated`,
        adminToken});
});

router.post("/user/login", authUser, (req, res) =>{
    const userIdentity = req.params.loggedUser;
    const {username, user_password} = req.body; 

    if (username === userIdentity) {
        sequelize.query('UPDATE users SET isLogged = "true" WHERE username = :username AND user_password = :password',{
            replacements : {
                username: userIdentity,
                password: user_password
            }
        }).then(() =>{
            res.status(200).json({msg: `User *${userIdentity}* is now logged in`});
        }).catch(err => res.status(400).json(err));
    } else{
        res.status(404).json({err: "username or password is incorrect. Please check them and try again."});
    }
});

router.post("/user/:username/logout", (req, res) =>{
    const {username} = req.params;
    sequelize.query('SELECT username FROM users WHERE username = :username',{
        type: Sequelize.QueryTypes.SELECT,
        replacements : {
            username
        }
    }).then((user) =>{
        const foundUser = user[0].username;
        if (foundUser === username) {
            sequelize.query('UPDATE users SET isLogged = "false" WHERE username = :username',{
                replacements: {
                    username
                }
            }).then(() => res.status(200).json({msg: `User ${foundUser} has logged out`}));
        } else {res.status(404).json({msg: `User ${username} does not exist. Please try again`})}
    }).catch(errSelect => res.status(400).json(errSelect));
});

module.exports = router;