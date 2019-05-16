var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");
var dotenv = require("dotenv");
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
  displayData();
});
// function that displays products from our database using only the item_id, product_name & price columns.
function displayData() {
  var query = "SELECT * FROM products";
  var products;
  // var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products";
  connection.query(query, function(err, res) {
    tableLength = res.length;
    console.log(
      "\n\n   |----------------------------------------------------------|\n" +
      "   |                                                          |\n" +
      "   |                  WELCOME TO OUR STORE                    |\n" +
      "   |             PLEASE TAKE A LOOK AT OUR WARES              |\n" +
      "   |                                                          |\n" +
      "   |----------------------------------------------------------|\n\n"
    );
    console.table(res);
    buyProduct();
  });
}

// Variables to store user purchase requests
// selected item id
var tableLength = 0;
var itemPurchase;
var itemID;
// selected item name
var itemName;
// num user entered to buy
var numPurchase;
// selected item price
var itemPrice;
// selected item beginning stock
var itemBeginningStock;
// updated stock after purchase
var newStock = itemBeginningStock - numPurchase;
var queryG;
function buyProduct() {
  inquirer
  .prompt([
      {
        name: "item",
        type: "input",
        message: "Type the ID of the product you would like to buy?: "
      },
      {
        name: "quantity",
        type: "input",
        message: "How many units of the product would you like to purchase?: "
      }
    ])
    .then(function(answer) {
      itemPurchase = answer.item;
      numPurchase = answer.quantity;
      queryG = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE item_id = ?";
      connection.query(queryG, [ answer.item ], function(err, res) {
        if (err) throw err;
        if (itemPurchase > tableLength) {
          console.log("\nItem does not exist in our Database.\n");
          buyProduct();
          return;
        }
        if (!itemPurchase.match(/^[0-9]+$/)) {
          console.log("\nPlease enter a valid item id #\n");
          buyProduct();
          return;
        }
        if (!numPurchase.match(/^[0-9]+$/)) {
          console.log("\nPlease enter a number for quantity\n");
          buyProduct();
          return;
        }
        for (i = 0; i < res.length; i++) {
          itemID = res[i].item_id;
          itemPrice = res[i].price;
          itemName = res[i].product_name;
          itemBeginningStock = res[i].stock_quantity;
          if(answer.quantity > res[i].stock_quantity) {
            console.log("\nInsufficient quantity! We have only " + res[i].stock_quantity + " available.\n");
            buyProduct();
          } 
          else {
            console.log(
              "\n\nYou selected item id #" +
              res[i].item_id + 
              "\n" +
              "Product Name: " + 
              res[i].product_name +
              "\n" +
              "Number you wish to purchase: " +
              answer.quantity +
              "\n" +
              "Total price of order: $" +
              numPurchase * itemPrice +
              "\n" +
              "Stock number available: " +
              res[i].stock_quantity +
              "\n\n"
              );
            }
          }
          connection.query(queryG, [ itemPurchase ], function(err, res) {
            if (err) throw err;
            inquirer
            .prompt([
              {
                name: "validatePurchase",
                type: "confirm",
                message: "Are you sure you wish to purchase: " + numPurchase + " " + itemName + " for $" + itemPrice * numPurchase
              }
            ])
            .then(function(answer) {
              if (err) throw err;
              if (answer.validatePurchase === false) {
                console.log("\nOk take a look at our other items for sale\n");
                displayData();
                return;
              }
              else {
                connection.query(
                  "UPDATE products SET ? WHERE ?",
                  [
                    {
                      stock_quantity: itemBeginningStock - numPurchase
                    },
                    {
                      item_id: itemID
                    }
                  ]);
                console.log("\nYou're purchase is confirmed." + "\n" + "Thank You!\n");
              }
              displayData();
            })
          });
            
        });
    });
}


