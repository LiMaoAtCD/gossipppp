const userController = require('../controller/UserController')
const koaRouter = require("koa-router");
const userRouter = new koaRouter();


userRouter.post('/login', userController.wxLogin);

userRouter.post('/userInfo',userController.userInfo);

userRouter.get('/list', userController.getlist);

userRouter.post("/upload",userController.upload);
//
// userRouter.post('/login2', async (ctx) => {
//
//     let body = ctx.request.body
//     if (body.code === undefined) {
//         ctx.body = GossipJson(404, "上传字段不对").json()
//     } else {
//         let urlToAuth = createWxLoginUrl(body.code)
//         let authRes = await axios.post(urlToAuth)
//         if (authRes.openid === undefined || authRes.errCode !== undefined) {
//             ctx.body = GossipJson(404, "微信认证失败" + authRes.errmsg).json()
//         } else {
//             ctx.body = GossipResult(200,"", authRes.openid)
//         }
//     }
//
// })


module.exports = userRouter;






