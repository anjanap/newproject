var mongo = require("./mongo");
var ejs = require("ejs");
var mongoCartDetails = "mongodb://34.215.212.195:27017,35.166.169.211:27017,52.38.136.191:27017/project281?replicaSet=rs0";
function usecart(req,res){
var cid=req.param("cartid");
mongo.connect(mongoCartDetails, function(){
           console.log('Connected to mongo at: '+ mongoCartDetails);
           var coll = mongo.collection('cart_details');
           coll.find({cart_id:cid,status:'open'}, function(err,cart){
                      if(cart){
                                 console.log(cart.cart_id)
                                 res.render('menu.ejs',{cid:cid });
                      }else {
												//'menu.ejs',{cid:cid }("Cart does not exists");
                                 res.render('error.ejs');
                      }
           });//mongo
});//function
}



exports.usecart=usecart;
