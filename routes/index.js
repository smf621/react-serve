var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const {UserModel} = require('../db/models')
const filter = {password: 0, __v: 0}

/* GET home page. */

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});
// router.post('/register', function (req, res, next) {
//     //获取请求参数
//     const {username, password} = req.body
//     if (username === 'admin') {
//         res.send({code: 1, msg: '此用户已存在'})
//     } else {
//         res.send({code: 0, data: {_id: '1233', username, password}})
//     }
// });

//注册的路由
router.post('/register', function (req, res) {
    //读取请求参数
    const {username, password, type} = req.body
    //处理
    UserModel.findOne({username}, function (err, user) {
        //判断用户是否存在
        if (user) { //已存在
            res.send({code: 1, msg: '此用户已存在'})
        } else { //不存在
            const userModel = new UserModel({username, type, password: md5(password)})
            userModel.save(function (err, user) {
                // 生成一个cookie(userid: user._id), 并交给浏览器保存
                res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7})
                const data = {username, type, _id: user._id}
                //返回响应数据
                res.send({code: 0, data: data})
            })
        }
    })
})
//登录的路由
router.post('/login', function (req, res) {
    const {username, password} = req.body
    UserModel.findOne({username, password: md5(password)}, filter, function (err, user) {
        if (user) {
            res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7})
            res.send({code: 0, data: user})
        } else {
            res.send({code: 1, msg: "用户名或者密码错误"})
        }
    })
})

module.exports = router;
