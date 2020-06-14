
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const {sequelize} = require("../../../server");

router.use(body_parser.json());

/* ====== SECTION - MIDDLEWARES: ======= */

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

router.post("/user_signup", validateUsernameExists, (req, res) =>{
    const { fullName, email, phone, address, username, password } = req.body;

    sequelize.query('INSERT INTO users VALUES (NULL, :fullName, :email, :phone, :address, :username, :password)', {
        replacements: {
            fullName: fullName,
            email: email,
            phone: phone,
            address: address,
            username: username,
            password: password // TODO - Hash using bcrypt library for node.js
        }
    }).then((response) =>{
        res.json(response);
    }).catch(err => res.json(err));
});

module.exports = router;