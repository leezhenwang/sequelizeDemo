const sequelize = require('sequelize');
const db = require('../../db');

const {
    INTEGER,
    STRING,
} = sequelize;

const Role = db.define(
    'role', {
        role_id: {
            type: INTEGER.UNSIGNED,
            allowNull: false,
        },
        role_name: {
            type: STRING(32),
            allowNull: false,
            unique: true,
            validate: {
                min: 4,
                max: 32,
            },
        },
        level: {
            type: INTEGER,
            defaultValue: 1,
        },
    }, {
        underscored: true,
        paranoid: true,
    }
);

const createTable = async () => {
    await Role.sync({
        force: true,
    });
};

const createRoles = async () => {
    const l = [];
    for (let i = 1; i <= 5; i++) {
        l.push({
            role_id: i,
            role_name: `name-${i}`,
            level: i + 5
        });
    }
    await Role.bulkCreate(l);
}

const rawQueryUsage = async () => {
    // 实际上报错: 找不到 sequelize.query 这个函数

    const result1 = await db.query("SELECT * FROM roles");
    console.log('result 1:', JSON.stringify(result1));
    console.log('\r\n');
    const result2 = await db.query("SELECT * FROM roles", {
        type: db.QueryTypes.SELECT
    });
    console.log('result 2:', JSON.stringify(result2));
}

(async () => {
    console.log('------------- createTable');
    await createTable();
    console.log('------------- createRoles');
    await createRoles();
    console.log('------------- rawQueryUsage');
    await rawQueryUsage();
})();
