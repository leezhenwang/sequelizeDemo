const sequelize = require('sequelize');
const db = require('../../db');

const {
    INTEGER,
    STRING,
    Op,
} = sequelize;

const Role = db.define('role', {
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
        }
    },
    level: {
        type: INTEGER,
        defaultValue: 1,
    }
}, {
    underscored: true,
    paranoid: true,
});
//建数据表
const createTable = async () => {
    await Role.sync({
        force: true,
    });
};
//建数据表的栏目
const createRoles = async () => {
    for (let i = 1; i <= 5; i++) {
        await Role.create({
            role_id: i,
            role_name: `name-${i}`,
        })
    }
}

const findUsage = async () => {
    // 根据 id 查找
    const role1 = await Role.findOne({
        where: {
            id: 1,
        }
    });
    console.log(`findUsage/findById id: ${role1.id}, name: ${role1.role_name}`);

    // 根据条件查找一条数据, level=1 的角色有多个
    const role2 = await Role.findOne({
        where: {
            level: 1,
        }
    });
    console.log(`findUsage/findOne id: ${role2.id}, name: ${role2.role_name}`);

    const role3 = await Role.findOne({
        where: {
            level: 1,
        },
        attributes: ['id', 'role_id'],
    });
    // 结果中并不包含 level
    console.log(`findUsage/findOne id: ${role3.id}, role_id: ${role3.role_id}, level: ${role3.level}`);

    // 如果数据库中没有，则会按照 defaults 生成一条数据, 并且 created 字段为 true
    // 如果数据库中有该数据，则 created 字段为 false
    // 返回的结果是一个数组, 第一个元素为搜索结果，第二个元素为 boolean，表示是否是新建的数据
    const [role4, created] = await Role.findOrCreate({
        where: {
            role_name: 'alex'
        },
        defaults: {
            role_id: 5,
            role_name: 'alex',
            level: 15,
        },
    });
    console.log(`findUsage/findOrCreate created: ${created}, role4: ${JSON.stringify(role4)}`);

    // 查找全部数据，并获得数量
    // 返回值 count: 数据个数
    // 返回值 rows: 包含数据的集合
    const result5 = await Role.findAndCountAll({
        where: {
            level: 1,
        }
    });
    console.log(`findUsage/findAndCountAll count: ${result5.count}, rows: ${JSON.stringify(result5.rows)}`);
}

const findAllUsage = async () => {
    // 查找全部, 可以在其中放入查询条件和限制条件
    console.log('\r\n');
    await Role.findAll({
        where: {
            id: [1, 2, 3, 4, 5]
        },
        limit: 3,
    });

    // all() 是 findAll 的别名

    console.log('\r\n');
    // where 中可以灵活的设置各种条件
    await Role.findAll({
        where: {
            level: {
                [Op.gt]: 1,

                // [Op.and]: {a: 5},           // AND (a = 5)
                // [Op.or]: [{a: 5}, {a: 6}],  // (a = 5 OR a = 6)
                // [Op.gt]: 6,                // id > 6
                // [Op.gte]: 6,               // id >= 6
                // [Op.lt]: 10,               // id < 10
                // [Op.lte]: 10,              // id <= 10
                // [Op.ne]: 20,               // id != 20
                // [Op.between]: [6, 10],     // BETWEEN 6 AND 10
                // [Op.notBetween]: [11, 15], // NOT BETWEEN 11 AND 15
                // [Op.in]: [1, 2],           // IN [1, 2]
                // [Op.notIn]: [1, 2],        // NOT IN [1, 2]
                // [Op.like]: '%hat',         // LIKE '%hat'
                // [Op.notLike]: '%hat',      // NOT LIKE '%hat'
            }
        },
        limit: 3,
    });

    // 也可以设置为 OR/NOT 等条件
    console.log('\r\n');
    // ((`role`.`id` IN (1, 2, 3) OR `role`.`id` > 10) AND `role`.`level` = 1)
    await Role.findAll({
        where: {
            level: 1,
            [Op.or]: [{
                    id: [1, 2, 3]
                },
                {
                    id: {
                        [Op.gt]: 10
                    }
                },
            ]
        }
    });
    console.log('\r\n');

    // (`role`.`id` IN (1, 2, 3) OR `role`.`id` > 12))
    await Role.findAll({
        where: {
            level: 1,
            id: {
                [Op.or]: [
                    [1, 2, 3],
                    {
                        [Op.gt]: 12
                    }
                ]
            }
        }
    });

    console.log('\r\n');
    // order 排序
    await Role.findAll({
        limit: 2,
        order: [
            ['id'],
            ['role_id', 'ASC'],
            // [sequelize.fn('max', sequelize.col('level')), 'DESC'],
        ],
        // 注意 raw, 默认为 false, 这时候 Sequelize 会为搜索出的每一条数据生成一个 Role 实例，用于更新，删除等操作
        // 但当我们只想搜索出数据用于显示，并不想操作它，这个时候设置 raw: true 就会直接返回数据，而不会生成实例
        raw: true,
    });
}

const someUsage = async () => {
    console.log('\r\n');

    // count
    const c1 = await Role.count();
    console.log(`someUsage/count c1: ${c1}`);

    const c2 = await Role.count({
        where: {
            level: {
                [Op.gt]: 1,
            }
        }
    });
    console.log(`someUsage/count c2: ${c2}`);

    // max, min
    const m1 = await Role.max('level', {
        where: {
            id: {
                [Op.gt]: 5,
            }
        }
    });
    console.log(`someUsage/max m1: ${m1}`);

    // sum
    const s1 = await Role.sum('level');
    console.log(`someUsage/sum s1: ${s1}`);
}

(async () => {
    console.log('------------- createTable');
    await createTable();
    console.log('------------- createRoles');
    await createRoles();
    console.log('------------- findUsage');
    await findUsage();
    console.log('------------- findAllUsage');
    await findAllUsage();
    console.log('------------- someUsage');
    await someUsage();
})();
