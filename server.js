
const express = require("express");
const Sequelize = require("sequelize");
const sequelize = new Sequelize('mysql://root@localhost:3306/delilah');
module.exports = {sequelize};

const app = express();

// Routes
app.use("/", require("./src/routes/users/user_check"));
app.use("/", require("./src/routes/users/user_signup"));
app.use("/", require("./src/routes/items/item_registry"));
app.use("/", require("./src/routes/restaurants/restaurant_signup"));
app.use("/", require("./src/routes/restaurants/restaurant_check"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log("Listening...");
})