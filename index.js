'use strict'
const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const cors = require('./middleware/cors')
const process = require('process')
const port = process.env.PORT || 3000;
const app = new Koa();
const router = new Router();
const generataRouter = require("./generateRouter");
const { spawn } = require("child_process");





const subprocess = spawn('node', ['./staticServe.js']);
subprocess.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
subprocess.kill(); // Does not terminate the Node.js process in the shell.

generataRouter(router)

app.use(logger());

app.use(cors())

router.get('/routerMap', (ctx, next) => { ctx.body = require('./public/routerMap.json') })

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, function () {
  console.log(`server is listening ${port}`);
});
