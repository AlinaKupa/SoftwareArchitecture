const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const countryName = { type: String, required: true };
const capitalName = { type: String, required: true };
const population = { type: Number, required: true };

const countryScheme = new Schema({ country: countryName, capital: capitalName, population: population}, { versionKey: false });
const Country = mongoose.model("Country", countryScheme);
//const World = mongoose.model("World", worldScheme);

app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://root:mypassword@127.0.0.1:27017/world", { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, function (err) {
    if (err) return console.log(err);
    
    app.listen(3000, function () {
        console.log("Server is waiting for a connection");
    });
});


app.get("/api/countries", function (req, res) {

    Country.find({}, function (err, countries) {

        if (err) return console.log(err);
        res.send(countries)
    });
});

app.get("/api/countries/:id", function (req, res) {

    const id = req.params.id;
    Country.findOne({ _id: id }, function (err, country) {

        if (err) return console.log(err);
        res.send(country);
    });
});

app.post("/api/countries", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const countryName = req.body.country;
    const capitalName = req.body.capital;
    const population = req.body.population;
    const country = new Country ({country: countryName, capital: capitalName, population: population});
    country.save(function (err) {
        if (err) return console.log(err);
        res.send(country);
    });
});

app.delete("/api/countries/:id", function (req, res) {

    const id = req.params.id;
    Country.findByIdAndDelete(id, function (err, country) {

        if (err) return console.log(err);
        res.send(country);
    });
});

app.put("/api/countries", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const countryName = req.body.country;
    const capitalName = req.body.capital;
    const population = req.body.population;
    const newCountry = {population: population, capital: capitalName, country: countryName};

    Country.findOneAndUpdate({ _id: id }, newCountry, { new: true }, function (err, country) {
        if (err) return console.log(err);
        res.send(country);
    });
});
