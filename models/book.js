var mongoose=require("mongoose");

var bookSchema= new mongoose.Schema({
    name: String,
    author:String,
    image:{type:String, default:"placeholder.jpeg"},
    genre: String,
    released:Date,
    review:String,
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }]
});

module.exports=mongoose.model("Book",bookSchema);