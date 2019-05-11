DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Yeezy 350 Boost V2 - Clay", "Shoes", 250.00, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Yeezy 350 Boost V2 - Static Reflective", "Shoes", 500.00, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Air Jordan 1 - Defiant Couture", "Shoes", 130.00, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Mortal Kombat 11", "Video Games", 59.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Overcooked! 2", "Video Games", 39.99, 40);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Supreme Hoodie Box Logo - Grey", "Clothes", 1250.00, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Supreme Hoodie Box Logo - Black", "Clothes", 905.00, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("ROKU Smart TV TLC 50 in", "Electronics", 349.99, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Samsung Smart TV 60 in", "Electronics", 649.99, 18);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Canon Camera EOS M50", "Electronics", 599.99, 10);


SELECT * FROM products;