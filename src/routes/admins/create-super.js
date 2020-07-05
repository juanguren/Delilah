
const express = require("express");
const jwt = require("jsonwebtoken");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");

router.use(body_parser.json());

const user = "juanguren";
const pass = "123";
const token = jwt.sign(user, pass);
console.log(token);

// ! Add the following fields to super DB: username, password, isLogged. 

let validateSuperwithJWT = (req, res, next) =>{
    const { username, password } = req.body;
    const token = jwt.sign(username, password);
    console.log(token);
}

router.post("/start", validateSuperwithJWT, (req, res) =>{
    const { fullName, super_address, username, password, isLogged } = req.body;
    console.log(fullName, super_address, username, password, isLogged);
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

router.post("/super/logout", (req, res) =>{

})

/*
let validateSuper = (req, res, next) =>{
    let ID = req.params.id;
    let adminOn = false;

    sequelize.query('SELECT * from super_admin WHERE super_id = :id',{
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
            id: ID
        }
    }).then((response) =>{
        if (response == "") {
            res.status(404).json({err: "Super admin not found. Please check its credentials"});
        } else{
            adminOn = true;
            next();
        }
    })
}

router.post("/super_login/:id", validateSuper, (req, res) =>{
    res.status(200).json({msg: "Login succesful!"})
})
*/
module.exports = router;