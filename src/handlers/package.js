"use strict";

var Hapi = require('hapi');
var Boom = require('boom');
var Q = require('q');
var multiparty = require('multiparty');
var UploadHelper = require('src/util/uploads');
var generateId = require('time-uuid');
var constants = require('src/config/constants.js');

function PackageHandler(){};
PackageHandler.prototype = (function() {

	return {
		
		upload: function upload(request, reply) {

			var form = new multiparty.Form();
	        form.parse(request.payload, function(err, fields, files) {
	            if (err) {
	            	return reply(err);
	            }

	            if (!files.file) {
	            	return reply(Boom.badRequest(new Error('No file uploaded')));
	            }

	            var path = files.file[0].path
				var uploadCb = function upload(err, res) {

					if (err) {
						return reply(Boom.badRequest(err));
					} 

					return reply('OK:' + res)
						.type('application/json');

				};

				switch (constants.upload.provider) {
					case 's3':
						UploadHelper.fileSaveToS3(path, fields.filename[0], uploadCb);
						break;
					case 'filesystem':
						UploadHelper.fileSaveToDisk(path, fields.filename[0], uploadCb);
						break;
					default:
						return reply(Boom.badRequest('No upload provider set.'));
						break;
				}
	        });

		}
	}
})();

var packageHandler = new PackageHandler();
module.exports = packageHandler;