
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");

router.use(body_parser.json());

function orderbyID(req, res, next) {
    let ID = req.params.id;

    sequelize.query('SELECT * FROM orders where order_id = :id',{
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
            id: ID
        }
    }).then((orders) =>{
        req.params.found = orders;
        if (orders == "") {
            res.status(404).json({err: "The requested order does not exist."});                        
        } else{
            next();
        }
    }).catch(err => res.status(400).json(err));
}

router.get("/orders", (req, res) =>{
    sequelize.query('SELECT * FROM orders',{
        type: Sequelize.QueryTypes.SELECT
    }).then((orders) =>{
        res.status(200).json({orders});
    }).catch(err => res.status(400).json(err));
});

router.get("/orders/:id", orderbyID, (req, res) =>{
    let foundOrder = req.params.found;
    console.log(foundOrder);
    res.status(200).json(foundOrder);
});

module.exports = router;