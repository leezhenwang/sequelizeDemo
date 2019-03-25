const sequelize = require('sequelize');
const db = require('../../db');

const {
    INTEGER,
    STRING,
    DATE,
    NOW,
    JSON
} = sequelize;

// 定义一个账号

const Account = db.define(
    'account', {
        // id （实际上 Sequelize 默认会自动生成一个自增 id）
        id: {
            type: INTEGER,
            autoIncrement: true,
            // 做为主键
            primaryKey: true,
        },
        // 账号ID为一个整型，且不能为空
        accountId: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
            // 账号id需要唯一性，这个是永远不能改变的值，特别是在分表的情况下，用自增ID不小心就会重复了
            unique: true,
        },
        // 账号名称，字符串，范围是 4~32
        accountName: {
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
            get() {
                const id = this.getDataValue('id');
                return this.getDataValue('nickName') + '-' + id;
            },
        },
        // 邮箱
        email: {
            type: STRING(64),
            allowNull: false,
            validate: {
                // 格式必须为 邮箱格式
                isEmail: true,
            },
            // set 假设数据库中存储的邮箱都要是大写的，可以在此处改写
            set(val) {
                this.setDataValue('email', val.toUpperCase());
            },
        },
        // 注册日期 (实际上 Sequelize 默认会自动生成一个 createdAt 字段)
        registerAt: {
            type: DATE,
            defaultValue: NOW,
        },
        // 属性，这里用 JSON 格式写入
        profile: {
            type: JSON,
        },

        // 还支持外键功能, 不过我不喜欢使用, 项目换人了，触发器, 存储过程, 外键 这些东西就比较麻烦了
    }, {
        getterMethods: {
            // 自定义函数, brief 返回该账号的简要信息
            brief() {
                return `${this.accountId} ${this.accountName} ${this.nickName}`;
            },
        },
        setterMethods: {},

        // classMethods 和 instanceMethods 在 版本4 被移除了
        // 详见: http://docs.sequelizejs.com/manual/tutorial/upgrade-to-v4.html#config-options
        // 定义 类 级别的函数，可以用 Account 调用
        classMethods: {
            getCMethod() {
                return 'classMethods';
            }
        },
        // 定义 实例 级别的函数，用 account 调用
        instanceMethods: {
            getIMethod() {
                return 'instanceMethods';
            }
        },
        // 也可以在 src/db/index 中定义全局的函数

        // 设置为 false 之后，将不会自动加上 createdAt, updatedAt 这两个字段
        timestamps: true,
        // 假设我们需要 创建和更新 这两个字段，但不喜欢驼峰命名法
        // 设置为 true 之后，自动增加的字段就会用下划线命名: created_at, updated_at
        underscored: true,
        // 也可以分别设置 createdAt, updatedAt 是否需要

        // 假设我们喜欢 date 这个名字表示创建时间
        createdAt: 'date',
        // 不想要 updatedAt 这个字段
        updatedAt: false,

        // 设置为 true 之后，则不会真正的删除数据，而是设置 deletedAt
        paranoid: true,
        // 也可以重命名 deletedAt
        deletedAt: 'deleteTime',

        // 定义表名, 默认会生成一个 accounts 的表
        tableName: 'account',

        // 设置引擎格式，默认是 InnoDB 的，这是对单个表有效的
        // engine: 'MYISAM',

        // 写表注释
        comment: '账号表',

        // 可以在定义 字段的时候添加索引，不过在这个地方加索引看的会更清晰
        indexes: [
            // email 需要唯一
            {
                unique: true,
                fields: ['email']
            },
            // 创建一个 符合索引
            {
                // 默认名字 [table]_[fields]，巨丑
                name: 'select_index',
                fields: ['accountName', 'email', 'password'],
            }
        ]
    }
);

const createTable = async () => {
    await Account.sync({
        force: true,
    });
};

(async () => {
    console.log('------------- createTable');
    await createTable();
})();
