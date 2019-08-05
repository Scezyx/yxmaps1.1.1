var Koa=require('koa'),
    app=new Koa(),
    router = require('koa-router')(),
    db = require('./db.js'), 
    sql ="",
    params={},
    i=2,
    path=require('path'),
    bodyParser = require('koa-bodyparser'),
    render = require('koa-art-template');   
const session = require('koa-session');
const static = require('koa-static');
app.use(bodyParser());
render(app, {
    root: path.join(__dirname, 'view'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
  });

app.use(static(__dirname + "/static"));

const CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false, 
};
app.use(session(CONFIG, app));

app.use(static(__dirname + '/static'));


router.get("/login",async(ctx)=>{
    console.log(1);
    await ctx.render('login');
})
router.post('/doLogin',async(ctx)=>{
    console.log(2);
    console.log(user);
    const user = JSON.parse(ctx.request.body);
    sql="select id,username,password,sex,type from user where ?";
    params={username:user.username,password:user.password};
    db.query(sql,params,(error, results, fields)=>{
        if (error) throw error;
        console.log(results);
    });
    console.log(3);
    ctx.session.userinfo=user;
    await ctx.render('index',()=>{
        userinfo:ctx.session.userinfo;
    });
})

router.get("/index",async(ctx)=>{
    await ctx.render('index');
})

router.get("/register",async(ctx)=>{
    await ctx.render('register');
})
router.post("/doRegister",async(ctx)=>{
    console.log(ctx.request.body);
    ctx.session.userinfo=ctx.request.body;
    await ctx.render('login',()=>{
        userinfo:ctx.session.userinfo;
    });
})

router.get("/reg",async(ctx)=>{
    await ctx.render('reg');
})

router.get("/dingdan",async(ctx)=>{
    await ctx.render('dingdan');
})

router.get("/forget_password",async(ctx)=>{
    await ctx.render('forget_password');
})

router.get("/qianbao",async(ctx)=>{
    console.log(1);
    await ctx.render('qianbao');
})
app.use(router.routes())
   .use(router.allowedMethods());
app.listen(9990);