//汇聚所有模块的model
const db = require('./db');
const UserModel = require('./user.model');
//const ArticleModel = require('./article.model');

/**
 * 打开重置数据库
 * 生产环境必须关闭
 */
db
  .sync({ force: true })
  .then(() => {
    console.log('数据库初始化成功');
  })
  .catch(err => {
    console.log('数据库初始化失败');
    console.log(err);
  });

//定义表之间的关系
// UserModel.hasMany(ArticleModel, {
//   foreignKey: 'userId',
//   targetKey: 'userId'
// })


module.exports = {
  db: db,
  UserModel: UserModel,
};
