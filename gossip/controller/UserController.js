
const usermodel = require('../models/user')
const gossipmodel = require('../models/gossip')
const axios = require('axios')
const uuid = require("uuid")
const Result = require("../Utils/unionresult")

class UserController {
    static async wxLogin(ctx) {
        let code = ctx.request.body.code;
        if( code ) {
            let urlToAuth = createWxLoginUrl( code )
            let res = await axios.post(urlToAuth)

            if (res.data.openid === undefined || res.data.errCode !== undefined) {
                ctx.body = Result(404, "微信认证失败" + res.data.errCode)
            } else {
                let existUser = await usermodel.findOne({openid: res.data.openid})
                if (existUser) {
                    existUser.openid = res.data.openid
                    existUser.save()
                } else {
                    let uid = uuid.v1();
                    var user = new usermodel({
                        userId: uid,
                        openid: res.data.openid
                    })
                    user.save()
                }
                ctx.body = Result(200,"登录成功", res.data.openid);
                console.log('登录成功')
            }
        } else {
            ctx.body = Result(400,"微信登录失败");
        }
    }

    static async userInfo(ctx) {
        let openid = ctx.request.body.openid
        if (openid) {
            var user = usermodel.findOne({openid: openid});

            if (ctx.request.body.nickname) {
                user.nickname = ctx.request.body.nickname
            }
            if (ctx.request.body.address) {
                user.address = ctx.request.body.address
            }
            if (ctx.request.body.cellphone) {
                user.cellphone = ctx.request.body.cellphone
            }
            user.save()
            ctx.body = Result(200,"用户信息上传成功");
        } else {
            ctx.body = Result(400,"openid 错误");
        }
    }

    static async getlist(ctx) {
        let query = ctx.request.query
        let openid = query.openid
        let pageIndex = query.pageIndex
        let pageSize = query.pageSize
        if (openid) {
            let user = usermodel.findOne({openid: openid})
            if (user) {
                gossipmodel
                    .find()
                    .populate(user.userId)
                    .skip(pageIndex * pageSize)
                    .limit(pageSize)
                    .exec(function (err, gossips) {
                        if (err) {
                            console.log("查询用户爆料列表失败: " + err)
                            ctx.body = Result(400, "查询用户爆料列表失败")
                        }  else {
                            ctx.body = Result(200,"", gossips)
                        }
                })
            } else {
                ctx.body = Result(400, "未获取到用户");
            }
        } else {
            ctx.body = Result(400, "openid 为空");
        }
    }

    static async upload(ctx) {

        let openid = ctx.request.body.openid
        if (openid) {
            let user = usermodel.findOne({openid: openid})
            if (user) {
                let title = ctx.request.body.title;
                let content = ctx.request.body.content;
                let file = ctx.request.body.file;

                var gossip = new gossipmodel({
                    gossipId: uuid.v4(),
                    title: title,
                    content: content,
                    file: file
                })
                gossip.save()
                ctx.body = Result(200,"创建成功");

            } else {
                ctx.body = Result(400, "未获取到用户");
            }
        } else {
            ctx.body = Result(400, "openid 为空");
        }
    }

}

module.exports = UserController


//构建微信登录请求url

function createWxLoginUrl(code) {
    let url = "https://api.weixin.qq.com/sns/jscode2session?" +
        "appid=wxc0f1cee1b76df4c7&" +
        "secret=990a95bb587ed6566ded774aa07b612c&" +
        "grant_type=authorization_code&" + "js_code=" + code.toString()
    return url
}