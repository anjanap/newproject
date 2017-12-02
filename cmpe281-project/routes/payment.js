var ejs = require("ejs");
var mongo = require("./mongo");
var mongoPayment = "mongodb://34.215.212.195:27017,35.166.169.211:27017,52.38.136.191:27017/project281?replicaSet=rs0";

var user='',cart='',type='';
function check(req,res){

}

function getUser(uid,cid,type){

}

exports.payment=check;
exports.getUser=getUser;
