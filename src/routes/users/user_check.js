
const express = require("express");
const router = express.Router();
const {sequelize} = require("../../../server");

function userbyID(req, res, next) {
    let ID = req.params.id;

    sequelize.query('SELECT * FROM users where user_id = :id',{
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
            id: ID
        }
    }).then((users) =>{
        req.params.found = users;
        if (users == " ") {
            res.status(404).json({err: "The requested user does not exist."});                        
        } else{
            next();
        }
    }).catch(err => res.status(400).json(err));
}

router.get("/users", (req, res) =>{
    sequelize.query('SELECT * FROM users',{
        type: sequelize.QueryTypes.SELECT
    }).then((users) =>{
        if (users) {
            res.status(200).json(users)
        } else{
            res.status(200).json({msg: "No users registered yet"});
        } 
    }).catch((err) =>{
        console.log(err);
    })
});

router.get("users/:id", userbyID, (req, res) =>{
    let foundUser = req.params.found;
    res.status(200).json(foundUser);
})

module.exports = router;