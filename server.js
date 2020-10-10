
const express = require("express");
const Sequelize = require("sequelize");
const sequelize = new Sequelize('mysql://root@localhost:3306/delilah');
module.exports = {sequelize, Sequelize};

const routes = "./src/routes/";

const app = express();

// Routes
app.use("/delilah", require(routes + "admins/create-admins"));
app.use("/delilah", require(routes + "admins/create-super"));
app.use("/delilah", require(routes + "items/item_requests"));
app.use("/delilah", require(routes + "orders/order_requests"));
app.use("/delilah", require(routes + "users/user_requests"));

app.get("/delilah", (req, res) =>{
    res.status(200).json({msg: "Welcome to Delilah!",
    us: "We are a new and revolutionary service that gives you time. Therefore, freedom."});
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log("Listening...");
})