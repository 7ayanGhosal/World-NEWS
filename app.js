var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


var category = ["business" ,"entertainment" ,"general","health" ,"science" ,"sports","technology"];
var country = ["ae", "ar", "at", "au", "be", "bg", "br", "ca", "ch", "cn", "co", "cu", "cz", "de", "eg", "fr", "gb", "gr", "hk", "hu", "id", "ie", "il", "in", "it", "jp", "kr", "lt", "lv", "ma", "mx", "my", "ng", "nl", "no", "nz", "ph", "pl", "pt", "ro", "rs", "ru", "sa", "se", "sg", "si", "sk", "th", "tr", "tw", "ua", "us", "ve", "za"];
app.get('/', function(req, res){
    var sourceURL = "http://newsapi.org/v2/sources?apiKey=d7f49b9bbcd84719bdc7c0a5cc5b1a03";
    var searchURL = "http://newsapi.org/v2/top-headlines?country=in&apiKey=d7f49b9bbcd84719bdc7c0a5cc5b1a03"; //top headlines
    request(sourceURL,function(err, response, body){
        if(!err && response.statusCode == 200){
            var data_sources = JSON.parse(body);
            //we got sources now search for top
            request(searchURL,function(err, response, body){
                console.log(response.statusCode);
                if(!err && response.statusCode == 200){
                    var data = JSON.parse(body);
                    if(data.totalResults == 0){
                        res.send("OOPS!! No search result found!");
                    }
                    else
                        res.render("home.ejs",{sources: data_sources.sources, articles: data.articles, categories: category, countries:country})
                }
                else if(response.statusCode == 400){
                    res.send("Status:400 , wrong input!");
                }
            });
        }
    });
})

app.get('/search', function(req, res){
    var searchURL = "http://newsapi.org/v2/top-headlines?apiKey=d7f49b9bbcd84719bdc7c0a5cc5b1a03";
    if(req.query.q){
        searchURL += "&q="+ req.query.q;
    }
    if(req.query.sources){
        // SOURCES PROVIDED
        var sources = req.query.sources;
        searchURL += "&sources=";
        if(typeof sources == "string")
            searchURL += sources +",";
        else
            sources.forEach((source)=>{
                searchURL += source +",";
            }) 
    }else{
        // SOURCES NOT PROVIDED
        var country  = req.query.country;
        var category = req.query.category;
        if(country){
            searchURL += "&country="+country;
        }
        if(category){
            searchURL += "&category="+category;
        }
    }
    //handle case if search is empty , redirect to home
    if(!req.query.q && !req.query.sources && req.query.country && req.query.category){
        res.redirect("/");
    }else{
        // RENDER THE RESULT
        request(searchURL,function(err, response, body){
            if(!err && response.statusCode == 200){
                var data = JSON.parse(body);
                if(data.totalResults == 0){
                    res.send("OOPS!! No search result found!");
                }
                else
                    res.render("search.ejs",{articles: data.articles})
            }
            else {
                res.redirect("/");
            }
        });
    }
});

app.listen(process.env.PORT||3000, process.env.IP, function(){
    console.log("server started");
})