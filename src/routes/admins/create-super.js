
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");
const validateWithJWT = require("../../validations/superValidation");
const authUser = require("../../validations/authUser");

const signature = "mySignature";

router.use(body_parser.json()); 

const avoidRepeats = (req, res, next) =>{
    const {username} = req.body
    sequelize.query('SELECT super_admin.username FROM super_admin WHERE username = :username',{
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
            username
        }
    }).then((fields) =>{
        fields ? res.status(400).json({err: "Username already exists"}) : next();
    }).catch(err => console.log(err));
}

const createSuper = (req, res, next) => {
    const { fullName, super_address, username, password } = req.body;
    if (req.body) {
        sequelize.query('INSERT into super_admin VALUES (NULL, :fullName, :super_address, :username, :password)',{
            replacements: {
                fullName,
                super_address,
                username,
                password,
                isLogged
            }
        }).then((response) =>{
            if (response = "") {
                res.status(422).json({err: "There was an error creating this super admin. Please try again."})
            } else{
                next();
            }
        }).catch(err => console.log(err))
    }
}

router.post("/super", [avoidRepeats, createSuper, validateWithJWT], (_req, res) =>{
    const username = req.body;
    const superToken = req.params.token;

    res.status(201).json(
        {
            msg: `Super admin ${username} created and authenticated`,
            superToken
        });
});

router.post("/super_login", authUser, (req, res) =>{
    let okUsername = req.params.loggedUser;
    sequelize.query('SELECT username FROM super_admin WHERE username = :username',{
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
            username: okUsername
        }
    }).then((response) =>{
        if (response) {
            sequelize.query(
            `ALTER TABLE super_admin
            ADD isLogged VARCHAR(5) NULL 
            DEFAULT "true"`,
            {
                replacements: { username: okUsername }
            }
            ).then((response));
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
            }).then(() => res.status(200).json({msg: `Admin ${username} succesfuly logged out`}));
        } else{
            res.status(404).json({err: "Log out unsuccessful. Please try again"});
        }
    }).catch(err => res.status(404).json(err));
});

// Quick view (existing super)
router.get("/super", authUser, (req, res) =>{
    sequelize.query('SELECT * FROM super_admin',{
        type: Sequelize.QueryTypes.SELECT
    }).then((response) =>{
        if (response == "") {
            res.status(204).json({msg: "Empty field. There´s no super admin yet"}); 
        } else{
            res.status(200).json({response});           
        }
    }).catch(err => res.status(404).json({err}));
})

module.exports = router;