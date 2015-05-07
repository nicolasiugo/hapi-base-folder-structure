"use strict";

var taskHandler = require('src/handlers/task');
var taskValidate = require('src/validate/task');

module.exports = function() {
	return [
		{
			method: 'GET',
			path: '/tasks/{taskId}',
			handler: taskHandler.findByID,
			config: {
				validate: taskValidate.findByID,
				auth: 'simple'
			}
		},
		{
			method: 'GET',
			path: '/tasks',
			handler: taskHandler.find,
			config: {
				validate: taskValidate.find,
				auth: 'simple'
			}
		},
		{
			method: 'POST',
			path: '/tasks',
			handler: taskHandler.insert,
			config: {
				validate: taskValidate.insert,
				auth: 'simple'
			}
		},
		{
			method: 'PUT',
			path: '/tasks/{taskId}',
			handler: taskHandler.update,
			config: {
				validate: taskValidate.update,
				auth: 'simple'
			}
		},
		{
			method: 'DELETE',
			path: '/tasks/{taskId}',
			handler: taskHandler.delete,
			config: {
				validate: taskValidate.delete,
				auth: 'simple'
			}
		}
	];
}();