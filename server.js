'use strict';

var express = require('express');
var cors = require('cors');
var multer = require('multer');
var log = require('npmlog');
var fs = require('fs');
// File Upload related stuff
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    var getFileExt = function(fileName) {
      var fileExt = fileName.split(".");
      if (fileExt.length === 1 || (fileExt[0] === "" && fileExt.length === 2)) {
        return "";
      }
      return fileExt.pop();
    };
    cb(null, Date.now() + '.' + getFileExt(file.originalname));
  }
});

var multerUpload = multer({
  storage: storage
});

var uploadFile = multerUpload.single('upfile');

var app = express();

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/multipart-file-meta' )


// define schema

var Schema = mongoose.Schema;
var fileSchema = new Schema({
  name: String,
  size: Number,
  date: String
});

var File = mongoose.model('File', fileSchema);


app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});


app.post('/api/fileanalyse', function(req, res) {
    uploadFile(req, res, function(err) {
      
      console.log(req);
      
      
      if (err) {
        // An error occurred when uploading 
        log.error(err);
      }
      // Everything went fine 
      var fileDetails = {
        name: req.upfile.originalname,
        size: req.upfile.size,
        date: new Date().toLocaleString(),
        file: req.upfile.filename
      };
      // save file to db
      var file = new File(fileDetails);
      file.save(function(err, file) {
        if (err) {
          log.error(err);
          throw err;
        }
        log.info('Saved', file);
      });
      var filePath = "./uploads/" + req.file.filename; 
      fs.unlinkSync(filePath);
      res.send(fileDetails);
    });
  });


app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
