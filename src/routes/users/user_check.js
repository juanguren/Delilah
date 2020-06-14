
const express = require("express");
const router = express.Router();
const {sequelize} = require("../../../server");


router.get("/users", (req, res) =>{
    sequelize.query('SELECT * FROM users',{
        type: sequelize.QueryTypes.SELECT
    }).then((users) =>{
        res.status(200).json(users);
    }).catch((err) =>{
        console.log(err);
    })
});

module.exports = router;