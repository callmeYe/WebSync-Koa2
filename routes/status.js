const Koa = require('koa');
const path = require('path')
const fs = require('fs')
const Router = require('@koa/router');
const Status = require('../schemaes/status');

const router = new Router()
const genError = (code, msg) => {
    var err = new Error(msg);
    err.status = code;
    return err;
}

/**
 * Clear a status or some keys of it
 * 
 * API: Get method to /clear with request like:
 * /clear?status=something
 * 
 */
router.get('/clear', async(ctx, next) => {
    // A status must be specified
    if (!ctx.query.status) {
        return next(genError(400, 'No status was specified!'));
    }
    const status = ctx.query.status;

    ctx.body = await Status.removeStatus(status)
});

module.exports = router;