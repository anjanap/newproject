var ejs = require('ejs');
var mongo = require('./mongo');
var mongoM = require('./mongoM');
var ObjectId = require('mongodb').ObjectID;
//var mongoProduct = 'mongodb://34.215.109.198:27017/trial';
var mongoProduct = "mongodb://34.215.212.195:27017,35.166.169.211:27017,52.38.136.191:27017/project281?replicaSet=rs0";
var mongoCart="mongodb://34.215.212.195:27017,35.166.169.211:27017,52.38.136.191:27017/project281?replicaSet=rs0";
var mongoOrder = "mongodb://34.215.212.195:27017,35.166.169.211:27017,52.38.136.191:27017/project281?replicaSet=rs0";

function cart(cart_details,uid,cartid) {
  var cid=Number(cartid);
  console.log('cart entered');
  var product_col;
  var prod=[],names=[], userType='';

  var userDetails_col;
  //console.log("CHECK QUANTITY: "+cart_details[0].quantity);
  mongo.connect(mongoProduct, function() {
    console.log('Connected to mongo at: ' + mongoProduct);
    product_col = mongo.collection('product_catalog');

    var total = 0;
    var product;

    for(i=0;i<cart_details.length;i++){
      total+= cart_details[i].price * cart_details[i].quantity;
    }

    mongoM.connect(mongoCart, function() {
      var cart_col = mongoM.collection('cart_details');
      console.log("CHECK CID: "+cid);
    cart_col.findOne({cart_id:cid},function(er,t){
      var temp=Number(t.total);
      temp+=total
      console.log("CHECK TOTAL: "+temp);
      cart_col.update(
        {cart_id:cid},{$set:{total:temp}},
        function(err, user) {
          if (user) {
            console.log('successful insertion of total');
          } else {
            console.log('ERROR');
          }
        });

    });//find one
    });
    //insert the details into user_order collection

    for(var i=0;i<cart_details.length;i++)
    {
      prod.push(cart_details[i].product_id);
      names.push(cart_details[i].product_name);
    }

  mongo.connect(mongoOrder, function() {
    var userOrder_col = mongo.collection('user_order');
    userOrder_col.insert({multiuser_id: uid,cart_id: cid,product_id: prod,product_names:names,total:total},
      function(err, results) {
        if (results) {
          console.log('successful insertion in user order');
          return;
        } else {
          console.log('Failed insertion');
          return;
        }
      }
    );//userOrder
  });//mongoOrder

  }); //mongo product

}//function
exports.cart = cart;
