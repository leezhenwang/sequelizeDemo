const Model = require('../model/model');
const sequelize = require('sequelize');

const UserDAO = {
  // 新增一个user
  createUser(userInfo) {
    console.log(userInfo)
    return Model.UserModel.create(userInfo);
  },
};

module.exports = UserDAO;
