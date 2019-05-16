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
          console.log("\n");
          console.table(res);
          console.log("\n");
          menuOptions();
        });
          break;
        case "View low inventory":
        connection.query("SELECT item_id,product_name,price,stock_quantity FROM products WHERE stock_quantity < 5", function(err, res) {
          if (err) throw err;
          console.log("\n");
          console.table(res);
          console.log("\n");
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
            for (i = 0; i < addInvRes.length; i++) {
              if (answer.productName === addInvRes[i].product_name) {
                beginningStock = addInvRes[i].stock_quantity;
              }
            }
            addStock = parseFloat(answer.addMore);
            newTotal = beginningStock + addStock;
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
              console.log("\nUpdated " + answer.productName + " inventory. New stock total: " + newTotal + "\n");
              menuOptions();
            });
          });
            break;
        case "Add new product":
          connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
            inquirer
              .prompt([
                {
                  name: "item",
                  type: "input",
                  message: "What product would you like to add to the database?: "
                },
                {
                  name: "department",
                  type: "input",
                  message: "What department is this item classified?: "
                },
                {
                  name: "price",
                  type: "input",
                  message: "What is the cost of the item?: ",
                  validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }
                },
                {
                  name: "stock",
                  type: "input",
                  message: "What quantity of items will you be adding to the stock?: ",
                  validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }
                }
              ])
              .then(function(answer) {
                connection.query(
                  "INSERT INTO products SET ?",
                  {
                    product_name: answer.item,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.stock
                  },
                  function(err) {
                    if (err) throw err;
                    console.log("\n\nUpdated your database with new product entries!\n\n");
                    menuOptions();
                  }
                )
              });
          });
          break;
      
        default:
          break;
      }
    });
}
