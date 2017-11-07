// npm requires
var mysql = require("mysql");
var inquirer = require("inquirer");

// setup database connection
var connection = mysql.createConnection({
  host:"localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon",
});

// test if connected to database
connection.connect(function(err){
  console.log("You're amazing! You did it! Connected Id: " + connection.threadId);
  buyStuff();
});

// show user available products -- TABLE WILL GO HERE SOMEHOW


// ask user if they would like to purchase something from inventory
//var buyStuff() {
function buyStuff() {
  inquirer.prompt({
    // first question
    name:"pickItem",
    type:"input",
    message:"Would you like to purchase one of these amazing items? Enter the id# here...",
    // should check to make sure only a number is chosen
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
        }
          return false;
      }
    },
    // ^^ should check to make sure only a number is chosen

    // second question
    {
      name: "howMany",
      type: "input",
      message: "Enter the quanty you would like of this item...",
      // hopefully checks to make sure only a number is chosen
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
          }
            return false;
        }
      }).then(function(answer) {
        var itemID = answer.itemID;
        var quantity = answer.quantity;
        // connect to database get and store stock qty and alert if user orders more than is in inventory
        connection.query("SELECT * FROM products WHERE item_id=?", [itemID],
          function(err, results) {
            if (err) throw err;
              var stock_qty = results[0].stock_qty;
                // alert if order is larger than what's in inventory
                if (stock_qty < quantity) {
                  console.log("Nope. There isn't enough in stock to fill that order. Sorry, but you have to choose a smaller amount.");
                } else {
                  // subtract purchased amounts from inventory
                  stock_qty -= quantity;
                  // get and store values for purchase info
                  var totalPrice = quantity * results[0].price;
                  var totalSales = totalPrice + results[0].total_sales; //may have issue here...
                  var department = results[0].department_name;

                  // show user the order total amount fixed and rounded to just 2 digits after decimal
                  console.log("\nYour total purchase amount for this product: $" + (quantity * results[0].price).toFixed(2));

                  // display total of entire order
                  orderTotal += (parseFloat(totalPrice));
                  console.log("\nYour total this session is: $" + (orderTotal.toFixed(2)) + "\n");

                  // connect to db and update qty
                  connection.query("UPDATE products SET ? WHERE item_id=?", [{stock_qty: stock_qty}, itemID], function(err, results) {
                    if(err) throw err;
                  });

                  var departmentTotal = results[0].total_sales + totalPrice; //add user totals to dept totals
                    connection.query("UPDATE departments SET total_sales=? WHERE dept_name=?", [departmentTotal, department], function(err, results) {
                      if(err) throw err;
                    });
                }
            });

            // ask if customer wants anything else {
            inquirer.prompt({
              name: "moreStuff",
              type: "rawlist",
              message: "Do you want to keep shopping? Please choose [yes] or [no]...",
              choices:["yes","no"]
            }).then(function(answer) {
                if(answer.moreStuff.toUpperCase()=="yes") {
                  buyStuff();
                } else {
                  //all done
                  console.log("Thanks for shopping with us. You rock! Please visit again soon.");
                }
            });
});
}
