const User = require("../../models/User");
const user = async () => {
  const userCreate = {
    firstName: "daniel",
    LastName: "osorio",
    email: "yilbertosorio06@gmail.com",
    password: "123456",
    phone: "1131822916",
  };

  await User.create(userCreate);
};
module.exports = user;
