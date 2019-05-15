var mysql = require("mysql");
var inquirer = require("inquirer");
var dotenv = require("dotenv")
dotenv.config();

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: process.env.MYSQL_USER,

  // Your password
  password: process.env.MYSQL_PASSWORD,
  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  menuOptions();
});

function menuOptions () {
  inquirer
  .prompt([
      {
        type: "list",
        name: "menu",
        message: "What would you like to do?: ",
        choices: [
          "View products for sale",
          "View low inventory",
          "Add to inventory",
          "Add new product",
        ],
      }
    ])
    .then(function(answer) {
      switch (answer.menu) {
        case "View products for sale":
        console.log("view products");
          productView();
          break;
        case "View low inventory":
        console.log("low inv");
          lowInv();
          break;
        case "Add to inventory":
        console.log("add inv");
          addInv();
          break;
        case "Add new product":
        console.log("add new product");
          addProduct();
          break;
      
        default:
          break;
      }
    });
}
