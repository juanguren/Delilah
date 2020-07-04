
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");

router.use(body_parser.json());

function checkUniqueItem (req, res, next){
    const {item_code} = req.body;
    console.log(item_code);
    sequelize.query('SELECT * FROM items WHERE item_code = :code ',{
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
            code: item_code
        }
    }).then((response) =>{
        if (response == "") {
            next();
        } else{
            res.status(404).json({err: "Ups. The uploaded item is repeated"});
        }
    });
}

router.post("/create_item", checkUniqueItem, (req, res) =>{
    
    const {name, photo_url, price, item_description, cooking_time, quantity, item_code} = req.body;
    
    sequelize.query('INSERT INTO items VALUES (NULL, :name, :photo_url, :price, :item_description, :cooking_time, :quantity, :item_code)', {
        replacements: {
            name: name,
            photo_url: photo_url,
            price: price,
            item_description: item_description,
            cooking_time: cooking_time,
            quantity: quantity,
            item_code: item_code
        }
    }).then((response) =>{
        if (response = "") {
            res.status(400).json({err: "There was an error loading this query. \n please try again or" + 
        " contact your admin"});
        } else{
            res.status(200).json({msg: `Item ${name} uploaded succesfuly`})
        }
    }).catch(err => res.json({err: err}));
});

module.exports = router;