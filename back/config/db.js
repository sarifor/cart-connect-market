const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const mysql = new Sequelize({
  database: 'testdb',
  username: 'root',
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  dialect: 'mysql'
})

// Q. 모델을 별도 파일로 분리하려면? ../models/index.js 코드를 참고하면 해결될지도?
const User = mysql.define(
  'User',
  {
    name: {
      type: DataTypes.STRING,
      defaultValue: 'No name yet',
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
);

module.exports = { mysql, User };