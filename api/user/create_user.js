const express = require('express');
const router = express.Router();
const db = require('../../model/model.js').db;
const UserService = require('../../service/user/user.service.js')

// 添加用户
const createUser = (req, res, next) => {
  // 获取接口参数
  const params = req.body;
  const userName = params.userName;
  const password = params.password;
  const nickName = params.nickName;
  const email = params.email;
  console.log(password)
  db.transaction(transaction => {
    UserService.createUser({
      userName: userName,
      password: password,
      nickName: nickName,
      email: email
    }).then(data=>{
      res.send('添加成功！');
    })
  })
}

router.post('/', createUser);

module.exports = router;