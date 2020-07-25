
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
        replacements:{username: username}
    }).then((response) =>{
        if (response == "") {
            next();
        } else{
            res.status(404).json({err: "User already exists"});            
        }
    }).catch(err => console.log(err))
}

function encryptPassword(req, res, next){
    const {username, password} = req.body;

    bcrypt.hash(password, sRounds, (err, hash) =>{
        sequelize.query('ALTER TABLE users ADD `hash` VARCHAR(100) NULL AFTER `is_admin',{
        }).then((response) => console.log(response))
        if (hash) {
            sequelize.query('UPDATE users SET hash = :hash WHERE username = :username',{
                replacements: {
                    hash,
                    username
                }
            }).then(response => console.log(response)
            ).catch(error => console.log(error));

            next();
        } else{
            res.status(400).json({err});
        }
    });
}

router.post("/user_signup", [validateUsernameExists, encryptPassword], (req, res) =>{
    const { fullName, email, phone, address, username, password } = req.body;

    sequelize.query('INSERT INTO users VALUES (NULL, :fullName, :email, :phone, :address, :username, :password)', {
        replacements: {
            fullName: fullName,
            email: email,
            phone: phone,
            address: address,
            username: username,
            password: password
        }
    }).then((response) =>{
        res.json(response);
    }).catch(err => res.json(err));
});

module.exports = router;