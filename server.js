'use strict';

var express = require('express');
var cors = require('cors');
var multer = require('multer');
var log = require('npmlog');
var fs = require('fs');
var upload=multer({dest:"uploads/"});

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


app.post('/upload', upload.single("upfile"), function(req, res) {
  
    console.log(req.file)
    
    if 

  });


app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
