
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");
const authUser = require("../../validations/authUser");
const isAdmin = require("../../validations/isAdmin");
const {
    isUserLoggedIn,
    checkStock,
    makeOrder,
    showResponse,
    isAdminLoggedIn,
    orderbyID,
    cancelOrder,
    updateOrderStatus
} 
= require("./middlewares");

router.use(body_parser.json());

router.get("/orders", [
    authUser,
    isAdmin,
    isAdminLoggedIn
], (req, res) =>{
    sequelize.query('SELECT * FROM orders',{
        type: Sequelize.QueryTypes.SELECT
    }).then((orders) =>{
        res.status(200).json({orders});
    }).catch(err => res.status(400).json(err));
});

router.get("/order/:id", [
    authUser,
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
    showResponse
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

router.put("/order/:id/:status", [
    updateOrderStatus,
    authUser,
    isAdmin
], (req, res) =>{
    const order_id = req.params.id;
    let newStatus = req.params.status;
    newStatus.toUpperCase();
    if(newStatus === 'CANCEL'){
        newStatus = "CANCELLED"
    }
    sequelize.query('UPDATE orders SET order_status = :newStatus WHERE order_uuid = :order_id', {
        replacements: { newStatus, order_id }
    }).then(() =>{
        if (newStatus === "CANCELLED") {
            return res.status(200).json({msg: 'Order succesfully cancelled'});
        } 
        return res.status(200).json({msg: 'Order succesfully updated'});
    }).catch((e) => res.status(500).json(e));
});

module.exports = router;