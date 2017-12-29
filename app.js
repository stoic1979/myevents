const express    =  require('express');
var bodyParser   =  require('body-parser');
var mongoose     =  require('mongoose');
var Event        =  require('./schema/event');
var Rsvp         =  require('./schema/rsvp');
var User 		 =  require('./schema/user');
const TokenMaker = require('./helpers/tokenMaker');
var event        =  require('./routes/event');
var rsvp         =  require('./routes/rsvp');
var user         =  require('./routes/user');
const app        =  express();


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies


// var secretKey = "MyEvent"
// var tokenMaker = new TokenMaker(secretKey);


app.get('/api/demo', function(req, res){
	    res.sendFile(__dirname + "/templates/" + "index.html");
});

app.use('/api/', event);
app.use('/api/', rsvp);
app.use('/api/user', user);


//--------------------------------------------------
// Connect to data base
//--------------------------------------------------
mongoose.Promise = global.Promise;
const MONGODB_URI = "mongodb://harszz:cmsevents@ds141786.mlab.com:41786/registrycms";
mongoose.connect(MONGODB_URI, function(err) {
    if(err) {
        console.log("[MyEvent] failed to connect to database: " + err);
        return;
    } 
    console.log("[MyEvent] Successfully connected to database. ");
});


//--------------------------------------------------
//    STARTING SERVER
//--------------------------------------------------
var server = app.listen(8081, function () {
	var host = server.address().address
   	var port = server.address().port

   	console.log("Example app listening at http://%s:%s", host, port);
})
