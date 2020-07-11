
const express = require("express");
const jwt = require("jsonwebtoken");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");

router.use(body_parser.json());

// ! Add the following fields to super DB: username, password, isLogged. 

router.post("/start", (req, res) =>{
    const { fullName, super_address, username, password, isLogged } = req.body;
    if (req.body) {
        sequelize.query('INSERT into super_admin VALUES (NULL, :fullName, :super_address, :username, :password, :isLogged)',{
            replacements: {
                fullName,
                super_address,
                username,
                password,
                isLogged
            }
        }).then((response) =>{
            if (response = "") {
                res.status(400).json({err: "There was an error creating this super admin. Please try again."})
            } else{
                sequelize.query('UPDATE super_admin SET isLogged = "true" WHERE password = :password ',{
                    replacements: {
                        password
                    }
                }).then(response => console.log(response))
                    .catch(err => console.log(err));

                res.status(201).json({msg: `Super admin ${fullName} created and logged in succesfully`});
            }
        }).catch(err => console.log(err))
    } else{
        res.status(404).json({msg: "Incomplete data!"})
    }
});

let validateWithJWT = (req, res, next) =>{
    const { username, password } = req.body;
    if (req.body) {
        sequelize.query('SELECT * FROM `super_admin` WHERE username = :username AND password = :password',{
            type: Sequelize.QueryTypes.SELECT,
            replacements:{
                username,
                password
            }
        }).then((response) =>{
            if (response) {
                req.params.token = jwt.sign(username, password);
                next();
            } else{
                res.json({err: "Invalid credentials"});
            }
        }).catch(err => console.log(err))
    }
}

router.post("/super-login", validateWithJWT, (req, res) =>{
    const username = req.body;
    const superToken = req.params.token;
    res.status(201).json({msg: `Admin *${username.username}* created succesfully`,
        superToken});
});

router.post("/auth", (req, res) =>{
    const hey = req.headers.authorization.split(' ')[1];
    console.log(hey);
})

router.post("/super/logout", (req, res) =>{

});

module.exports = router;