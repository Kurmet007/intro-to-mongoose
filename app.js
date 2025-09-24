const prompt = require('prompt-sync')();
const mongoose = require("mongoose");
const Customer = require("./models/customer");
const username = prompt('What is your name? ');
console.log(`Your name is ${username}`);

console.log("=== Welcome to the Customer Manager App ===");

require("dotenv").config(); //<----it took me an hour to figure out i forgot this
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

async function mainMenu() {
  let quit = false;

  while (!quit) {
    console.log("\nChoose an option:");
    console.log("1. Create Customer");
    console.log("2. View Customers");
    console.log("3. Update Customer");
    console.log("4. Delete Customer");
    console.log("5. Quit");

    const choice = prompt("Enter your choice: ");

    switch (choice) {
      case "1":
        await createCustomer();
        break;

      case "2":
        await viewCustomers();
        break;

      case "3":
        await updateCustomer();
        break;
      case "4":

        await deleteCustomer();
        break;
      case "5":

        quit = true;
        console.log(`Goodbye, ${username}!`);
        mongoose.connection.close();
        break;
      default:
        console.log("Invalid option, try again.");
    }
  }
}

async function createCustomer() {
  const name = prompt("Enter customer name: ");
  const age = parseInt(prompt("Enter customer age: "), 10);

  const customer = new Customer({ name, age });
  await customer.save();
  console.log("Customer created!");
}

async function viewCustomers() {
  const customers = await Customer.find();
  console.log("\n--- Customer List ---");
  if (customers.length === 0) {
    console.log("No customers found.");
  } else {
    customers.forEach((c) => {
      console.log(`${c._id} | ${c.name} (${c.age} years old)`);
    });
  }
}

async function updateCustomer() {
  await viewCustomers();
  const id = prompt("\nEnter the ID of the customer to update: ");
  const name = prompt("enter new name: ");
  const age = parseInt(prompt("enter new age: "), 10);

  await Customer.findByIdAndUpdate(id, { name, age });
  console.log("Custoner updated!");
}

async function deleteCustomer() {
  await viewCustomers();
  const id = prompt("\nEnter the ID of the customer to delete: ");
  await Customer.findByIdAndDelete(id);
  console.log("Custtomer deleted!");
}

mainMenu();
