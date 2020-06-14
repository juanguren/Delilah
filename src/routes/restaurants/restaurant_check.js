
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const {sequelize} = require("../../../server");

router.get("/restaurants", (req, res) =>{
    sequelize.query('SELECT * FROM restaurants',{
        type: sequelize.QueryTypes.SELECT
    }).then((restaurants) =>{
        res.status(200).json(restaurants);
    }).catch((err) =>{
        console.log(err);
    });
});

module.exports = router;