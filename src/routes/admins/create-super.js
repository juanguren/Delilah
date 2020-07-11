
const express = require("express");
const jwt = require("jsonwebtoken");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");
const signature = "mySignature";

router.use(body_parser.json());

// ! Add the following fields to super DB: username, password, isLogged. 

router.post("/create-super", (req, res) =>{
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
                res.status(201).json({msg: `Super admin ${fullName} created`});
            }
        }).catch(err => console.log(err))
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
                req.params.token = jwt.sign(username, signature);
                next();
            } else{
                res.json({err: "Invalid credentials"});
            }
        }).catch(err => console.log(err))
    }
}

router.post("/auth", validateWithJWT, (req, res) =>{
    const username = req.body;
    const superToken = req.params.token;
    res.status(201).json({msg: `Admin *${username.username}* succesfully authenticated`,
        superToken});
});

let authUser = (req, res, next) =>{
    const getToken = req.headers.authorization.split(' ')[1]; // * Split divides the "Bearer" from the actual token. [1] is the position in which the token´s found.
    const verifyToken = jwt.verify(getToken, signature);
    if (verifyToken) {
        req.params.loggedUser = verifyToken;
        next();
    } else{
        res.status(404).json({err: "Something failed in the authentication process. Please check the Bearer Token"});
    }
}

router.post("/super-login", authUser, (req, res) =>{
    let okUsername = req.params.loggedUser;
    sequelize.query('SELECT username FROM super_admin WHERE username = :username',{
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
            username: okUsername
        }
    }).then((response) =>{
        if (response) {
            sequelize.query('UPDATE super_admin SET isLogged = "true" WHERE username = :username',{
                replacements: {
                    username: okUsername
                }
            }).then((response));
            res.status(200).json({msg: `Admin *${okUsername}* succesfully logged in`});
        } else{
            res.status(404).json({err: "Not found"});
        }
    })
})

router.post("/super/logout", (req, res) =>{

});

module.exports = router;