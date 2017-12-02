var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  user_id:{
    type:Number,
    required:true,
  },
  firstname:{
    type:String,
    required:true,
  },
  lastname:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
  },
  password:{
    type:String,
    required:true,
  }
})

module.exports = mongoose.model('User', userSchema);
