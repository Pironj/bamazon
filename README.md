# bamazon
An Amazon-like storefront with the use of MySQL and Inquirer npm packages to build and modify databases

# To Run:
Open your terminal and type the following in the command `node bamazonCustomer.js`:
  * You will then be prompted to input data by following the prompt
    ```
    Enter item ID of product
    Enter quantity of how many you would like to purchase
    ```
  * For the Manager view You will be given a list of choices to manipulate your data
    ```
    View products for sale
    View low inventory
    Add to inventory
    Add new product
    ```
# Video Demo
* Customer View
https://youtu.be/dHBkphfifO4

* Manager View
https://youtu.be/Osv6U5GFp2g

## Install app instruction:

  * Clone this repository to your local machine: 
    ```
    git clone https://github.com/Pironj/bamazon.git
    ```
  * Then, run `npm install` to get dependacies contained in the `package.json` file
  

  * Create your own `.env` file to store your api keys like follows:
    ```
    SQLroot = `root`
    SQLPASSWORD = `yourPW`
    ```
  * Link your`.env` file you just created to `bamazonCustomer.js` and `bamazonManager.js` files that will hold private connection information like follows:
    ```
    // Your username
    user: process.env.MYSQL_USER,

    // Your password
    password: process.env.MYSQL_PASSWORD,
    ```
  * Ensure `.env` is in your `.gitignore` file before you push up to github.
  
## Technologies:
  * Node.js
  * Javascript
  * inquirer
  * MySQL
  * console.table package

  