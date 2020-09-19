
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");
const { orderTime } = require("../../utils/methods");

router.use(body_parser.json());

const updateOrderStatus = (req, res, next) =>{
    const order_status = req.params.status;
    order_status.toUpperCase();

    const acceptedStatus = [
        'PENDING',
        'IN PROGRESS',
        'CANCELLED'
    ]
    acceptedStatus.includes(order_status) ? next() : res.status(400).json({msg: 'Incorrect status entry. Please input a valid one'})
}

const isOrderCancelled = (req, res, next) =>{
    const id = req.params.id;
    const order_status = req.params.status;
    const { reason } = req.body;

    if(reason){
        if (order_status = 'CANCELLED') {
            sequelize.query('SELECT order_id FROM orders WHERE order_uuid = :order_id', {
                type: Sequelize.QueryTypes.SELECT,
                replacements: { order_id : id }
            }).then((response) =>{
                const { order_id } = response[0];
                sequelize.query('INSERT INTO canceled_order VALUES(:order_id, :reason, :time)',{
                    replacements: {
                        order_id,
                        reason,
                        time: orderTime()
                    }
                }).then(() => { next(); })
            }).catch((error) => res.status(400).json({msg: 'Couldn´t update order as cancelled', error}))
        } else{
            next();
        }
    } else { res.status(404).json({msg: 'No reson provided'}) }
}

router.put("/order/:id/:status", [updateOrderStatus, isOrderCancelled], (req, res) =>{
    const order_id = req.params.id;
    const newStatus = req.params.status;

    sequelize.query('UPDATE orders SET order_status = :newStatus WHERE order_uuid = :order_id', {
        replacements: { newStatus, order_id }
    }).then(() =>{
        res.status(200).json({msg: 'Order succesfully updated'})
    }).catch((e) => res.status(400).json(e));
});