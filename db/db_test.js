const md5 = require('blueimp-md5')
// 1. 连接数据库
// 1.1. 引入mongoose
const mongoose = require('mongoose')
// 1.2. 连接指定数据库(URL 只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/gzhipin_test2')
// 1.3. 获取连接对象
const conn = mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
conn.on('connected', function () {
    console.log('数据库连接成功')
})

// 2. 得到对应特定集合的Model
// 2.1. 字义Schema(描述文档结构)
const userSchema = mongoose.Schema({
    username: {type: String, required: true}, // 用户名
    password: {type: String, required: true}, // 密码
    type: {type: String, required: true}, // 用户类型: dashen/laoban
})
// 2.2. 定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('user', userSchema) // 集合名: users

// 3.1. 通过Model 实例的save()添加数据
function testSave() {
// user 数据对象
    const user = {
        username: 'xfzhang',
        password: md5('1234'),
        type: 'dashen',
    }
    const userModel = new UserModel(user)
// 保存到数据库
    userModel.save(function (err, user) {
        console.log('save', err, user)
    })
}
// testSave()