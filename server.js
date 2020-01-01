var fetch = require('node-fetch');
var express = require('express');
var fs = require('fs');

var app = express();

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", '3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/getAutoC', function (req, res) {
	let json_got = req.query;
    console.log(json_got.AutoC);
	fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+json_got.AutoC+'&types=(cities)&language=en&key=**********************')
		.then(res => res.json())
		.then(json => res.send(json));
	console.log("get AutoComplete");
});

app.get('/getWeather', function (req, res) {
    let json_got = req.query;
    console.log(json_got.lat, json_got.lon);
	fetch('https://api.darksky.net/forecast/**********************/'+json_got.lat+','+json_got.lon)
		.then(res => res.json())
		.then(json => res.send(json));
	console.log("get Weather");
});

app.get('/getLocFromAddr', function (req, res) {
    let json_got = req.query;
    console.log(json_got.street, json_got.city, json_got.state);
	fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+json_got.street+','+json_got.city+','+json_got.state+'&key=**********************')
		.then(res => res.json())
		.then(json => res.send(json));
	console.log("get Addr");
});

app.get('/getStateSeal', function (req, res) {
    let json_got = req.query;
    console.log(json_got.state_name);
	fetch('https://www.googleapis.com/customsearch/v1?q='+json_got.state_name+'%20State%20Seal&cx=004584974261269266904:noymrbfhuee&imgSize=huge&imgType=news&num=1&searchType=image&key=**********************')
		.then(res => res.json())
		.then(json => res.send(json));
	console.log("get State Seal");
});

app.get('/getDailyWeather', function (req, res) {
    let json_got = req.query;
    console.log(json_got.lat);
	fetch('https://api.darksky.net/forecast/**********************/'+json_got.lat+','+json_got.lon+','+json_got.time)
		.then(res => res.json())
		.then(json => res.send(json));
	console.log("get Daily Weather");
});

var server = app.listen(8080, function () {
 
    var host = server.address().address;
    var port = server.address().port;
   
    console.log("Server now run on: http://%s:%s", host, port);
   
});