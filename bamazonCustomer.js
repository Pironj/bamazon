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
  displayData();
});
// function that displays products from our database using only the item_id, product_name & price columns.
function displayData() {
  var query = "SELECT * FROM products";
  var products;
  // var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      products = console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: $" + res[i].price);
    }
    return products;
  })
  setTimeout(() => {
    buyProduct();
    
  }, 800);
}
// console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Department Name: " + res[i].department_name + " || Price: $" + res[i].price + " || Stock Quantity: " + res[i].stock_quantity);
// The app should then prompt users with two messages.

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
// Variables to store user purchase requests
// selected item id
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
        message: "Type the ID of the product they would like to buy?: "
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
        for (i = 0; i < res.length; i++) {
          itemID = res[i].item_id;
          itemPrice = res[i].price;
          itemName = res[i].product_name;
          itemBeginningStock = res[i].stock_quantity;
          if(answer.quantity > res[i].stock_quantity) {
            console.log("Insufficient quantity! We have only " + res[i].stock_quantity + " available.");
            buyProduct();
          } 
          else {
            console.log(
              "You selected item id #" +
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
              res[i].stock_quantity
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
                console.log("Ok take a look at our other items for sale");
                displayData();
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
                console.log("You're purchase is confirmed." + "\n" + "Thank You!");
              }
              displayData();
            })
          });
            
        });
    });
}


