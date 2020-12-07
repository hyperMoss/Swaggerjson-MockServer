/**
        获取表单
      **/
      const Mock = require("mockjs");
      module.exports = function (app) {
        app.get('/api/getList', (ctx, next) => {
          ctx.body=Mock.mock({
  "list": [
    {
      "id": "@string",
      "name": "@string"
    }
  ],
  "code": "@string",
  "message": "@string"
})
        });
      };