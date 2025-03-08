const { User } = require('../config/db');

const userTest = async (req, res, next) => {
  try {
    // Insert
    const user = await User.create({
      name: 'Nana',
      age: 15,
    });
    console.log("User Insert Data: ", user.name, user.age);
    
    // Select
    const allUser = await User.findAll();
    console.log("User Select Data: ", user);  

    res.status(200).json([{"value": "ok"}]);
    console.log("ok")
  } catch (error) {
    console.log(error);
  }
};

module.exports = { userTest };