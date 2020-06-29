
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");

router.use(body_parser.json());

router.post("/create_item", (req, res) =>{
    
    const {name, photo_url, price, description, cooking_time} = req.body;
    
    sequelize.query('INSERT INTO items VALUES (NULL, :name, :photo_url, :price, :description, :cooking_time)', {
        replacements: {
            name: name,
            photo_url: photo_url,
            price: price,
            description: description,
            cooking_time: cooking_time
        }
    }).then(response => console.log(response)) 
});

module.exports = router;