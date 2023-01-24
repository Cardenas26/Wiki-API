const ejs=require("ejs");
const bodyParser=require("body-parser");
const express=require("express");
const mongoose=require("mongoose");


const app=express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));




mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser:true});


const articleSchema={
    title:String,
    content:String
};
const Article = mongoose.model("Article",articleSchema);

//Targeting all articles//

app.route("/articles")

.get(function(req,res){
    Article.find(function(err,foundArticles){
        if(!err){res.send(foundArticles);

        }else{
            res.send(err);
        }
        
    });
})

.post(function(req, res ){
    console.log();
    console.log();

    const newArticle= new Article({
        title: req.body.title,
        content:req.body.content

    });
    newArticle.save(function(err){
        if(!err){
            res.send("Sucessfully added new article.");
        } else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteMany(function(err){
     if (!err){
         res.send("Successfully deleted all articles.");
     } else{
         res.send(err);
     }
    });
 });



 // Targeting a specific article//
 app.route("/articles/:articleTitle")
 .get(function(req,res){
    
Article.findOne({title:req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle){
        res.send(foundArticle);
    } else {
        res.send("No article matching that title was found.");
    }
});
 })
 
 .put(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        {overwrite:true},
        function(err){
            if(!err){res.send("Updated Article");
        }
    }

    
        
 );
      
 })


 .patch(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {$set:req.body},
        function(err){
            if(!err){
                res.send("succesfully updated article.")
            }else{
                res.send(err);
            }
        }

    );
 })


 .delete(function(req,res){
    Article.deleteOne({
        title:req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Sucessfully deleted article.")
            }else{
                res.send(err);
            }
        }
    );
 });

app.listen(3000,function(){
    console.log("server Started on port 3000");
});
