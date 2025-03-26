const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Q. Sequelize 설정의 host란?
// A. 데이터베이스 서버의 주소를 의미합니다. MySQL이 Node.js 서버와 같은 EC2 인스턴스에 설치되어 있다면, 배포 환경에서도 host: 'localhost' 그대로 사용해도 되고, 별도의 도메인이나 퍼블릭 IP로 변경할 필요는 없습니다 (ChatGPT)
const mysql = new Sequelize({
  database: 'testdb',
  username: 'root',
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  dialect: 'mysql'
});

// Q. 모델을 별도 파일로 분리하려면? ../models/old/index.js 코드를 참고하면 해결될지도?
const Member = mysql.define(
  'Member',
  {
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    family_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,      
    },
  },
  {
    tableName: 'member_tbl',
    timestamps: false,
  },
);

module.exports = { mysql, Member };