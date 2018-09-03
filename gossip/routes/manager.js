const managerController = require('../controller/managerController')
const koaRouter = require("koa-router");
const managerRouter = new koaRouter();


managerRouter.prefix("/manager")
managerRouter.post('/login', managerController.login);
managerRouter.post('/register', managerController.register);
managerRouter.get('/list', managerController.getlist);


module.exports = managerRouter;






