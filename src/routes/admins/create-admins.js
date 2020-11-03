
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");
const validateWithJWT = require("../../validations/adminValidation");
const authUser = require("../../validations/authUser");

router.use(body_parser.json());

const isSuperAdminLogged = (req, res, next) =>{
    sequelize.query('SELECT super_id FROM super_admin WHERE isLogged = "true"',{
        type: Sequelize.QueryTypes.SELECT
    }).then((response) =>{
        if(response){
            const { super_id } = response[0];
            req.params.id = super_id;
            next();
        } else{
            res.status(400).json({
                case1: "No super admin found. Please contact your system administrator",
                case2: "Super admin is not yet logged in. Please make sure it is."
            });
        }
    }).catch(err => res.status(404).json({err}));
}

router.post("/admin", [isSuperAdminLogged, validateWithJWT], (req, res) =>{
    const { fullName, admin_address, phone, password, username, is_admin } = req.body;
    const super_id = req.params.id;
    const adminToken = req.params.token;
    if (req.body) { 
        sequelize.query(`
        INSERT into admin
        VALUES (NULL, :fullName, :admin_address, :phone, :super_id, :password, :username, :is_admin)`,
         {
            replacements: {
                fullName,
                admin_address,
                phone,
                super_id,
                username,
                password,
                is_admin
            }
        }).then((response) =>{
            if (response = "") {
                res.status(401).json({err: "There was an error creating this admin. Please try again."})
            } else{
                res.status(201).json({
                    msg: `Admin ${fullName} created`,
                    adminToken,
                    hint: "Move this token to a 'Bearer Authentication' field next time you log in'"
                });
            }
        }).catch(err => console.log(err))
    }
});

router.post("/admin/login", authUser, (req, res) =>{
    const okUsername = req.params.loggedUser;
    const { username, password } = req.body;

    if (username === okUsername) {
        sequelize.query('SELECT username FROM admin WHERE username = :username AND password = :password',{
            type: Sequelize.QueryTypes.SELECT,
            replacements: {
                username: okUsername,
                password
            }
        }).then((response) =>{
            if (response) {
                sequelize.query(
                `ALTER TABLE admin
                ADD isLogged VARCHAR(5) NULL 
                DEFAULT "true"`,{
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

router.get("/admin", authUser, (req, res) =>{
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