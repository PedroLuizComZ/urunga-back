var express = require('express');
var app = express();
var cors = require('cors')
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;
var db = 'mongodb+srv://admin:qwertyuiop@cluster0.8og4myr.mongodb.net/test?retryWrites=true&w=majority';

var stores = require('./routes/store');
var users = require('./routes/user');

mongoose.connect(db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors())

app.use('/store', stores);
app.use('/user', users);

app.get('/', function(req, res){
    console.log('app starting on port: '+port)
    res.send('App Online');
});

app.listen(port, function(){
    console.log('App listening on port: '+port);
});