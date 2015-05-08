"use strict";

var _ = require('underscore');
var Joi = require('joi');

var models = require('src/models');

function TaskValidate(){};
TaskValidate.prototype = (function() {

	return {
		findByID: {
			params: (function params() {
				var taskSchema = new models.Task().schema;

				return {
					taskId: taskSchema.taskId.required()
				};
			})()
		},
		find: {
			query: (function query() {
				var taskSchema = new models.Task().schema;
				return {
					description: taskSchema.description,
					perPage: Joi.number().integer(),
					page: Joi.number().integer()
				};
			})()
		},
		insert: {
			payload: (function payload() {
				var taskSchema = new models.Task().schema;
				return {
					description: taskSchema.description.required()
				};
			})()
		},
		update: (function update() {
			var taskSchema = new models.Task().schema;
			return {
				params: {
					taskId: taskSchema.taskId.required()
				},
				payload: {
					description: taskSchema.description.required()
				}
			}
		})(),
		delete: {
			params: (function params() {
				var taskSchema = new models.Task().schema;
				return {
					taskId: taskSchema.taskId.required()
				};
			})()
		}
	};
})();

var taskValidate = new TaskValidate();
module.exports = taskValidate;