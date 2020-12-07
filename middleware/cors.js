const vary = require("vary");
module.exports = function () {
  return async function (ctx, next) {
    const requestOrigin = ctx.get("Origin");
    // Always set Vary header
    // https://github.com/rs/cors/issues/10
    ctx.vary("Origin");
    // 如果请求头不存在 origin，则直接跳出该中间件，执行下一个中间件
    if (!requestOrigin) return await next();
console.log(requestOrigin);
    if ("OPTIONS" === ctx.method) {
      if (!ctx.get("Access-Control-Request-Method")) {
        // this not preflight request, ignore it
        return await next();
      }
      ctx.set("Access-Control-Allow-Origin", requestOrigin);
      ctx.set("Access-Control-Allow-Credentials", true);
      ctx.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization,X-Requested-With"
      );
      ctx.status = 204;
    } else {
      ctx.set("Access-Control-Allow-Origin", requestOrigin);
      ctx.set("Access-Control-Allow-Methods", "GET,PUT,OPTIONS,POST,DELETE");
      ctx.set("Access-Control-Allow-Credentials", true);
      ctx.set("Access-Control-Max-Age", 3600);
      ctx.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Accept,Authorization,X-Requested-With"
      );
    }

    next();
  };
};
