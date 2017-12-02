
var express = require('express')
  , routes = require('./routes')
  , payment = require('./routes/payment')
    , success = require('./routes/successpay')
  ,  menu=require('./routes/menu')
  ,  login=require('./routes/login')
      ,  getcartid=require('./routes/getcartid')
  ,  cartid=require('./routes/createcartid')
  ,  cart=require('./routes/cart')
  , http = require('http')
  , path = require('path');
  var bodyParser=require('body-parser');
var expressSessions = require("express-session");
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSessions({
    secret: "project",
    resave: false,
    saveUninitialized: false,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000
}));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);


app.post('/', function(req, res) {
    passport.authenticate('login', function(err, user) {
        if(!user) {
        	console.log("CHECK: "+ user);
        	res.status(201).json({output:0});
        }
        else{
        req.session.user = user.username;
        console.log("Session initialised: "+req.session.user);
        //req.session.save();
        res.status(201).send({output:user.r});}

    })(req, res);
});
app.post('/login', login.login);
app.get('/logout', login.logout);
app.post('/createcartid', cartid.createcartid);
app.post('/getcartid', getcartid.usecart);
app.use('/menu', menu.menus);
app.use('/addToCart', menu.addToCart);
app.use('/deleteFromCart', menu.deleteFromCart);
app.use('/confirmOrder', menu.confirmOrder);

app.use('/payment', payment.payment);
app.post('/successpay', success.success);
app.post('/cart', cart.cart);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
