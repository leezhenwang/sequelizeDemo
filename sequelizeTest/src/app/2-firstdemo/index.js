const sequelize = require('sequelize');
const db = require('../../db');
const random = require('../../utils/random');

// 定义一个 user model
const {
    STRING
} = sequelize;

const User = db.define('user', {
    user_name: {
        type: STRING(32),
    },
    password: {
        type: STRING(32),
    }
});

const createTable = async () => {
    // 可以选择在 应用/服务器 启动的时候，把 User 映射到数据库中，比如这里会在数据库中自动创建一张表: users
    // 如果 force 为 true, 则每次都会重建表 users
    await User.sync({
        force: true,
    });
}

const createUser = async () => {
    // 创建几个用户
    for (let i = 0; i < 5; i++) {
        const userName = random.getRandomString(8);
        const password = random.getRandomString(16);

        const user = await User.create({
            user_name: userName,
            password
        });
        // sequelize 会默认加上 id, createdAt, updatedAt 字段
        console.log(user.id, user.createdAt, user.updatedAt);
    }
}

const queryAll = async () => {
    // 查询所有的结果
    const users = await User.findAll();
    users.forEach((user) => console.log('findAll', user.id, user.user_name));
}

(async () => {
    console.log('------------- createTable');
    await createTable();
    console.log('------------- createUser');
    await createUser();
    console.log('------------- queryAll');
    await queryAll();
})();
