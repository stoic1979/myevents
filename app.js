const express    =  require('express');
var bodyParser   =  require('body-parser');
var mongoose     =  require('mongoose');
var Event        =  require('./schema/event');
var Rsvp         =  require('./schema/rsvp');
//var event        =  require('./routes/event');

const app        =  express();


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies


// app routes
app.post('/api/event', function(req, res, next){
	var event = new Event({

		event_type: req.body.event_type,
		store_number: req.body.store_number,
		store: req.body.store,
		floor: req.body.floor,
		event_date: req.body.event_date,
		start_time: req.body.start_time,
		end_time: req.body.end_time,
		contact_email: req.body.contact_email,
		contact_phone: req.body.contact_phone,
		status: req.body.status

	});
	
	event.save(function(err){

		if(err){
			console.log("suceessssdsadsfs")
			console.log("Event save error: " + err);
			res.send(err)
			return;
		}
		console.log("suceessss")
	});
	res.json({ success: true, message: 'event created !'});
});


app.post('/api/rsvp', function(req, res, next){
	var rsvp = new Rsvp({
		guest_1: req.body.guest_1,
		guest_2: req.body.guest_2,
		address_line1: req.body.address_line1,
		address_line2: req.body.address_line2,
		email: req.body.email,
		phone: req.body.phone,
		req_id: req.body.req_id,
		wedding_date: req.body.wedding_date,
		event_id: req.body.event_id
	});
	
	rsvp.save(function(err){
		if(err){
			console.log("Rsvp save error: " + err);
			res.send(err)
			return;
		}
		console.log("suceessss")
	});

	res.json({ success: true, message: 'rsvp created !' })
});

//--------------------------------------------------
//     GET ALL EVENTS
//--------------------------------------------------
app.get('/api/events', function(req, res){
	Event.find({})
	.then( function(events){
		if(events){
			res.json({success: true, events: events});
		}
		else{
			console.log("getAllEvent Got error: " + err);
		}
		
			
	});
});

//--------------------------------------------------
//     GET ALL RSVP
//--------------------------------------------------
app.get('/api/rsvps', function(req, res){
	Rsvp.find({})
	.then( function(rsvps){
		if(rsvps){
			res.json({success: true, events: rsvps});
		}
		else{
			console.log("getAllRsvp Got error: " + err);
		}
	});
});


//-------------------------------------
// adding routes
//-------------------------------------
//app.use('/create_event',  event);


//--------------------------------------
// Connect to data base
//--------------------------------------
mongoose.Promise = global.Promise;
const MONGODB_URI = "mongodb://harszz:cmsevents@ds141786.mlab.com:41786/registrycms";
mongoose.connect(MONGODB_URI, function(err) {
    if(err) {
        console.log("[MyEvent] failed to connect to database: " + err);
        return;
    } 

    console.log("[MyEvent] Successfully connected to database. ");
});


//------------------------------------------------
//    STARTING SERVER
//------------------------------------------------
var server = app.listen(8081, function () {
	var host = server.address().address
   	var port = server.address().port

   	console.log("Example app listening at http://%s:%s", host, port);
})