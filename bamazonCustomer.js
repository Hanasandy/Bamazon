// dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");


// connect to SQL database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_DB"
});


// check the connection
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id" + connection.threadId);

  welcom();
});


// display all the product in the list
function welcom() {
	inquirer.prompt([
		  {
		  	type: "confirm",
		  	name: "confirm",
		  	message:"Welcome to HEIDI SONOMA. Would you like to see our product list?"
		  	//default: true
		  }
	 ]).then(function(answer) {
		 	if (answer.confirm === true) {
		        productList();
		 	}else {
		 		console.log("Sorry to see you go!");
		 	}
	 	});

}//end of welcom function


// creating product table
function productList() {
    // instantiate
	var table = new Table({
	    head: ["ID#", "Item", "Department", "Price", "Stock"], 
	    colWidths: [5, 30, 30, 10, 10]
	});
 
    listProduct();


    // table is an Array, so you can `push`, `unshift`, `splice` and friends
	function listProduct() {
	    connection.query("SELECT * FROM products WHERE stockQuantity > 0", function(err,res){
			// if (err) throw err;
			for (var i = 0; i < res.length; i++) {

					var itemId = res[i].itemId,
		    			productName = res[i].productName,
		    			departmentName = res[i].departmentName,
		    			price = (res[i].price).toFixed(2),
		    			stockQuantity = res[i].stockQuantity;
	            	            
		    	table.push(
				    [itemId, productName, departmentName, "$" + price, stockQuantity]
				);
			}
	        console.log(table.toString());
            orderQuestion();
	    });
	}
} //end of productList function


// ask user what product and wuantity for purchase
var orderQuestion = function () {

	inquirer.prompt([
	    {
            type: "input",
            name: "inputId",
            message: "What is the product ID you would like to purchase?"
        },
        {
            type: "input",
            name: "inputQuantity",
            message: "How many many would you like to purchase?"
        }
    ]).then (function(userPurchase){
    	connection.query("SELECT * FROM products where itemId=?", userPurchase.inputId, function(err, res){
            if (err) throw err;
			for (var i = 0; i < res.length; i++) {

				if (userPurchase.inputQuantity > res[i].stockQuantity) {
					console.log("Insufficient quantity! Please try again.");
				    welcom();
				} else {
					console.log("We have product ready!");
					console.log("Product Name: " + res[i].productName);
					console.log("Product Price: " + "$" + (res[i].price).toFixed(2));
					console.log("Quantity: " + userPurchase.inputQuantity);
					console.log("----------------------------------------------------");
					console.log("ORDER TOTAL: " + "$" + ((res[i].price * userPurchase.inputQuantity).toFixed(2)));

                       
                        var newStock = (res[i].stockQuantity - userPurchase.inputQuantity);
                        var productID = (userPurchase.inputId);
                    
                    proceedCheckout(productID, newStock);

				}
			}
    	});
    }); //end of userPurchase function
} //end of purchaseQuestion function 


// proceed to check out and update product quantity
function proceedCheckout(productID, newStock) {
 inquirer.prompt([
	 {
    	 type: "confirm",
		 name: "placeOrder",
		 message: "Would you like to place your order?"

	 }
  ]).then(function(userOrder) {
      if (userOrder.placeOrder === true) {

      	connection.query("UPDATE products SET ? WHERE ?", [{
	               stockQuantity: newStock
	         }, {
	               itemId: productID
	            }], function(err, res) {});

         console.log("Thank you for shopping at HEIDI SONOMA!");
         console.log("----------------------------------------------------------");
         welcom();

      } else{
         console.log("Thank you for visitng. Looking forward to see you next time.");
         console.log("----------------------------------------------------------");
         welcom();        
      }
  }); //end of userOrder
}// end of continueOrder function







