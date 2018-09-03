
const usermodel = require('../models/user')
const gossipmodel = require('../models/gossip')
const axios = require('axios')
const uuid = require("uuid")

class UserController {
    static async wxLogin(ctx) {
        let code = ctx.request.body.code;
        if( code ) {
            let urlToAuth = createWxLoginUrl( code )
            let authRes = await axios.post(urlToAuth)
            if (authRes.openid === undefined || authRes.errCode !== undefined) {
                ctx.body = GossipJson(404, "微信认证失败" + authRes.errmsg).toJSON()
            } else {
                let existUser = usermodel.findOne({_openid: authRes.openid})
                if (existUser) {
                    existUser.openid = authRes.openid
                    existUser.save()
                } else {
                    let uuid = uuid.v1();
                    var user = new usermodel({
                        userId: uuid,
                        openid: authRes.openid
                    })
                    user.save()
                }
                ctx.body = GossipResult(200,"", authRes.openid).toJSON();
            }
        } else {
            ctx.body = GossipJson(400,"微信登录失败").toJSON();
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
            ctx.body = GossipResult(200,"用户信息上传成功","").toJSON();
        } else {
            ctx.body = GossipJson(400,"openid 错误").toJSON();
        }
    }

    static async getlist(ctx) {

        let openid = ctx.request.body.openid
        if (openid) {
            let user = usermodel.findOne({openid: openid})
            if (user) {
                gossipmodel
                    .find()
                    .populate(user.userId)
                    .exec(function (err, gossips) {
                        if (err) {
                            console.log("查询用户爆料列表失败: " + err)
                            ctx.body = GossipJson(400, "查询用户爆料列表失败").toJSON()
                        }  else {
                            ctx.body = GossipResult(200,"", gossips).toJSON()
                        }
                })
            } else {
                ctx.body = GossipJson(400, "未获取到用户").toJSON();
            }
        } else {
            ctx.body = GossipJson(400, "openid 为空").toJSON();
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
                ctx.body = GossipJson(200,"创建成功").toJSON();

            } else {
                ctx.body = GossipJson(400, "未获取到用户").toJSON();
            }
        } else {
            ctx.body = GossipJson(400, "openid 为空").toJSON();
        }
    }

}

module.exports = UserController


//构建微信登录请求url

function createWxLoginUrl(code) {
    let url = "https://api.weixin.qq.com/sns/jscode2session?" +
        "appid=xxxxx&" + "secret=xxxxx&" + "grant_type=authorization_code&"
    "js_code=" + code.toString()
    return url
}