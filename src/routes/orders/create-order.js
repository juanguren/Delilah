
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");
const authUser = require("../validations/authUser");

router.use(body_parser.json());

const isUserLoggedIn = (req, res, next) =>{
    const username = req.params.loggedUser;
    sequelize.query('SELECT username from users WHERE username = :username AND isLogged = "true"',{
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
            username
        }
    }).then((response) =>{
        if (response[0].username === username) {
            next();
        } else{
            res.status(400).json({err: "Incorrect user credentials"});
        }
    }).catch(err => res.status(400).json(err))
}

const makeOrder = (req, res, next) =>{
    const user = req.params.loggedUser;
    sequelize.query('SELECT user_id FROM users WHERE username = :user',{
        type: Sequelize.QueryTypes.SELECT,
        replacements:{
            user
        }
    }).then((res) =>{
        const {user_id} = res[0]; // ! Create a utils folder for this dummy data
        sequelize.query('INSERT INTO orders(order_time, arrival_time, order_status, canceled_order_id. user_id) VALUES(?, ?, ?, ?, ?)',{
            replacements: [

            ]
        })
    })
}

router.post("/order", [authUser, isUserLoggedIn], (req, res) =>{
    
})

module.exports = router;