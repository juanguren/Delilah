
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

    sequelize.query('SELECT * FROM admin WHERE isLogged = "true"',{
        type: Sequelize.QueryTypes.SELECT
    }).then((response) =>{
        if (response = "") {
            res.status(404).json({
                case1: "No admin found. Please contact your system administrator",
                case2: "Admin is not yet logged in. Please make sure it is."
            })
        } else{
            const {name, photo_url, price, item_description, cooking_time, quantity, item_code} = req.body;
            if (req.body) {
                sequelize.query('INSERT INTO items VALUES (NULL, :name, :photo_url, :price, :item_description, :cooking_time, :quantity, :item_code)', {
                    replacements: {
                        name,
                        photo_url,
                        price,
                        item_description,
                        cooking_time,
                        quantity,
                        item_code
                    }
                }).then((response) =>{
                    if (response = "") {
                        res.status(400).json({err: "There was an error loading this query. \n please try again or" + 
                    " contact your admin"});
                    } else{
                        res.status(200).json({msg: `Item ${name} uploaded succesfuly`})
                    }
                }).catch(err => res.json({err: err}));
            } else{
                res.status(400).json({err: "Check all the fields are complete."})
            }
                }
            }).catch(err => console.log(err))
});

module.exports = router;