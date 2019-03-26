//汇聚所有模块的接口，包括user和article等
const express = require('express');
const router = express.Router();

// 端接口
router.use('/user', require('./user/user.js'));
//router.use('/article', require('./article/article.js'));

module.exports = router;