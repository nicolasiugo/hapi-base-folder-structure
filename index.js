"use strict";

var Hapi = require('hapi');
var constants = require('src/config/constants.js');
var basicAuth = require('src/middleware/basic-auth');
var routes = require('src/routes');
var _ = require('underscore');

var options = {
	state: {
		cookies: {
			strictHeader: false
		}
	}
};

var host = constants.application['host'];
var port = constants.application['port'];

var server = new Hapi.Server();
server.connection({ host: host, port: port });

server.register(require('hapi-auth-basic'), function(err) {
 
    server.auth.strategy('simple', 'basic', { validateFunc: basicAuth });
});

server.ext('onRequest', function(request, reply) {

   	request.plugins.createHandlerParams = function(requestParams) {
		var params = _.clone(requestParams);
		params.userId = request.auth.credentials.userId;
		return params;
	};
    return reply.continue();
});

// Add all the routes within the routes folder
for (var route in routes) {
	server.route(routes[route]);
}

module.exports = server;

if (process.env.NODE_ENV !== 'test') {
	server.start();

	console.log('Server running in port #' + port);
}