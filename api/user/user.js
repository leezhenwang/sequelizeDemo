//用于汇聚所有的user相关的接口
const express = require('express');
const router = express.Router();

router.use('/create', require('./create_user'));//创建user
// router.use('/detail', require('./detail_user'));//获取user的详情
// router.use('/list', require('./list_user'));//获取user列表
// router.use('/update', require('./update_user'));//更新user
// router.use('/delete', require('./delete_user'));//删除user

module.exports = router;