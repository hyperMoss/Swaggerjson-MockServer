// 将json挂入服务器上作为静态资源
const staticServe = require("koa-static");
const path = require("path");
const Koa = require("koa");
const sync = require("./syncSwagger");
const port = 3000;
const app = new Koa();

const interfaceJson = staticServe(path.join(__dirname) + "/public/");

app.use(interfaceJson);

app.listen(port, function () {
  console.log(`server is listening ${port}`);
});

sync;
