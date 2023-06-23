var fs = require('fs');
var path = require('path');
var process = require('process');
var archiver = require('archiver');

function zipFolder(srcFolder, zipFilePath) {
  fs.mkdirSync(path.dirname(zipFilePath), { recursive: true });
  var output = fs.createWriteStream(zipFilePath);
  var zipArchive = archiver('zip');
  
  output.on('close', function() {
    console.log('Successfully created a zip file at ' + zipFilePath);
  });
  
  zipArchive.on('error', function(error) {
    console.log('Couldn\'t zip a folder due to: ' + error);
  });
  
  zipArchive.pipe(output);
  zipArchive.directory(path.resolve(srcFolder), false);
  zipArchive.finalize();
}

var sccFolder = process.argv[2];
if (!sccFolder) {
  console.error('The folder is not selected!');
} else {
  if (sccFolder[sccFolder.length - 1] === '/') {
    sccFolder = sccFolder.slice(0, sccFolder.length - 1);
  }
  var output = 'zips/' + sccFolder + '.zip';
  zipFolder(sccFolder, output)
}
