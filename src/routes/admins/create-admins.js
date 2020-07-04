
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");

router.use(body_parser.json());

isSuperLogged = (req, res, next) =>{
    /*if () {
        next();
    } else{
        res.status(400).json({msg: "Super admin is not logged yet"})
    }*/
}

router.post("/create-admin", )

module.exports = router;