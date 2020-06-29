
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");

router.use(body_parser.json());

router.post("/init_operations", (req, res) =>{
    const { super_id, fullName, address } = req.body;

    if (req.body) {
        sequelize.query('INSERT into super_admin VALUES (:super_id, :fullName, :address)',{
            replacements: {
                super_id: super_id,
                fullName: fullName,
                address: address
            }
        }).then((response) =>{
            console.log(response);
            res.status(201).json({msg: `User ${fullName} created succesfully`});
        }).catch(err => res.json({err: err}))
    } else{
        res.status(404).json({msg: "Incomplete data!"})
    }
})

module.exports = router;