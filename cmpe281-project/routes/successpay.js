var ejs = require("ejs");
var mongo = require("./mongo");
var mongoPayment = "mongodb://34.215.212.195:27017,35.166.169.211:27017,52.38.136.191:27017/project281?replicaSet=rs0";
var mongoM = require("./mongoM");
var mongoUser_Cart = "mongodb://34.215.212.195:27017,35.166.169.211:27017,52.38.136.191:27017/project281?replicaSet=rs0";
var ObjectId = require('mongodb').ObjectID;

function updatestatus(req,res){
	var mode=req.param("mode");
	var cnumber=req.param("cardno");
	var uid=req.param("uid");
	var cid=Number(req.param("cid"));
	var newbill={user_id: uid,mode:mode,card_num:cnumber,cart_id:cid};
console.log(mode+cnumber);
    mongo.connect(mongoPayment, function(){
        console.log('Connected to mongo at: ' + mongoPayment);
        var col1 = mongo.collection('payment');
        col1.insertOne(newbill, function(err, rest) {
            if (err) throw err;
            else{
							mongoM.connect(mongoUser_Cart, function(){
                var col2 = mongoM.collection('cart_details');
               console.log("QUERY CHECK: "+cid);
                col2.updateOne({"cart_id":cid}, {"$set":{"status": "closed"}}, function(err, results){
									console.log("CHECK UPDATE:---> "+results);
                    if (results) {
                        console.log("1 document inserted");
                        res.render('successpay.ejs');
                    } else {
                    	res.render('error.ejs');
                    }
                });
});
            }
            });

    });
}


exports.success=updatestatus;
