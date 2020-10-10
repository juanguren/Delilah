
const express = require("express");
const body_parser = require("body-parser");
const uuid = require("uuid");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");
const authUser = require("../../validations/authUser");
const {
    isUserLoggedIn,
    checkStock,
    makeOrder,
    sendOrderItems,
    isAdminLoggedIn,
    orderbyID,
    cancelOrder,
    updateOrderStatus
} 
= require("./middlewares");

router.use(body_parser.json());

router.get("/orders", [authUser, isAdminLoggedIn], (req, res) =>{
    sequelize.query('SELECT * FROM orders',{
        type: Sequelize.QueryTypes.SELECT
    }).then((orders) =>{
        res.status(200).json({orders});
    }).catch(err => res.status(400).json(err));
});

router.get("/order/:id", [
    authUser,
    isAdminLoggedIn,
    orderbyID
],
    (req, res) =>{
    let foundOrder = req.params.found;
    res.status(200).json(foundOrder);
});

router.post("/order/create", [
    authUser,
    isUserLoggedIn,
    checkStock,
    makeOrder,
    sendOrderItems
], 
(req, res) =>{
    const orderCode = req.params.orderId;
    res.status(200).json(
        {
            msg: `Order succesfully created`,
            ID: `${orderCode}`
        }
    );
});

router.put("order/:id/cancel", cancelOrder, (req, res) =>{
    const order_id = req.params.id;
    const newStatus = 'CANCELLED';

    sequelize.query('UPDATE orders SET order_status = :newStatus WHERE order_uuid = :order_id', {
        replacements: { newStatus, order_id }
    }).then(() =>{
        res.status(200).json({msg: 'Order succesfully cancelled'})
    }).catch((e) => res.status(400).json(e));
});

router.put("/order/:id/:status", updateOrderStatus, (req, res) =>{
    const order_id = req.params.id;
    const newStatus = req.params.status;

    sequelize.query('UPDATE orders SET order_status = :newStatus WHERE order_uuid = :order_id', {
        replacements: { newStatus, order_id }
    }).then(() =>{
        res.status(200).json({msg: 'Order succesfully updated'})
    }).catch((e) => res.status(400).json(e));
});

module.exports = router;