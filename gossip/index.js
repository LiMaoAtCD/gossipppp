const Koa = require("koa");
const koaRouter = require('koa-router');
const koaBodyParser = require('koa-bodyparser');

const config = require('./config/config')
const mongoose = require('mongoose')
const userRouter = require('./routes/user')

mongoose.Promise = global.Promise
const baseRouter = new koaRouter();
const app = new Koa();


app.use(koaBodyParser());

baseRouter.prefix("/v1/");
baseRouter.use(userRouter.routes());
app.use(baseRouter.routes());
app.use(baseRouter.allowedMethods());





mongoose.connect('mongodb://localhost:27017/gossip',{useNewUrlParser: true});
let db = mongoose.connection;
mongoose.set('useCreateIndex', true);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("mongoose connect success")
});
app.listen(config.port);