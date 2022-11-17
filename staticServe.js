// 将json挂入服务器上作为静态资源
const staticServe = require("koa-static");
const fs = require('fs');
const path = require("path");
const Koa = require("koa");
const sync = require("./syncSwagger");
const port = 1988;
const app = new Koa();

const deleteFolderRecursive = function (directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file, index) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
};


const interfaceJson = staticServe(path.join(__dirname) + "/public/");

deleteFolderRecursive('./routes')

app.use(interfaceJson);

app.listen(port, function () {
  console.log(`server is listening ${port}`);
});

sync;
