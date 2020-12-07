'use strict'
const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const cors =require('./middleware/cors')
const path = require("path");
const port = process.env.PORT || 3000;
const app = new Koa();
const router = new Router();
const generataRouter = require("./generateRouter");



app.use(logger());

app.use(cors())


generataRouter(router)
router.get('/routerMap',(ctx,next)=>{ctx.body=require('./public/routerMap.json')})

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, function () {
  console.log(`server is listening ${port}`);
});


