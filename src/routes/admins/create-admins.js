
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");
const validateWithJWT = require("../../validations/adminValidation");
const authUser = require("../../validations/authUser");

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

router.post("/admin-login", authUser, (req, res) =>{
    const okUsername = req.params.loggedUser;
    const {username, password} = req.body;

    if (username === okUsername) {
        sequelize.query('SELECT username FROM admin WHERE username = :username AND password = :password',{
            type: Sequelize.QueryTypes.SELECT,
            replacements: {
                username: okUsername,
                password
            }
        }).then((response) =>{
            if (response) {
                sequelize.query('UPDATE admin SET isLogged = "true" WHERE username = :username',{
                    replacements: {
                        username: okUsername
                    }
                }).then((response));
                res.status(200).json({msg: `Admin *${okUsername}* succesfully logged in`});
            } else{
                res.status(404).json({err: "Not found"});
            }
        })
    } else{ res.status(404).json({err: "username or password is incorrect. Please check them and try again."}); }
});

router.post("/admin/:username/logout", (req, res) =>{
    const username = req.params.username;
    sequelize.query('SELECT * from admin WHERE username = :username', {
        type: Sequelize.QueryTypes.SELECT,
        replacements : {
            username
        }
    }).then((response) =>{
        if (response) {
            sequelize.query('UPDATE admin SET isLogged = "false" WHERE username = :username',{
                replacements: {
                    username
                }
            }).then(response1 => res.status(200).json({msg: `Admin ${username} succesfuly logged out`}));
        } else{
            res.status(404).json({err: "Logged out unsuccesful. Please try again"});
        }
    }).catch(err => res.status(404).json(err));
});

router.get("/admin", (req, res) =>{
    sequelize.query('SELECT * FROM admin',{
        type: Sequelize.QueryTypes.SELECT
    }).then((response) =>{
        if (response == "") {
            res.status(200).json({msg: "Empty field. There´s no super admin yet"}); 
        } else{
            res.status(200).json(response);
        }
    }).catch(err => console.log(err));
});

module.exports = router;