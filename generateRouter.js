const { throws } = require('assert');
const fs = require('fs');
const join = require('path').join


// 文件系统扫描mock相关数据
function scan(path, app) {
    const files = fs.readdirSync(path)
    for (let i = 0; i < files.length; i++) {
        const fpath = join(path, files[i])
        const stats = fs.statSync(fpath)
        if (stats.isDirectory()) {
            scan(fpath, app)
        }
        if (stats.isFile()) {
            try {
                require(fpath)(app)
            } catch (error) {
                console.warn(error, fpath);
            }
            // app.use()

        }
    }
}


module.exports = function (app) {
    scan(join(__dirname, './routes'), app)
}