
const express = require("express");
const jwt = require("jsonwebtoken");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");
const validateWithJWT = require("../validate_JWT");

const signature = "mySignature";

router.use(body_parser.json()); 

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
});

router.post("/super/:username/logout", (req, res) =>{
    const username = req.params.username;
    sequelize.query('SELECT * from super_admin WHERE username = :username', {
        type: Sequelize.QueryTypes.SELECT,
        replacements : {
            username
        }
    }).then((response) =>{
        if (response) {
            sequelize.query('UPDATE super_admin SET isLogged = "false" WHERE username = :username',{
                replacements: {
                    username
                }
            }).then(response1 => res.status(200).json({msg: `Admin ${username} succesfuly logged out`}));
        } else{
            res.status(404).json({err: "Logged out unsuccesful. Please try again"});
        }
    }).catch(err => res.status(404).json(err));
});

// Quick view (existing super)
router.get("/super", (req, res) =>{
    sequelize.query('SELECT * FROM super_admin',{
        type: Sequelize.QueryTypes.SELECT
    }).then((response) =>{
        if (response) {
            res.status(200).json({response});
        } else{
            res.status(200).json({msg: "Empty field. There´s no super admin yet"});            
        }
    }).catch(err => res.status(404).json({err}));
})

module.exports = router;