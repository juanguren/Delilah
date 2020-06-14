
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const {sequelize} = require("../../../server");

router.use(body_parser.json());

/* ====== SECTION - MIDDLEWARES: ======= */

// "/restaurant_signup" | Validate restaurant name
function validateRestaurantName(req, res, next){
    const name = req.body.name;
    
    sequelize.query('SELECT * FROM restaurants WHERE name = :name', {
        type: sequelize.QueryTypes.SELECT,
        replacements:{name: name}
    }).then((response) =>{
        if (response == "") {
            next();
        } else{
            res.status(404).json({err: `Restaurant '${name}' already exists`});            
        }
    }).catch(err => console.log(err))
}

router.post("/restaurant_signup", validateRestaurantName, (req, res) =>{
    const { name, description, address, category, state } = req.body;
    console.log(name);
    sequelize.query('INSERT INTO restaurants VALUES(NULL, :name, :description, :address, :category, :state)', {
        replacements: {
            name: name,
            description: description,
            address: address,
            category: category,
            state: state
        }
    }).then((response) =>{
        console.log(response);
        res.status(201).json({msg: `Restaurant ${name} created succesfully`})
    }).catch(err => console.log(err));
});

module.exports = router;

