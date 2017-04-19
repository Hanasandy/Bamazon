-- CREATE DATABASE bamazon_DB;

CREATE TABLE products (
 
	itemId INTEGER(11) AUTO_INCREMENT NOT NULL,
	productName VARCHAR(100) NOT NULL,
	departmentName VARCHAR(100) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stockQuantity INTEGER UNSIGNED NOT NULL,
	PRIMARY KEY(itemID)  
);

 INSERT INTO products (productname, departmentName, price, stockQuantity)
 
 VALUES
 ("KitchenAid Stand Mixer", "Kitchen Appliances", 350.00, 1500),
 ("Vitamix Blender", "Kitchen Appliances", 550.00, 100),
 ("Tribest Slowstar Juicer", "Kitchen Appliances", 450.00, 500),
 ("All-Clad Stainless-SteelFry Pan", "Cookware", 130.00, 3000),
 ("Le Creuset Signature Cast-Iron Round Dutch Oven", "Cookware", 150.00, 2000),
 ("Chef'n Lemon Juicer", "Cooks' Tools", 39.95, 15000),
 ("Batter Ladles Set of 2", "Cooks' Tools", 24.95, 170000),
 ("Riedel Pinot Noir Wine Tumbler, Set of 2", "Glassware & Bar", 15.95, 7000),
 ("American Regional BBQ Sauce, Texas Style", "Food", 3.50, 200000),
 ("AERIN Dinnerware Collection", "Dinnerware", 59.95, 8000);
 
 
 -- USE bamazon_DB;
 
 