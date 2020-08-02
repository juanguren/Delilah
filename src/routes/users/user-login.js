
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const {sequelize} = require("../../../server");
const bcrypt = require("bcrypt");

// TODO: Add this method to a login endpoint
bcrypt.compare("hey", "$2b$10$umfY74q0qVETPz3d8HxmyOerLbiD2vSk5MsES4GqjPkr1mftIV01G", (err, result) =>{
    console.log(result);
})

router.use(body_parser.json());

const validateHash = (req, res, next) =>{
    const {username, user_password} = req.body;

    sequelize.query('SELECT hash from users WHERE username = :username AND user_password = :user_password', {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            username,
            user_password
        }
    }).then((foundHash) =>{
        const {hash} = foundHash[0];
        bcrypt.compare(user_password, hash, (err, result) =>{
            if (result) {
                sequelize.query('UPDATE users set isLogged = "true"')
                .then((response) =>{
                    res.status(200).json({msg: `Success! User ${username} is logged in`});
                });
            } else{
                res.json(400).json({err: "Operation unsuccesful. Please check user credentials"});
            }
        });
    });
}

router.post("/user/login", validateHash, (req, res) =>{
    
})

module.exports = router;