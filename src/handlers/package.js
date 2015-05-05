"use strict";

var Hapi = require('hapi');
var Fs = require('fs');
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
	            
				var readStream = Fs.createReadStream(files.file[0].path);
				var uploadCb = function upload(data) {

					var result = data || {};
					if (result.exception) {
						return reply(Hapi.error.badRequest(result.exception));
					} 

					return reply('OK')
						.type('application/json');

				};

				switch (constants.upload.provider) {
					case 's3':
						UploadHelper.fileSaveToS3(readStream, fields.filename[0], uploadCb);
						break;
					case 'filesystem':
						UploadHelper.fileSaveToDisk(readStream, fields.filename[0], uploadCb);
						break;
					default:
						return reply(Hapi.error.badRequest('No upload provider set.'));
						break;
				}
	        });

		}
	}
})();

var packageHandler = new PackageHandler();
module.exports = packageHandler;