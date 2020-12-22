var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/register', function (req, res, next) {
    //获取请求参数
    const {username, password} = req.body
    if (username === 'admin') {
        res.send({code: 1, msg: '此用户已存在'})
    } else {
        res.send({code: 0, data: {_id: '1233', username, password}})
    }
});

module.exports = router;
