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

  welcomManager();

});

// List a set of menu options:, View Products for Sale, View Low Inventory, Add to Inventory, Add New Product
function welcomManager() {
  inquirer.prompt([
      {
        type: "list",
        name: "managerAction",
        message:"This page is for Manager only. \n\n Welcome Manager, select an action from the list below.",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
      }
   ]).then(function(managerAnswer) {
      managerAction = managerAnswer.managerAction;

      callSwitch();   

    });

}//end of welcomManager function


// set switch function
function callSwitch() {
   switch(managerAction) {

     case "View Products for Sale":
      viewProduct();
      break;

     case "View Low Inventory":
       lowInventory();
       break;

     case "Add to Inventory": 
      addInventory();
      break;

     case "Add New Product":
       newProduct();
       break; 

   }
} //end of callSwitch function

// View Products for Sale => in ventory at that time?
function viewProduct() {
    // instantiate
  var table = new Table({
      head: ["ID#", "Item", "Department", "Price", "Stock"], 
      colWidths: [5, 30, 30, 10, 10]
  });
 
    listInventory();


    // table is an Array, so you can `push`, `unshift`, `splice` and friends
  function listInventory() {
      connection.query("SELECT * FROM products", function(err,res){
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

          welcomManager();
      });
  }
} //end of viewProduct function 



// View Low Inventory => stock quantity is less than 5
function lowInventory(){
  // instantiate
  var table = new Table({
      head: ["ID#", "Item", "Department", "Price", "Stock"], 
      colWidths: [5, 30, 30, 10, 10]
  });
 
    listLowInventory();


    // table is an Array, so you can `push`, `unshift`, `splice` and friends
  function listLowInventory() {
   connection.query("SELECT * FROM products WHERE stockQuantity <= 5", function(err,res) {
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

          welcomManager();
      });
  }

} // end of lowInventory function 



// Add to Inventory
function addInventory() {
   var newQuantity;
   var addId;
   var addQuantity;
   var Quantity;

    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Enter Product ID number you would like to update.",
        },{
            type: "input",
            name: "quantity",
            message: "How many units of this item would you like to add?",
        }
    ]).then(function(answers) {
        addId = parseInt(answers.id);
        addQuantity = parseInt(answers.quantity);
        
        connection.query("SELECT * FROM products WHERE ?", [
             {
                 itemId:addId
              }
          ], function(err,res){ 

          for(var i = 0; i < res.length; i++){
                  // console.log(res[i].itemId + " " + res[i].productName + " | Department: " + res[i].departmentName + 
                  // " | Price: " + res[i].price + " | In Stock: " + res[i].stockQuantity );     
              newQuantity = res[i].stockQuantity + addQuantity;
                  //console.log(newQuantity);

          connection.query("UPDATE products SET stockQuantity=? WHERE  itemId =?", 
              [newQuantity, addId], function(err,res){
                  console.log("Your update has been added to product list. Please check with the product list below");
                  
                  viewProduct();
               })
             }                    
          })   
    });
} // end of addInventory function 



// Add New Product
function newProduct() {
  inquirer.prompt([
          {
              type: "input",
              name: "inputProduct",
              message: "Enter the name of the product you would like to add.",
          },
          {
              type: "input",
              name: "inputDepartment",
              message: "Enter the department name of the product.",
          },
          {
              type: "input",
              name: "inputPrice",
              message: "Enter price for the product (per unit).",
          },
          {
              type: "input",
              name: "inputQuantity",
              message: "Enter the number of unit in stock.",
          }
      ]).then(function(managerNew) {
            connection.query("INSERT INTO products SET ?", {
                  productName: managerNew.inputProduct,
                  departmentName: managerNew.inputDepartment,
                  price: managerNew.inputPrice,
                  stockQuantity: managerNew.inputQuantity
            }, function(err, res) {});
               
               console.log("Item(s) has been added! Check product table below.")

               viewProduct();
               //welcomManager();

        });
}// end of newPeoduct function




