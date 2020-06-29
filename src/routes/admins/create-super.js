
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");

router.use(body_parser.json());

let adminOn = false;

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
            res.status(201).json({msg: `Super admin ${fullName} created succesfully`});
        }).catch(err => res.json({err: err}))
    } else{
        res.status(404).json({msg: "Incomplete data!"})
    }
});

validateSuper = (req, res, next) =>{
    let ID = req.params.id;

    sequelize.query('SELECT * from super_admin WHERE super_id = :id',{
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
            id: ID
        }
    }).then((response) =>{
        if (response == "") {
            res.status(404).json({err: "Super admin not found. Please check its credentials"});
        } else{
            next();
        }
    })
}

router.post("/super_login/:id", validateSuper, (req, res) =>{
    adminOn = true;
    res.status(200).json({msg: "Login succesful!"})
})

module.exports = {router, adminOn};