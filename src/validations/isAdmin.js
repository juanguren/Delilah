
const {sequelize, Sequelize} = require("../../server");

const isAdmin = (req, res, next) =>{
    const username = req.params.loggedUser;
    sequelize.query(`
    SELECT is_admin from admin 
    WHERE username = :username`, {
        type: Sequelize.QueryTypes.SELECT, 
        replacements: { 
            username
        }
    }).then((response) =>{
        const { is_admin } = response[0];
        !is_admin ? res.status(403).json({err: 'User is not admin'}) : next();
    }).catch((e) => res.status(403).json({err: "User is not an admin"}))
}

module.exports = isAdmin;