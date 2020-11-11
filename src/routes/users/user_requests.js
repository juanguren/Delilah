
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const {sequelize, Sequelize} = require("../../../server");
const bcrypt = require("bcrypt");
const authUser = require("../../validations/authUser");
const isAdmin = require("../../validations/isAdmin");
const {
    userbyID,
    validateUsernameExists,
    createUser,
    validateWithJWT,
    validateHash
} 
= require("./user_middlewares");

const sRounds = 10;
router.use(body_parser.json());

router.get("/users", [authUser, isAdmin], (req, res) =>{
    sequelize.query('SELECT * FROM users',{
        type: Sequelize.QueryTypes.SELECT
    }).then((users) =>{
        if (users) {
            res.status(200).json(users)
        } else{
            res.status(204).json({msg: "No users registered yet"});
        } 
    }).catch((err) =>{
        res.status(500).json(err);
    })
});

router.get("user/:id", [
    authUser,
    isAdmin,
    userbyID
], (req, res) =>{
    let foundUser = req.params.found;
    res.status(200).json(foundUser);
});

router.post("/user", [
    validateUsernameExists,
    createUser
], (req, res) =>{
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
            }).catch(e => res.status(500).json(e));
        } else{
            res.status(400).json({err});
        }
    });
});

router.post("/user/auth", validateWithJWT, (req, res) =>{
    const user = req.params.username;
    const userToken = req.params.token;
    res.status(201).json({msg: `User *${user}* succesfully authenticated`,
        userToken});
});

router.post("/user/login", [authUser, validateHash], (req, res) =>{
    const userIdentity = req.params.loggedUser;
    const { username, user_password } = req.body; 

    if (username === userIdentity) { 
        sequelize.query(`
        UPDATE users SET isLogged = "true"
        WHERE username = :username AND user_password = :password`,{
            replacements : {
                username: userIdentity,
                password: user_password
            }
        }).then(() =>{
            res.status(200).json({msg: `Success! User *${userIdentity}* is now logged in`});
        }).catch(err => res.status(500).json(err));
    } else{
        res.status(404).json({err: "Username or password is incorrect. Please check them and try again."});
    }
});

router.put("/user/:username/logout", (req, res) =>{
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
        } else {res.status(404).json({err: `User ${username} does not exist. Please try again`})}
    }).catch(errSelect => res.status(500).json(errSelect));
});

module.exports = router;