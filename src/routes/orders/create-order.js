
const express = require("express");
const body_parser = require("body-parser");
const uuid = require("uuid");
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
        const {user_id} = res[0];
        const order_uuid = uuid.v4();
        if (user_id) {
            sequelize.query('INSERT INTO orders VALUES(NULL, :order_time, :arrival_time, :order_status, NULL, :user_id, :order_uuid)',{
                replacements: {
                    order_time: orderTime(),
                    arrival_time: generateArrivalTime(),
                    order_status: "PENDING",
                    user_id,
                    order_uuid
                }
            }).then((res) =>{
                req.params.orderId = order_uuid;
                next();
            })
        }
    }).catch(err => res.status(400).json(err));
}

router.post("/order", [authUser, isUserLoggedIn, makeOrder], (req, res) =>{
    const orderCode = req.params.orderId;
    res.status(200).json({msg: `Order succesful.`, ID: `${orderCode}`});
})

module.exports = router;