
const {sequelize, Sequelize} = require("../../../server");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const signature = "mySignature";

const userbyID = (req, res, next) => {
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

const validateUsernameExists = (req, res, next) => {
    const username = req.body.username;
    
    sequelize.query('SELECT * FROM users WHERE username = :username', {
        type: Sequelize.QueryTypes.SELECT,
        replacements:{username}
    }).then((response) =>{
        if (response == "") {
            next();
        } else{
            res.status(404).json({err: "User already exists"});            
        }
    }).catch(err => console.log(err))
}

const createUser = (req, res, next) => {
    const { fullName, email, phone, user_address, user_password, username, is_admin } = req.body;
    sequelize.query(`
    INSERT INTO users VALUES
    (NULL, :fullName, :email, :phone, :user_address, :user_password, :username, :is_admin, NULL, NULL)`, {
        replacements: {
            fullName,
            email,
            phone,
            user_address,
            user_password,
            username,
            is_admin
        }
    }).then((response) =>{
        next();
    }).catch(err => res.json(err));
}

const validateWithJWT = (req, res, next) =>{
    const {username} = req.body;
    req.params.token = jwt.sign(username, signature);
    next();
}

const validateHash = (req, res, next) =>{
    const { username, user_password } = req.body;

    sequelize.query('SELECT hash from users WHERE username = :username AND user_password = :user_password', {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            username,
            user_password
        }
    }).then((foundHash) =>{
        const { hash } = foundHash[0];
        bcrypt.compare(user_password, hash, (err, result) =>{
            if (result) {
                next();
            } else{
                res.json(400).json(
                    {err: "Operation unsuccesful. Please check user credentials", err});
            }
        });
    });
}

module.exports = {
    userbyID,
    validateUsernameExists,
    createUser,
    validateWithJWT,
    validateHash
}