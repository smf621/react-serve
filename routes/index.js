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

//更新用户信息的路由
router.post('/update', function (req, res) {
    //从请求的cookie得到userid
    const userid = req.cookies.userid
    if (!userid) {
        return res.send({code: 1, msg: '请先登录'})
    }
    //得到用户提交数据
    const user = req.body
    UserModel.findByIdAndUpdate({_id: userid}, user, function (err, oldUser) {
        if (!oldUser) {
            res.clearCookie('userid')
            res.send({code: 1, msg: '请先登录'})
        } else {
            const {_id, username, type} = oldUser
            const data = Object.assign({_id, username, type}, user)
            res.send({code: 0, data})
        }
    })
})
//获取用户信息的路由
router.get('/user', function (req, res) {
    // 取出cookie 中的userid
    const userid = req.cookies.userid
    if (!userid) {
        return res.send({code: 1, msg: '请先登陆'})
    }
    // 查询对应的user
    UserModel.findOne({_id: userid}, filter, function (err, user) {
        return res.send({code: 0, data: user})
    })
})


// 获取用户列表(根据类型)
router.get('/userlist', function (req, res) {
    const {type} = req.query
    UserModel.find({type}, filter, function (error, users) {
        res.send({code: 0, data: users})
    })
})

module.exports = router;
