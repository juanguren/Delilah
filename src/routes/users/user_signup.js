
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const {sequelize} = require("../../../server");
const bcrypt = require("bcrypt");

const sRounds = 10;

router.use(body_parser.json());

// "/signup" | Validate uniqueness of the username
function validateUsernameExists(req, res, next){
    const username = req.body.username;
    
    sequelize.query('SELECT * FROM users WHERE username = :username', {
        type: sequelize.QueryTypes.SELECT,
        replacements:{username}
    }).then((response) =>{
        if (response == "") {
            next();
        } else{
            console.log(response);
            res.status(404).json({err: "User already exists"});            
        }
    }).catch(err => console.log(err))
}

function createUser(req, res, next){
    const { fullName, email, phone, user_address, user_password, username, is_admin } = req.body; // ! hash is null..

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

module.exports = router;