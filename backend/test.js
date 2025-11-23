const bcrypt = require("bcrypt");

const hash = "$2b$10$EJH9MuNoMNFcQJUO2cRPnOVjtj/06hEy9yVQoP2v5ZmDhg7QpcGZ6";
const password = "admin123";

bcrypt.compare(password, hash, (err, result) => {
  console.log("Cocok? ", result);
});
