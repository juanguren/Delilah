
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");
const validateWithJWT = require("../validations/adminValidation");

router.use(body_parser.json());

let isSuperAdminLogged = (req, res, next) =>{
    sequelize.query('SELECT * FROM super_admin WHERE isLogged = "true"',{
        type: Sequelize.QueryTypes.SELECT
    }).then((response) =>{
        if(response){
            next();
        } else{
            res.status(400).json({
                case1: "No super admin found. Please contact your system administrator",
                case2: "Super admin is not yet logged in. Please make sure it is."
            });
        }
    }).catch(err => res.status(404).json({err}));
}

router.post("/create-admin", isSuperAdminLogged, (req, res) =>{
    const { fullName, admin_address, phone, isLogged, username, password } = req.body;
    if (req.body) {
        sequelize.query('INSERT into admin VALUES (NULL, :fullName, :admin_address, :phone, NULL, :isLogged, :username, :password)',{
            replacements: {
                fullName,
                admin_address,
                phone,
                username,
                password,
                isLogged
            }
        }).then((response) =>{
            if (response = "") {
                res.status(400).json({err: "There was an error creating this admin. Please try again."})
            } else{
                res.status(201).json({msg: `Admin ${fullName} created`});
            }
        }).catch(err => console.log(err))
    }
});

router.post("/admin/auth", validateWithJWT, (req, res) =>{
    const username = req.body;
    const adminToken = req.params.token;
    res.status(201).json({msg: `Admin *${username.username}* succesfully authenticated`,
        adminToken});
});

module.exports = router;