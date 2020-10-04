
const { sequelize, Sequelize } = require("../../server");
const jwt = require("jsonwebtoken");
const signature = "mySignature";

let validateWithJWT = (req, res, next) =>{
    const { username, password } = req.body;
    if (req.body) {
        sequelize.query('SELECT * FROM `admin` WHERE username = :username AND password = :password',{
            type: Sequelize.QueryTypes.SELECT,
            replacements:{
                username,
                password
            }
        }).then((response) =>{
            if (response) {
                req.params.token = jwt.sign(username, signature);
                next();
            } else{
                res.json({err: "Invalid credentials"});
            }
        }).catch(err => console.log(err))
    }
}

module.exports = validateWithJWT;