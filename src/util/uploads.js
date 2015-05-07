"use strict";
/**
 * Exposes functionality to upload files to different services such as S3 or the filesystem.
 * @param file {(string)} The filepath for the file to upload.
 * @param filename {(string)} The name for the when saving it.
 * @param action {function} The function that will be executed on file saved.
 *      The function expects two parameters, the first is an error object, the second the file path.
 */

var pkgcloud = require('pkgcloud'); //a cloud API standard library: https://github.com/nodejitsu/pkgcloud
var constants = require('src/config/constants.js');

var s3client = pkgcloud.storage.createClient({
  provider: 'amazon',
  accessKey: constants.upload.accessKey,
  accessKeyId: constants.upload.accessKeyId,
  region: "us-west-2"
});

var fs = require('fs');
var path = require('path');
var Fs = require('fs');

//** Function to save files to S3 cloud storage 
module.exports.fileSaveToS3 = function(file, filename, action) {
	if (!filename) {
		return action(new Error('Filename cannot be empty.'));
	}

	var readStream = Fs.createReadStream(file);

	var writeStream = s3client.upload({
				container: constants.upload.container, //http://bla.s3.amazonaws.com/
				remote: path.basename(filename)
			});

	readStream.on('error', function(err) {
		return action(err);
	});

	writeStream.on('error', function(err) {
	    return action(err);
  	});

	writeStream.on('success', function(uploadedfile) {
	    return action(null, uploadedfile.location);
	});

	readStream.pipe(writeStream);

};

//** Function to save files to disk 
module.exports.fileSaveToDisk = function(file, filename, action) {
	if (!filename) {
		return action(new Error('Filename cannot be empty.'));
	}

	var readStream = Fs.createReadStream(file);
	
	var writepath = path.join(constants.upload.path, path.basename(filename));
	var fstream = fs.createWriteStream(writepath);
	
	readStream.once('end', function() {
		// EOF
	});

	readStream.on('error', function(err) {
		return action(err);
	});
	
	fstream.once('close', function() {
		// written to disk
		return action(null, writepath);
	});
	
	//start saving
	readStream.pipe(fstream);
};