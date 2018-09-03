import koaRouter from "koa-router";
import axios from "axios";

const userRouter = new koaRouter();

userRouter.post('/login', async (ctx) => {

    let body = ctx.request.body
    if (body.code === undefined) {
        ctx.body = GossipJson(404, "上传字段不对").json()
    } else {
        let urlToAuth = createWxLoginUrl(body.code)
        let authRes = await axios.post(urlToAuth)
        if (authRes.openid === undefined || authRes.errCode !== undefined) {
            ctx.body = GossipJson(404, "微信认证失败" + authRes.errmsg).json()
        } else {
            ctx.body = GossipResult(200,"", authRes.openid)
        }
    }

})

module.exports = userRouter;




//构建微信登录请求url

function createWxLoginUrl(code) {
    let url = "https://api.weixin.qq.com/sns/jscode2session?" +
        "appid=xxxxx&" + "secret=xxxxx&" + "grant_type=authorization_code&"
        "js_code=" + code.toString()
    return url
}


