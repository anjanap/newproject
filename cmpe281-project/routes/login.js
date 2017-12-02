var ejs = require("ejs");
var mongo = require("./mongo");
var mongoUser_Cart = "mongodb://34.215.212.195:27017,35.166.169.211:27017,52.38.136.191:27017/project281?replicaSet=rs0";
function check(req,res){
  var username,password;
username=req.param("username");
password=req.param("password");
console.log("USERNAME: "+username);
    mongo.connect(mongoUser_Cart, function(){
        console.log('Connected to mongo at: ' + mongoUser_Cart);
        var col1 = mongo.collection('user_details');

        col1.findOne({email: username,password:password}, function(err, user){
          console.log("USER:  "+user._id);
            if (user) {

              var col2 = mongo.collection('cart_details');
              var x=(user._id).toString();
              col2.find({user_id: x,status: 'open'}).toArray(function(err,cart){
           	res.render('home.ejs',{ uid: user._id,carts:cart});
          })
        }
           else {
            	res.render('error.ejs');
            }
        });//query


  });//mongo

}//function

function logout(req,res){
  console.log('Session Destroyed');
  res.render('index.ejs');
}//function


exports.login=check;
exports.logout=logout;
