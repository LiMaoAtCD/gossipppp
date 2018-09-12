const Koa = require("koa")
const koaRouter = require('koa-router')
const koaBodyParser = require('koa-bodyparser')
const config = require('./config/config')
const mongoose = require('mongoose')
const userRouter = require('./routes/user')
const managerRouter = require('./routes/manager')
const static = require('koa-static')

mongoose.Promise = global.Promise

const baseRouter = new koaRouter()
const app = new Koa();
const staticPath = './static'


baseRouter.prefix("/v1/")
baseRouter.use(userRouter.routes())
baseRouter.use(managerRouter.routes())

app.use(koaBodyParser())
    .use(baseRouter.routes())
    .use(baseRouter.allowedMethods())
    .use(static(path.join(__dirname, staticPath)))





mongoose.connect('mongodb://mongo:27017/gossip',{useNewUrlParser: true});
let db = mongoose.connection;
mongoose.set('useCreateIndex', true);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("mongoose connect success")
});
app.listen(config.port);