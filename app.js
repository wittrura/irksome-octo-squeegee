var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlEncode = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

var cities = {
	'Lotopia': 'the lovely land of lotopia', 
	'Capsiana': 'the crazy castle of caspiana', 
	'Indigo': 'the indiginous island of indigo'
	};

app.get('/cities', function(request, response){
	response.json(Object.keys(cities));
});


app.post('/cities', urlEncode, function(request, response){
	var newCity = request.body;
	cities[newCity.name] = newCity.description;
	response.status(201).json(newCity.name);
});

module.exports = app;
