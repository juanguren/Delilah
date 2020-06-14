
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize } = require("../../../server");

router.use(body_parser.json());

router.post("/create_item", (req, res) =>{ // TODO - ¿How to add restaurant id? (FK)
    sequelize.query('INSERT INTO items VALUES (NULL, :name, :photo_url, :price, :description, :cooking_time)')
})

module.exports = router;