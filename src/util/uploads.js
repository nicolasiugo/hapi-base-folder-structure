"use strict";

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

//** Function to save files to S3 cloud storage 
module.exports.fileSaveToS3 = function(file, filename, next){

	var writeStream = s3client.upload({
				container: constants.upload.container, //http://bla.s3.amazonaws.com/
				remote: path.basename(filename)
			});

	writeStream.on('error', function(err) {
	    next({exception: err});
  	});

	writeStream.on('success', function(file) {
	    next();
	});

	file.pipe(writeStream);

};

//** Function to save files to disk 
module.exports.fileSaveToDisk = function(file, filename, next) {
	
	var fstream = fs.createWriteStream(path.join(constants.upload.path, path.basename(filename)));
	
	file.once('end', function() {
		// EOF
	});
	
	fstream.once('close', function() {
		// written to disk
		next({});
	});
	
	//start saving
	file.pipe(fstream);
};