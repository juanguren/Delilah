
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");

router.use(body_parser.json());

const isUserLoggedIn = (req, res, next) =>{
    const {username} = req.body;
    sequelize.query('SELECT * from users WHERE username = :username AND isLogged = "true"',{
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
            username
        }
    }).then((response) =>{
        console.log(response);
    })
}

router.post("/order", isUserLoggedIn, (req, res) =>{
    
})

module.exports = router;