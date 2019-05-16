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
var updateItem;
var beginningStock;
var addStock = 0;
var addInvRes;
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
        connection.query("SELECT * FROM products", function(err, res) {
          if (err) throw err;
          addInvRes = res;
          inquirer
          .prompt([
            {
            type: "list",
            name: "productName",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].product_name);
              }
              return choiceArray;
            },
            message: "Which product would you like to add more inventory to?: ",
            },
            {
              type: "input",
              name: "addMore",
              message: "How many units are you adding?: "
            }
          ])
          .then(function(answer) {
            console.table(addInvRes);
            for (i = 0; i < addInvRes.length; i++) {
              if (answer.productName === addInvRes[i].product_name) {
                // console.log(addInvRes[i]);
                beginningStock = addInvRes[i].stock_quantity;
                console.log(beginningStock);
                console.log(addStock);
              }
            }
            addStock = parseFloat(answer.addMore);
            console.log(beginningStock + addStock);
            connection.query(
              "UPDATE products SET ? WHERE ?", 
              [
                {
                  stock_quantity: beginningStock + addStock
                },
                {
                  product_name: answer.productName
                }
              ]);
              // [ beginningStock + addStock ],
              // [ updateItem ],
              // console.log(stock_quantity)
              // console.log(updateItem);
              console.table(["item_id", "product_name", "price", "stock_quantity"]);
              menuOptions();
            });
          });
            break;
        case "Add new product":
          console.log("add new product");
          connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
            inquirer
              .prompt([
                {
                  name: ""
                }
              ])
          });
          break;
      
        default:
          break;
      }
    });
}
