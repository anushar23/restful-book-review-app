var express=require("express"),
mongoose=require("mongoose");
bodyParser=require("body-parser"),
override=require("method-override");

var app=express();
mongoose.connect("mongodb://localhost:27017/restful-books-app", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.use(override("_method"));
app.set("view engine","ejs");

var Book=require("./models/book"),
Comment=require("./models/comment")




// Book.create({name:"Intro to mankind",
//             author:"Robert Scinda",
//             image:"https://images.unsplash.com/photo-1490633874781-1c63cc424610?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b51259a5ff31138ff0059b896e2a2af3&auto=format&fit=crop&w=500&q=60",
//             genre:"Non fiction",
//              review:"an amazing book. great insights, prespectices.Could have condensed it a bit.Overall 4/5"
//           });
           


app.get("/",function(req, res) {
    res.redirect("/books");
})

//INDEX ROUTE-diaplaying all books
app.get("/books",function(req,res){
    Book.find({},function(err,allBooks){
        if(err){
            res.redirect("/books");
        }
        else{
                res.render("index",{books:allBooks});
        }
    });
    
});

//NEW ROUTE to display form to add new book
app.get("/books/new",function(req, res) {
    res.render("book/new");
});

//CREATE ROUTE to receive form details from new route and add to db and redirect to index route
app.post("/books",function(req,res){
    var newBook=req.body.book;
    Book.create(newBook,function(err,newlyAdded){
        if(err){
            console.log(err);
            res.render("book/new");
        }
        else{
            res.redirect("/books");
        }
    });
});


//SHOW ROUTE to show the details of the clicked item using its id to identify the clicked one
app.get("/books/:id",function(req, res) {
    Book.findById(req.params.id).populate("comments").exec(function(err,found){
        if(err){
            res.redirect("/books");
        }
        else{
                res.render("book/show",{book:found});

        }
    
});
});

//===================
//COMMENT ROUTES 
//==================

//NEW route
app.get("/books/:id/comments/new",function(req, res) {
    Book.findById(req.params.id,function(err, found) {
        if(err){
            
        }
        else{
                res.render("comment/new",{book:found});

        }
    })
    
    
})

//CREATE route
// app.post("/books/:id/comments",function(req,res){
//     Book.findById(req.params.id,function(err, found) {
//         if(err){
//             console.log(err)
//         }
//         else{
//             Comment.create(req.body.comment,function(err,comment){
//                 if(err){
//                     console.log(err)
//                 }
//                 else{
//                     found.comments.push(comment);
//                     found.save();
//                     res.redirect("/books/"+found._id);
//                 }
//             })
//         }
//     })
   
// })

app.post("/books/:id/comments",function(req,res){
		Book.findById(req.params.id,function(err, foundCamp) {
		    if(err){
		    	console.log(err)
		    }
		    else{
		    	Comment.create(req.body.comment,function(err,createdComment){
		    		if(err){
		    			console.log(err)
		    		}
		    		else{
		    				foundCamp.comments.push(createdComment)
		    				foundCamp.save()
		    				res.redirect("/books/"+foundCamp._id)
		    		}
		    	})
		    
		    }
		})
})


//===================
//END COMMENT ROUTES
//======================

//EDIT route to render edit form which inturen submits to UPDATE route path
app.get("/books/:id/edit",function(req, res) {
    Book.findById(req.params.id,function(err,found){
        if(err){
            res.render("edit");
        }
        else{
            res.render("book/edit",{book:found});
        }
    })

})

//UPDATE route to take the entries from edit form and save in db and redirect to SHOW route
app.put("/books/:id",function(req,res){
    Book.findByIdAndUpdate(req.params.id,req.body.book,function(err,updatedBook){
        if(err){
            res.redirect("/books");
        }
        else{
            res.redirect("/books/"+updatedBook._id);
        }
    })
})

//DELETe route
app.delete("/books/:id",function(req,res){
    Book.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/books/"+req.params.id);
        }
        else{
            res.redirect("/books");
        }
    })
})





app.listen(process.env.PORT,process.env.IP,function(){
    console.log("books review app started");
});