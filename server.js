
const express = require("express");
const Sequelize = require("sequelize");
const sequelize = new Sequelize('mysql://root@localhost:3306/delilah');
module.exports = {sequelize, Sequelize};
const router = express.Router();

const routes = "./src/routes/";

const app = express();

// Routes
app.use("/delilah", require(routes + "users/user_check"));
app.use("/delilah", require(routes + "users/user_signup"));
app.use("/delilah", require(routes + "users/user-login"));
app.use("/delilah", require(routes + "items/item_registry"));
app.use("/delilah", require(routes + "items/item-check"));
app.use("/delilah", require(routes + "orders/create-order"));
app.use("/delilah", require(routes + "orders/cancel-order"));
app.use("/delilah", require(routes + "orders/view-orders"));
app.use("/delilah", require(routes + "admins/create-super"));
app.use("/delilah", require(routes + "admins/create-admins"));
app.use("/delilah", require(routes + "admins/admin-actions"));

app.get("/delilah", (req, res) =>{
    res.json({msg: "Welcome to Delilah!",
    us: "We are a new and revolutionary service that gives you time. Therefore, freedom."});
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log("Listening...");
})