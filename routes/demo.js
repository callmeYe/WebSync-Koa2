const Koa = require('koa');
const path = require('path')
const fs = require('fs')
const Router = require('@koa/router');

const templateRoot = path.join(__dirname, '../public');
const router = new Router()
const genError = (code, msg) => {
    var err = new Error(msg);
    err.status = code;
    return err;
}

router.get('/', async (ctx, next) => {
    var htmlFile = await (new Promise(function (resolve, reject) {
        fs.readFile(path.join(__dirname, '../public/index.html'), (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    }))
    ctx.type = 'html';
    ctx.body = htmlFile;
})

router.get('/map', (ctx, next) => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(path.join(__dirname, '../public/map.html'));
});

module.exports = router;