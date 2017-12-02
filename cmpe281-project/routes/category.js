var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://34.215.212.195:27017,35.166.169.211:27017,52.38.136.191:27017/project281?replicaSet=rs0";


function check(req,res,int order_item_id){
console.log(id);
    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('product_catalogue');
        var categ_id = -1;

        // Finding the category id associated to the product id
        coll.find({product_id : order_item_id}, function(err, cat){
            if(cat){
                categ_id = cat.category_id;
            }
            else {
            	res.render('error.ejs');
            }
        }

        // Keeping a check to prevent the same item from getting recommended
        coll.find({category_id : categ_id}, function(err, cat){
            if (cat) {
                for (item in cat) {
                    if (item.product_id != order_item_id) {
                        console.log("You may like: " + item.product_name);
           	            res.render("category", {item: JSON.stringify(item.product_name)});
                        break;
                     }
                }
            }
            else {
            	res.render('error.ejs');
            }
        });
    });
}
