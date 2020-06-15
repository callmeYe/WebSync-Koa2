const Koa = require('koa');
const path = require('path')
const http = require('http');
const static = require('koa-static')

const mongoose = require('mongoose');

const app = new Koa();
const server = http.createServer(app.callback());
const io = require('socket.io')(server);
const port = parseInt(process.env.PORT || '3000', 10);

mongoose.set('useNewUrlParser',true)
mongoose.set('useUnifiedTopology',true);
mongoose.set('useCreateIndex',true)
mongoose.connect('mongodb://localhost/WebSync');
const db = mongoose.connection;

server.on('error',onError);
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
    console.log('db is connected!')
})

app.use(static(
    path.join( __dirname, './public')
))

const indexRouter = require('./routes/demo')
const socketRouter = require('./routes/socket');
const statusRouter = require('./routes/status')

// logger:
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time:
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// reponse：
app.use(indexRouter.routes(),indexRouter.allowedMethods())
app.use(statusRouter.routes(),statusRouter.allowedMethods())

socketRouter.setIO(io);
io.on('connection', function (socket) {
    console.log('client is connected')
    socketRouter.register(socket);
});

// Listen on port 3000:
server.listen(port, () => {
    console.log('app started at port 3000...');
})


function onError(err,ctx){
    log.error('server error',err,ctx)
}
