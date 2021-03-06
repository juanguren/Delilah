
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");
const authUser = require("../../validations/authUser");
const isAdmin = require("../../validations/isAdmin");

router.use(body_parser.json());

const checkUniqueItem = (req, res, next) => {
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

const checkItemExists = (req, res, next) => {
    const {item_code} = req.body;
    sequelize.query('SELECT * FROM items WHERE item_code = :code ',{
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
            code: item_code
        }
    }).then((response) =>{
        if (response == "") {
            res.status(404).json({err: "Ups. The requested item does not exist. Please check again."});
        } else{
            next();
        }
    });
}

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
});

router.post("/items", [
    checkUniqueItem,
    authUser,
    isAdmin
], (req, res) =>{

    sequelize.query('SELECT * FROM admin WHERE isLogged = "true"',{
        type: Sequelize.QueryTypes.SELECT
    }).then((response) =>{
        if (response = "") {
            res.status(404).json({
                case1: "No admin found. Please contact your system administrator",
                case2: "Admin is not yet logged in. Please make sure it is."
            })
        } else{
            const {name, photo_url, price, item_description, cooking_time, quantity, item_code}
             = req.body;
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
                        res.status(500).json({err: "There was an error loading this query. \n please try again or contact your admin"});
                    } else{
                        res.status(201).json({msg: `Item ${name} uploaded succesfuly`})
                    }
                }).catch(err => res.json({err: err}));
            } else{
                res.status(422).json({err: "Check all the fields are complete."})
            }
        }
    }).catch(err => console.log(err))
});

router.put("/items", [
    checkItemExists,
    authUser,
    isAdmin
], (req, res) =>{
    const {
        name,
        photo_url,
        price,
        item_description,
        cooking_time,
        quantity,
        item_code
    } = req.body;
    
    sequelize.query('UPDATE items set name = :name, photo_url = :photo_url, price = :price, item_description = :item_description, cooking_time = :cooking_time, quantity = :quantity, item_code = :item_code WHERE item_code = :item_code',{
        replacements: {
            name,
            photo_url,
            price, 
            item_description,
            cooking_time,
            quantity,
            item_code
        }
    }).then(() =>{
        res.status(201).json({msg: `Item ${name} succesfully updated`})
    }).catch(err => console.log(err));
});

router.delete("/items/delete/:itemCode", [
    authUser,
    isAdmin
], (req, res) => {
    try {
        const { itemCode: item_code } = req.params;
        sequelize.query(`
        SELECT item_id, name FROM items
        WHERE item_code = :item_code
        `, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { item_code }
    }).then((item) => {
        if (item == "") {
            return res.status(404).json({err: "Item doesn't exist"});
        }
        const { item_id, name } = item[0];
        sequelize.query(`
        DELETE FROM items
        WHERE item_id = :item_id 
        `, { replacements: { item_id } })
        .then((r) => {
            r != "" ? res.status(202).json({msg: `Item ${name} successfuly deleted`})
            : res.status(500).json({err: "Server error"});
        });
    });
    } catch (error) {
        res.status(400).json({error})
    }
});

module.exports = router;