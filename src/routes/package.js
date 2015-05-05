"use strict";

var Hapi = require('hapi');
var packageHandler = require('src/handlers/package');
var packageValidate = require('src/validate/package');

module.exports = function() {
	return [
		{
			method: 'POST',
			path: '/package/upload',

			config: {
				handler: packageHandler.upload,
				payload: {
		            output: 'stream',
		            parse: false,
		            allow: 'multipart/form-data'
		      	}
			}
		}
	];
}();