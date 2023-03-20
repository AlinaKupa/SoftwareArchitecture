const { ObjectId } = require('mongodb');
const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const jsonParser = express.json();

const mongoClient = new MongoClient("mongodb://root:mypassword@127.0.0.1:27017/", { useUnifiedTopology: true });

let dbClient;

app.use(express.static(__dirname + "/public"));

mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("world").collection("countries");
    app.listen(3000, function(){
        console.log("Server is waiting for a connection");
    });
});

app.get("/api/countries", function(req, res){
    const collection = req.app.locals.collection;
    collection.find({}).toArray(function(err, countries){
        if(err) return console.log(err);
        res.send(countries)
    }); 
});

app.get("/api/countries/:id", function(req, res){
    const id = new ObjectId(req.params.id);
    if (!ObjectId.isValid(id)) {
        return res.status(400).send({error: "Invalid ObjectID"});
    }

    const collection = req.app.locals.collection;
    collection.findOne({_id: id}, function(err, country){               
        if(err) return console.log(err);
        res.send(country);
    });
});

app.post("/api/countries", jsonParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
       
    const countryName = req.body.country;
    const capitalName = req.body.capital;
    const population = req.body.population;
    const country = {country: countryName, capital: capitalName, population: population};
       
    const collection = req.app.locals.collection;
    collection.insertOne(country, function(err, result){
        if(err) return console.log(err);
        res.send(country);
    });
});

app.delete("/api/countries/:id", function(req, res){
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(400).send({error: "Invalid ObjectID"});
    }

    const collection = req.app.locals.collection;
    collection.findOneAndDelete({_id: new ObjectId(id)}, function(err, result){
        if(err) return console.log(err);    
        res.sendStatus(204);
    });
});

app.put("/api/countries", jsonParser, function(req, res){
    if(!req.body) return res.sendStatus(400);
    
    const id = new ObjectId(req.body.id);
    const countryName = req.body.country;
    const capitalName = req.body.capital;
    const population = req.body.population;
       
    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({_id: id}, { $set: {population: population, capital: capitalName, country: countryName}},
        {returnDocument: "after"}, function(err, result){
            if(err) return console.log(err);
            const updatedCountry = result.value;
            res.send(updatedCountry);
    });
});
 
// Ctrl+C
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});


