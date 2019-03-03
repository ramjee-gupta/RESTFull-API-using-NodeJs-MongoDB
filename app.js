//jshint esversion:6

const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/articleDB', {
  useNewUrlParser: true
});

const dbSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", dbSchema);

//////////////////////////////// targeting all articles ///////////////////////////

app.route("/articles").get( (err, res) => {

  Article.countDocuments( (err, count) => {

    if(!err){
      if(count > 0){

        Article.find( (err, foundArticles) => {

          if(!err){
            console.log("result"+foundArticles);
            res.send(foundArticles);
          }else{
            console.log(err);
          }
        });
      }else{
        console.log("No articles found!");
      }
    }else{
      console.log(err);
    }
  });
})

.post( (req, res ) => {

  const newArticle = new Article ( {

     title : req.body.title,
     content : req.body.content


  });

  newArticle.save( (err) => {

    if(!err){
      console.log("Success");
      res.send("<h5> Success </h5>");
    }else{
      console.log(err);
      res.send("<h5> Something went wrong </h5>");
    }
  });
})

.put( (err, res) => {

  Article.update( (err) => {

  });

})
.delete( (err, res) => {
  Article.deleteMany( (err) => {
    if(!err){
      console.log("deleted all the articles");
      res.send("deleted all the articles");
    }else{
      console.log(err);
      res.send("deleted all the articles");
    }
  });
});

////////////////////////// targeting a specific articles ///////////////////////////////

app.route("/articles/:articleTitle")

.get( (req, res) => {

  Article.findOne( {title : req.params.articleTitle}, (err, foundArticle) => {
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No article found");
    }
  });
})

.delete((req, res) => {

  Article.deleteOne( { title : req.params.articleTitle}, (err, result) => {
    if(!err){
      res.send("Article has been deleted" );
    }else{
      res.send(err);
    }
  });
})

.put( (req, res) => {

  Article.update(
    {title: req.params.articleTitle},
    {title : req.body.title, content: req.body.content}, //{$set : req.body},
    {overwrite: true},
    (err) => {

    if(!err){
      res.send("Updated successfully!");
    }
  });
})

.patch( ( req, res) => {
  Article.update(
    {title: req.params.articleTitle},
    {$set : req.body},
    (err) => {

    if(!err){
      res.send("Updated successfully!");
    }
  });

});


app.listen(3000, () => {
  console.log("Server has started at port 3000");
});
