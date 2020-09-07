
const express = require("express");
const Sequelize = require("sequelize");
const sequelize = new Sequelize('mysql://root@localhost:3306/delilah');
module.exports = {sequelize, Sequelize};

const app = express();

// Routes
app.use("/delilah", require("./src/routes/users/user_check"));
app.use("/delilah", require("./src/routes/users/user_signup"));
app.use("/delilah", require("./src/routes/users/user-login"));
app.use("/delilah", require("./src/routes/items/item_registry"));
app.use("/delilah", require("./src/routes/items/item-check"));
app.use("/delilah", require("./src/routes/orders/create-order"));
app.use("/delilah", require("./src/routes/orders/cancel-order"));
app.use("/delilah", require("./src/routes/orders/view-orders"));
app.use("/delilah", require("./src/routes/admins/create-super"));
app.use("/delilah", require("./src/routes/admins/create-admins"));
app.use("/delilah", require("./src/routes/admins/adminActions"));

app.get("/delilah", (req, res) =>{
    res.json({msg: "Welcome to Delilah!",
    us: "We are a new and revolutionary service that gives you time. Therefore, freedom."});
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log("Listening...");
})