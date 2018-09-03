import Koa from "koa";
import koaRouter from "koa-router";
import koaBodyParser from "koa-bodyparser";
import config from "./config/config";

const baseRouter = new koaRouter();

const app = new Koa();


app.use(koaBodyParser());
app.use(baseRouter.routes());

app.listen(config.port)