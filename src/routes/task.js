"use strict";

var taskHandler = require('src/handlers/task');
var taskValidate = require('src/validate/task');

module.exports = function() {
	return [
		{
			method: 'GET',
			path: '/tasks/{task_id}',
			config: {
				handler: taskHandler.findByID,
				validate: taskValidate.findByID
			}
		},
		{
			method: 'GET',
			path: '/tasks',
			config: {
				handler: taskHandler.find,
				validate: taskValidate.find
			}
		},
		{
			method: 'POST',
			path: '/tasks',
			config: {
				handler: taskHandler.insert,
				validate: taskValidate.insert
			}
		},
		{
			method: 'PUT',
			path: '/tasks/{task_id}',
			config: {
				handler: taskHandler.update,
				validate: taskValidate.update
			}
		},
		{
			method: 'DELETE',
			path: '/tasks/{task_id}',
			config: {
				handler: taskHandler.delete,
				validate: taskValidate.delete
			}
		}
	];
}();