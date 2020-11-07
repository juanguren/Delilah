
const jwt = require("jsonwebtoken");
const signature = "mySignature";

const authUser = (req, res, next) =>{
    try {
        const getToken = req.headers.authorization.split(' ')[1]; // * Split divides the "Bearer" from the actual token. [1] is the position in which the token´s found.
        const verifyToken = jwt.verify(getToken, signature);
        if (verifyToken) {
            req.params.loggedUser = verifyToken;
            next();
        } else{
            res.status(403).json({err: "Something failed in the authentication process. Please check the Bearer Token"});
        }
    } catch (error) {
        res.status(403).json({err: "Please check the Bearer Token"})
    }
}

module.exports = authUser;