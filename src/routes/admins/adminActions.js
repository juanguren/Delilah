
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");

router.use(body_parser.json());

router.put("/order/:id/status", (req, res) =>{
    const order_id = req.params.id;
    // "PUT" query
})