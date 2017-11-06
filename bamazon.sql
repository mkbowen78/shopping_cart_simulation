CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT,
	product_name VARCHAR(50) NOT NULL,
	dept_name VARCHAR(25) NOT NULL,
	price DECIMAL(8, 2),
	stock_qty INT(5),
	PRIMARY KEY (item_id)
);

CREATE TABLE departments (
	dept_id INTEGER(10) AUTO_INCREMENT NOT NULL primary key,
    dept_name VARCHAR(25) NOT NULL,
    overhead_costs DECIMAL(8,2) NOT NULL,
    total_sales DECIMAL(8,2) NOT NULL
); 