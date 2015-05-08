"use strict";

var server = require('index');
var should = require('should');
var path = require('path');
var FormData = require('form-data');
var Fs = require('fs');
var Path = require('path');
var Stream = require('stream');
var constants = require('src/config/constants.js');

describe('Package routes', function(){
	describe('POST /package/upload', function(){
		this.timeout(45000);

		function sendFile(done){
			var converter = new Stream.Writable();
			converter.data = [];

			converter._write = function (chunk, encoding, callback) {
			    this.data.push(chunk);
			    callback();
			};

			converter.on('finish', function () {

			    var payload = Buffer.concat(this.data);
			    var req = {
			        method: 'POST',
			        url: 'http://localhost:8000/package/upload',
					credentials: {
						userId: 1
					},
			        headers: form.getHeaders(),
			        payload: payload
			    };

			    server.inject(req, function (res) {

			        res.statusCode.should.be.eql(200);
					done();
			    });
			});

			var form = new FormData();
			form.append('file', Fs.createReadStream(Path.join(__dirname, '/fixtures/56QhP4A.jpg')));
			form.append('filename', 'nuevoarchivo4test.jpg');
			form.pipe(converter);
		}

		it('should be possible to upload a file to the filesystem', function(done){

			constants.upload.provider = 'filesystem';

	        sendFile(done);
		});



		it('should be possible to upload a file to the filesystem', function(done){

			constants.upload.provider = 's3';

	        sendFile(done);
		});
	});
});
