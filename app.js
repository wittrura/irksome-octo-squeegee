var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlEncode = bodyParser.urlencoded({ extended: false });


app.use(express.static('public'));

// Redis connection
var redis = require('redis');
if (process.env.REDISTOGO_URL) {
	var rtg   = require("url").parse(process.env.REDISTOGO_URL);
	var client = redis.createClient(rtg.port, rtg.hostname);
	client.auth(rtg.auth.split(":")[1]);
} else {
	var client = redis.createClient();
	client.select((process.env.NODE_ENV || 'development').length);
}

// End Redis connection

client.hset('cities', 'Lotopia', 'the lovely land of lotopia');
client.hset('cities', 'Capsiana', 'the crazy castle of caspiana');
client.hset('cities', 'Indigo', 'the indiginous island of indigo');


app.get('/cities', function(request, response){
	client.hkeys('cities', function(error, names){
		if (error) throw error;	
		response.json(names);		
	});
});


app.post('/cities', urlEncode, function(request, response){
	var newCity = request.body;
	if(!newCity.name || !newCity.description){
		response.sendStatus(400);
		return false;
	}
	client.hset('cities', newCity.name, newCity.description, function(error){
		if (error) throw error;
		response.status(201).json(newCity.name);
	});

});

app.delete('/cities/:name', function(request, response){
	client.hdel('cities', request.params.name, function(error){
		if(error) throw error;
		response.sendStatus(204);
	});
});

app.get('/cities/:name', function(request, response){
	client.hget('cities', request.params.name, function(error, description){
		if (error) throw error;
		response.json(description);
	});
});

module.exports = app;
