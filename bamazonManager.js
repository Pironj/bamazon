var mysql = require("mysql");
var inquirer = require("inquirer");
var dotenv = require("dotenv")
var table = require("console.table");
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
        connection.query("SELECT item_id,product_name,price,stock_quantity FROM products ORDER BY item_id ASC", function(err, res) {
          if (err) throw err;
          console.table(res);
          // console.table(res, ["item_id", "product_name", "price", "stock_quantity"]);
          menuOptions();
        });
          break;
        case "View low inventory":
        connection.query("SELECT item_id,product_name,price,stock_quantity FROM products WHERE stock_quantity < 5", function(err, res) {
          if (err) throw err;
          console.table(res);
          // console.table(res, ["item_id", "product_name", "price", "stock_quantity"]);
          menuOptions();
        });
          break;
        case "Add to inventory":
          inquirer
          .prompt([
            {
            type: "list",
            name: "productName",
            message: "Which product would you like to add more inventory to?: ",
            choices: [
              'Yeezy 350 Boost V2 - Clay',
              'Yeezy 350 Boost V2 - Static Reflective',
              'Air Jordan 1 - Defiant Couture',
              'Mortal Kombat 11',
              'Overcooked! 2',
              'Supreme Hoodie Box Logo - Grey',
              'Supreme Hoodie Box Logo - Black',
              'ROKU Smart TV TLC 50 in',
              'Samsung Smart TV 60 in',
              'Canon Camera EOS M50',
            ],
            },
            {
              type: "input",
              name: "addMore",
              message: "How many units are you adding?: "
            }
          ])
          .then(function(answer) {
            updateItem = answer.productName;
            console.log(updateItem);
            connection.query(
              "UPDATE products SET stock_quantity = answer.addMore WHERE product_name = updateItem", 
            function(err, res2) {
              if (err) throw err;
              console.table(res2, ["item_id", "product_name", "price", "stock_quantity"]);
              menuOptions();
            });
          });
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
