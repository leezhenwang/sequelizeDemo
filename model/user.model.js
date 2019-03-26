const sequelize = require('sequelize');
const db = require('./db.js');

const {
    INTEGER,
    STRING,
    DATE,
    NOW,
    JSON
} = sequelize;

// 定义一个账号
const UserField =
  {
      // id （实际上 Sequelize 默认会自动生成一个自增 id）
      id: {
          type: INTEGER,
          autoIncrement: true,
          // 做为主键
          primaryKey: true,
      },
      // 账号ID为一个整型，且不能为空
      // userId: {
      //     type: INTEGER.UNSIGNED,
      //     allowNull: false,
      //     // 账号id需要唯一性，这个是永远不能改变的值，特别是在分表的情况下，用自增ID不小心就会重复了
      //     unique: true,
      // },
      // 账号名称，字符串，范围是 4~32
      userName: {
          // 如果不指定 STRING 长度，则默认是 255
          type: STRING(32),
          validate: {
              // 限制长度范围
              min: 4,
              max: 32,
          },
          // 账号需要唯一性，登录时候使用
          unique: true,
      },
      // 密码
      password: {
          type: STRING(128),
          allowNull: false,
      },
      // 昵称
      nickName: {
          type: STRING(32),
          validate: {
              min: 4,
              max: 32,
          },
          // 假设昵称后要加上 id 值
          // get() {
          //     const id = this.getDataValue('id');
          //     return this.getDataValue('nickName') + '-' + id;
          // },
      },
      // 邮箱
      email: {
          type: STRING(64),
          allowNull: false,
          validate: {
              // 格式必须为 邮箱格式
              isEmail: true,
          },
      },
      // 属性，这里用 JSON 格式写入
      profile: {
          type: JSON,
      },

      // 还支持外键功能, 不过我不喜欢使用, 项目换人了，触发器, 存储过程, 外键 这些东西就比较麻烦了
}

module.exports = db.define('user', UserField, {
  comment: '用于用户信息'
});
