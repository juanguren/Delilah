
const express = require("express");
const body_parser = require("body-parser");
const router = express.Router();
const { sequelize, Sequelize } = require("../../../server");
const adminOn = require("./create-super");

router.use(body_parser.json());
console.log(adminOn);

module.exports = router;