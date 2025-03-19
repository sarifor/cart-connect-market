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

// Q. 처리 성공 시 프론트엔드 메인 화면으로 리다이렉트시키려면?
// A. 백엔드에서는 status: 200과 함께 성공 응답을 보내고, 프론트엔드에서 리다이렉트 처리하는 것이 일반적임 (ChatGPT)
const login = async (req, res, next) => {
  try {
    // const user = await User.findOne(req.body);

    const user = { 
      id: 5,
      name: "batman",
      address: "in the sky",
    }

    console.log("Login user data: ", user);  

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

/* const logout = async (req, res, next) => {
  try {
    res.status(200).json("ok");
  } catch (error) {
    console.log(error);
  }
}; */

module.exports = { userTest, login };