
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");

router.use(body_parser.json());

router.get("/orders", (req, res) =>{
    sequelize.query('SELECT * FROM orders',{
        type: Sequelize.QueryTypes.SELECT
    }).then((orders) =>{
        res.status(200).json({orders})
    }).catch(err => res.status(400).json(err))
});

module.exports = router;