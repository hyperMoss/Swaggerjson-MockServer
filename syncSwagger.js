const fs = require('fs');
const { join } = require('path');
const { promisify } = require('util');
const mkdirp = require('mkdirp');
const swaggerParserMock = require('swagger-parser-mock');
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(mkdirp);
const blacklist = require('./config/blackList.json');
const swaggerOption = {
  url: 'http://localhost:1988/swaggerApi.json',
  outputPath: './routes',
  blacklist: blacklist,
};
const routerMap = [];

const main = {
  init({ url, blacklist, outputPath }) {
    this.url = url;
    this.blacklist = blacklist;
    this.outputPath = outputPath;
    this.parse().catch((error) => console.log(error));
  },

  async parse() {
    const { paths } = await swaggerParserMock(this.url);
    this.traverse(paths);
    setTimeout(async () => {
      await writeFile(
        './public/routerMap.json',
        JSON.stringify(routerMap, null, 4),
        (err) => { }
      ).finally(() => {
        console.log('路由生成成功');
        process.exit(0);
      });
    }, 1000);
  },
  generateTemplate({ summary, example, method, path }) {
    return `
      /**
        ${summary}
      **/
      const Mock = require("mockjs");
      module.exports = function (app) {
        app.${method}('/api${path.replace(
      /\{([^}]*)\}/g,
      ':$1'
    )}', (ctx, next) => {
          ctx.body=Mock.mock({"code":0,"data":${example},"msg":''})
        });
      };`;
  },
  // 遍历api path信息
  traverse(paths) {
    for (let path in paths) {
      if (this.blacklist.includes(path)) {
        continue;
      }
      for (let method in paths[path]) {
        const pathInfo = paths[path][method];

        if (!pathInfo['responses'] || !pathInfo['responses']['200']) {
          continue;
        }
        this.generate(path, method, pathInfo).catch((error) =>
          console.log(error.message)
        );
      }
    }
  },

  async generate(path, method, pathInfo) {
    try {
      const outputPath = join(__dirname, this.outputPath, path);
      const {
        summary,
        responses: { 200: responseOK },
      } = pathInfo;
      // 生成目录
      await mkdir(outputPath);

      const example = responseOK['example'];
      // 生成文件内容
      const template = this.generateTemplate({
        summary,
        example,
        method,
        path,
      });

      // 生成文件, 已存在的跳过，避免覆盖本地以及编辑的文件
      const fPath = join(outputPath, `${method}.js`);
      await writeFile(fPath, template, { flag: 'wx' });
      // 路径标志节点
      const pathFlag = 'api';
      if (outputPath.match(new RegExp(`\/${pathFlag}\/(.*)`, 'i'))) {
        routerMap.push(outputPath.match(/\/api\/(.*)/i)[1]);
      }
    } catch (error) {
      console.log(error);
    }
  },
};

main.init(swaggerOption);
