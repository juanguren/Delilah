
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");

router.use(body_parser.json());

function assignToRestaurant(req, res, next){ // Make this an independant endpoint
    sequelize.query('SELECT restaurants_id from restaurants WHERE state = "on"',{
        type: Sequelize.QueryTypes.SELECT
    })
        .then((response) =>{
            req.params.restaurant_FK = response[0];
            console.log(response[0].restaurants_id);
            
    });
}

router.post("/create_item", assignToRestaurant, (req, res) =>{ // TODO - ¿How to add restaurant id? (FK) --> La FK es literalmente el nombre de la FK de restaurantes
    let FK = req.params.restaurant_FK;
    console.log(FK);
    
    const {name, photo_url, price, description, cooking_time} = req.body;
    
    sequelize.query('INSERT INTO items VALUES (NULL, :name, :photo_url, :price, :description, :cooking_time, :restaurants_id)', {
        replacements: {
            name: name,
            photo_url: photo_url,
            price: price,
            description: description,
            cooking_time: cooking_time,
            restaurants_id: FK
        }
    }).then(response => console.log(response)) 
});

module.exports = router;