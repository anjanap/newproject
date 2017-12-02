
var ejs = require("ejs");
var mongo = require("./mongo");
var mongoM = require('./mongoM');
var mongoP = require('./mongoP');
//var mongoProduct = "mongodb://13.57.119.118:27017,52.52.150.229:27017,52.8.128.10:27017/project281?replicaSet=rs0";
var mongoProduct ="mongodb://34.215.212.195:27017,35.166.169.211:27017,52.38.136.191:27017/project281?replicaSet=rs0";
var mongoUser_Cart="mongodb://34.215.212.195:27017,35.166.169.211:27017,52.38.136.191:27017/project281?replicaSet=rs0";
var mongoOrder = "mongodb://34.215.212.195:27017,35.166.169.211:27017,52.38.136.191:27017/project281?replicaSet=rs0";

var ObjectId = require('mongodb').ObjectID;
var cartItems=[];
var cart = require("./cart");
var menu1=[], menu2=[], menu3=[], menu4=[], menuFinal=[], total=0.00,cid=0,uid=0, suggestedItems=[];



function menus(req,res){
	console.log("HELLO");
	cid=req.param("cartid");
	uid=req.param("uid");
	console.log("UID: "+uid+" CID: "+cid);
	mongo.connect(mongoProduct, function(){
		console.log('Connected to mongo at: ' + mongoProduct);
		var coll = mongo.collection('product_catalog');
		menu1=[], menu2=[], menu3=[], menu4=[], menuFinal=[], cartItems=[], total=0.00
		coll.find().toArray(function(err, menu){
			if (menu) {
				//console.log("USER: "+user.name+" College:"+user.college);

				menuFinal=menu;

				menu.forEach(function(item) {
					if(item.category_id==1){
						menu1.push(item);
					}
					if(item.category_id==2){
						menu2.push(item);
					}
					if(item.category_id==3){
						menu3.push(item);
					}
					if(item.category_id==4){
						menu4.push(item);
					}

				});
				console.log("CID: "+cid);
				res.render('menu.ejs', {menu1:menu1,menu2:menu2,menu3:menu3,menu4:menu4, cartItems:cartItems,total:total, suggestedItems:suggestedItems });
			} else {
				res.render('error.ejs');
			}
		});
	});
}

function addToCart(req,res){

	var product_id = req.query.product_id;
	var category_id = req.query.category_id;

	suggestedItems=[];

	menuFinal.forEach(function(item) {
		if(item.product_id==product_id){

			if(item.quantity===undefined||item.quantity==0){
				item.quantity=1;
				cartItems.push(item);
			}else{
				item.quantity=item.quantity+1;
			}

			total=total+item.price;
		}

		if(item.category_id==category_id){
		var foundIncart=false;
			for(var i=0;i<cartItems.length;i++){

				if(cartItems[i].product_id==item.product_id){
					foundIncart=true;
				}

			}
			if(!foundIncart)
			{suggestedItems.push(item);}
			}

	});


	console.log("SUGGESTIONS: "+suggestedItems);
	res.render('menu.ejs', {menu1:menu1,menu2:menu2,menu3:menu3,menu4:menu4, cartItems:cartItems, total:total, suggestedItems:suggestedItems });

}

function deleteFromCart(req,res){
	var product_id = req.query.product_id;

	for(var i=0;i<cartItems.length;i++){
		 if (cartItems[i].product_id == product_id) {
			 total=total-cartItems[i].price*cartItems[i].quantity;
			 cartItems[i].quantity=0;
	          cartItems.splice(i, 1);

	        }
	}
	console.log("CID: "+cid);
	res.render('menu.ejs', {menu1:menu1,menu2:menu2,menu3:menu3,menu4:menu4, cartItems:cartItems, total:total, suggestedItems:suggestedItems });

}


function confirmOrder(req,res){
  cart.cart(cartItems,uid,cid);
	var ty='';
console.log("BACK IN MENUJS");
mongoM.connect(mongoUser_Cart, function(){
	var usercol = mongoM.collection('user_details');
	var cartcol = mongoM.collection('cart_details');
	usercol.findOne({ _id: ObjectId(uid) }, function(err,user){
		if (user) {
			ty=user.flag;
			console.log("FLAG CHECK: "+ty);
			if(ty==0){
				cartcol.findOne({cart_id:Number(cid)},function(er,t){
				console.log("TOTAL:-------"+t.total);
				mongoP.connect(mongoUser_Cart, function(){
					var useritems=mongoP.collection('user_order');
					var prod_names=[];
					useritems.find({ cart_id:Number(cid)}).toArray(function(err,items){
						var names=[];
						if(items){
							for(var i=0;i<items.length;i++){
							console.log("CART ITEM: "+items[i].product_names);
							//for(var j=0;j<(items[i].product_names).length;j++)
									names.push(items[i].product_names);
						}//for items
						console.log("Names: "+names);
						res.render('payment.ejs',{uid:uid,cid:cid,total: t.total,itemslist:names});
					}//if
				});//useritems

				});//mongoP
				});//cartcol
		}//if
			else
			res.render('cart.ejs');
		}
	});

});
}

exports.menus=menus;
exports.addToCart=addToCart;
exports.deleteFromCart=deleteFromCart;
exports.confirmOrder=confirmOrder;
