"use strict";

var server = require('index');
var should = require('should');
var Q = require('q');

var taskModel = require('src/models/task');
var taskDAO = require('src/dao/task');

describe('Task routes', function(){
	var testTaskId;

	before(function(done) {
		var insert = Q.denodeify(taskDAO.insert);
		insert({ userId:1, description: 'Task from test'}).then(function insert(data) {

			testTaskId = data.insertId;
			done();
		}).catch(function(err) {
			done(err);
		});
	});

	after(function(done) {
		taskDAO.delete({ userId:1, taskId: testTaskId}, function(err, data) {

		    done(err);
		});
	});

	describe('GET /tasks', function(){
		var injectOptions = {
			method: 'GET',
			url: 'http://localhost:8000/tasks',
			credentials: {
				userId: 1
			}
		};

		it('should return statusCode 200', function(done){
			server.inject(injectOptions, function(res){
				res.statusCode.should.be.eql(200);

				var tsk = JSON.parse(res.payload);
				tsk.should.not.be.empty;
				
				done();
			});
		});
	});


	describe('GET /tasks/taskId', function(){
		var injectOptions = {
			method: 'GET',
			credentials: {
				userId: 1
			}
		};

		it('should return statusCode 404 when task not exists', function(done){
			injectOptions.url = 'http://localhost:8000/tasks/99999';
			server.inject(injectOptions, function(res){
				res.statusCode.should.be.eql(404);
				done();
			});
		});

		it('should return statusCode 200 when task exists', function(done){
			injectOptions.url = 'http://localhost:8000/tasks/' + testTaskId;

			server.inject(injectOptions, function(res){
				res.statusCode.should.be.eql(200);
				var tsk = JSON.parse(res.payload);
				tsk.should.have.property('taskId').which.is.a.Number.eql(testTaskId);
				tsk.should.have.property('description').eql('Task from test');
				done();
			});
		});
	});


	describe('POST /tasks', function(){
		var injectOptions = {
			method: 'POST',
			url: 'http://localhost:8000/tasks',
			payload: { description: 'Testing mocha'},
			credentials: {
				userId: 1
			}
		};

		it('should create a task', function(done){
			server.inject(injectOptions, function(res){
				res.statusCode.should.be.eql(201);
				var tsk = JSON.parse(res.payload);
				tsk.should.have.property('taskId').which.is.a.Number;
				tsk.should.have.property('description').eql('Testing mocha');
				done();
			});
		});
	});


	describe('DELETE /tasks', function(){
		var injectOptions = {
			method: 'DELETE',
			credentials: {
				userId: 1
			}
		};

		it('should delete a task', function(done){
			injectOptions.url = 'http://localhost:8000/tasks/' + testTaskId;

			server.inject(injectOptions, function(res){
				res.statusCode.should.be.eql(204);
				res.payload.should.be.empty;
				done();
			});
		});
	});
});
