const Result = require("../Utils/unionresult")
const managerModel = require('../models/manager')
const gossipModel = require('../models/gossip')
const uuid = require("uuid")
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const util = require('util')
const verify = util.promisify(jwt.verify)


const jwtSecret = 'jwt_gossip';
const secret = 'gossipppp';
// const hash = crypto.createHmac('sha256', secret)
//     .update('I love cupcakes')
//     .digest('hex');
// console.log(hash);

function gossip_crypto(str) {
    return crypto.createHmac('sha256', secret).update(str).digest('hex')
}

class Manager {

    static async register(ctx) {
        let username = ctx.request.body.username;
        let password = ctx.request.body.password;
        if (username && password) {
            let result = await managerModel.findOne({"username": username})
            if (result){
                ctx.body = Result(400, "不能重复注册")
            } else {
                let uid = uuid.v1()
                let manager = new managerModel({
                    username: username,
                    password: gossip_crypto(password),
                    managerId: uid
                })
                manager.save()
                ctx.body = Result(200, "注册成功")
            }
        } else {
            ctx.body = Result(400,"参数错误，用户名或密码不能为空")
        }
    }

    static async login(ctx) {
        let username = ctx.request.body.username;
        let password = ctx.request.body.password;
        if (username) {
            try {
                let manager = await managerModel.findOne({"username": username})
                if (manager.password == gossip_crypto(password)) {
                    let token = jwt.sign({
                        data: manager.username
                    }, jwtSecret, {expiresIn: "1h"});
                    ctx.body = Result(200, "登录成功", token)
                } else {
                    ctx.body = Result(400, "用户名或密码错误")
                }
            }catch (error) {
                ctx.body = Result(400, "登录失败：" + error.toString())
            }
        }
    }

    static async getlist(ctx) {
        let authorization = ctx.request.headers.authorization

        try {
            let result = jwt.verify(authorization, jwtSecret)
            let manager_res = await managerModel.findOne({"username": result.data})

            let query = ctx.request.query
            let pageNum = Number(query.pageNum)
            let pageSize = Number(query.pageSize)
            if (pageSize > 0 && pageNum > 0) {
                try {
                    let result = await gossipModel
                        .find()
                        .skip(pageNum * pageSize)
                        .limit(pageSize)
                        .exec()
                    ctx.body = Result(200,"获取成功", result)
                } catch (error) {
                    console.log("查询用户爆料列表失败: " + error)
                    ctx.body = Result(400, "查询用户爆料列表失败")
                }
            } else {
                ctx.body = Result(400, "参数错误");
            }
        } catch (error) {
            console.log(error)
            ctx.body = Result(401,"Token 失效")
        }

    }
}

module.exports = Manager
