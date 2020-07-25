
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const {sequelize, Sequelize} = require("../../../server");

router.get("/items", (req, res) =>{
    sequelize.query('SELECT * FROM items',{
        type: Sequelize.QueryTypes.SELECT
    }).then((items) =>{
        res.status(200).json(items);
    }).catch((err) =>{
        console.log(err);
    });
});

router.get("items/:itemCode", (req, res) =>{
    const itemID = req.params.itemCode;
    sequelize.query('SELECT * FROM items WHERE item_code = :itemCode',{
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
            item_code: itemID
        }
    }).then((items) =>{
        res.status(200).json(items);
    }).catch((err) =>{
        console.log(err);
    });
})

module.exports = router;