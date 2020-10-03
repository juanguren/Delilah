
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");
const authUser = require("../../validations/authUser");

router.use(body_parser.json());

const isAdminLoggedIn = (req, res, next) =>{
    const username = req.params.loggedUser;
    sequelize.query('SELECT username from admin WHERE username = :username AND isLogged = "true"',{
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
    }).catch(err => res.status(400).json({msg: "No admin authenticated"}));
}

router.get("/orders", [authUser, isAdminLoggedIn], (req, res) =>{
    sequelize.query('SELECT * FROM orders',{
        type: Sequelize.QueryTypes.SELECT
    }).then((orders) =>{
        res.status(200).json({orders});
    }).catch(err => res.status(400).json(err));
});

function orderbyID (req, res, next) {
    let ID = req.params.id;

    sequelize.query(`SELECT order_id FROM orders where order_uuid = :id`,{
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
            id: ID
        }
    }).then((orders) =>{
        const { order_id } = orders[0];
        sequelize.query(
        `SELECT items.name as Items, items.price, items.photo_url, o.*
        FROM items
        INNER JOIN order_items ON items.item_id = order_items.item_id
        INNER JOIN orders o ON o.order_id = order_items.order_id
        WHERE o.order_id = :order_id`, 
        {
            type: Sequelize.QueryTypes.SELECT,
            replacements: { order_id }
        }).then((order) =>{
            req.params.found = order;
            next();
        })
        .catch(() => res.status(400).json({err: 'Order not found'}))
    }).catch(() => res.status(400).json({err: 'Order not found'}));
}

router.get("/order/:id", [authUser, isAdminLoggedIn, orderbyID], (req, res) =>{
    let foundOrder = req.params.found;
    res.status(200).json(foundOrder);
});

module.exports = router;