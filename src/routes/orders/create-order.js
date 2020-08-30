
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");
const authUser = require("../../validations/authUser");
const { orderTime, generateArrivalTime } = require("../../utils/methods");

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
        sequelize.query('INSERT INTO orders VALUES(NULL, :order_time, :arrival_time, :order_status, NULL, :user_id)',{
            replacements: {
                order_time: orderTime(),
                arrival_time: generateArrivalTime(),
                order_status: "PENDING",
                user_id
            }
        })
    })
}

router.post("/order", [authUser, isUserLoggedIn, makeOrder], (req, res) =>{
    console.log(true)
})

module.exports = router;