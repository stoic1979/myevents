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


//--------------------------------------------------
//     ADD EVENTS
//--------------------------------------------------
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

	event.save(function(err, evt){
		if(err){
			console.log("Event save error: " + err);
			res.json({success: false, error: ""+ err});
		} else {
			res.json({ success: true, message: 'event created !', event: evt});
			console.log("suceessss")
        }
	});
});


//--------------------------------------------------
//     ADD RSVP
//--------------------------------------------------
app.post('/api/rsvp', function(req, res, next){
	var rsvp = new Rsvp({
		guest_1: req.body.guest_1,
		guest_2: req.body.guest_2,
		address_line1: req.body.address_line1,
		address_line2: req.body.address_line2,
		email: req.body.email,
		phone: req.body.phone,
		reg_id: req.body.reg_id,
		wedding_date: req.body.wedding_date,
		event_id: req.body.event_id
	});
	
	rsvp.save(function(err, rsvp){
		if(err){
			console.log("Event save error: " + err);
			res.json({success: false, error: ""+ err});
		} else {
			res.json({ success: true, message: 'rsvp created !', rsvp: rsvp});
			console.log("suceessss")
        }
	});
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
			res.json({success: true, rsvps: rsvps});
		}
		else{
			console.log("getAllRsvp Got error: " + err);
		}
	});
});


//--------------------------------------------------
//     GET EVENT BY ID
//--------------------------------------------------
app.get('/api/event/:id', function(req, res, next){
	var id = req.params.id;
	console.log("event id" + id);
	Event.find({"_id": id})
	.then( function(event){
		if(event){
			console.log("get Event: " + event);
			res.json({success: true, event: event});
		}
		else{
			console.log("get Event Got error: " + err);
			res.json({success: false, message: + err});
		}
	});
});


//--------------------------------------------------
//     GET EVENT BY Status
//--------------------------------------------------
app.get('/api/event/status/:status', function(req, res, next){
	var status = req.params.status;
	console.log("event status" + status);
	Event.find({"status": status})
	.then( function(event){
		if(event){
			console.log("get Event: " + event);
			res.json({success: true, event: event});
		}
		else{
			console.log("get Event Got error: " + err);
			res.json({success: false, message: + err});
		}
	});
});


//--------------------------------------------------
//     Edit EVENT Status
//--------------------------------------------------
app.post('/api/event/update_status', function(req, res, next){
	var id = req.body.id;
	var status = req.body.status;
	console.log("event id: " + id);
	console.log("event status: " + status);
	Event.update({_id: id}, {"$set": {status: status}})
	.exec()
	.then(function(res){
		console.log("data+++++++++" + res)
		if(res){
			console.log("11111")
			res.json({success: true, message: "Event Updated !"});
		}
		else{
			console.log("22222")
			res.json({success: false, message: "Event not Updated !"});	
		}
	});
});


//--------------------------------------------------
//     CANCEL EVENT
//--------------------------------------------------
app.get('/api/event/cancel/:id', function(req, res, next){
	var id = req.params.id;
	console.log("event id: " + id);
	Event.remove({"_id": id})
	.then(function(err, event){
		if(event){
			res.json({success: true, message: "Event cancel !", event: event});
		}
		else{
		res.json({success: false, message: "Event Not Found cancel !"});	
		}
	});	
});


//--------------------------------------------------
//     GET RSVP BY ID
//--------------------------------------------------
app.get('/api/rsvp/:id', function(req, res, next){
	var id = req.params.id;
	console.log("rsvp id: " + id);
	Rsvp.find({"_id": id})
	.then( function(rsvp){
		if(rsvp){
			console.log("get Rsvp: " + rsvp);
			res.json({success: true, rsvp: rsvp});
		}
		else{
			console.log("get Rsvp Got error: " + err);
			res.json({success: false, rsvp: + err});
		}
	});
});


//--------------------------------------------------
//     GET RSVP BY EVENT ID
//--------------------------------------------------
app.get('/api/rsvp/event_id/:id', function(req, res, next){
	var id = req.params.id;
	console.log("rsvp event id: " + id);
	Rsvp.find({"event_id": id})
	.then( function(rsvp){
		if(rsvp){
			console.log("get Rsvp: " + rsvp);
			res.json({success: true, rsvp: rsvp});
		}
		else{
			console.log("get Rsvp Got error: " + err);
			res.json({success: false, rsvp: + err});
		}
	});
});


//--------------------------------------------------
//     GET RSVP BY REG ID
//--------------------------------------------------
app.get('/api/rsvp/reg_id/:id', function(req, res, next){
	var id = req.params.id;
	console.log("rsvp reg id: " + id);
	Rsvp.find({"reg_id": id})
	.then( function(rsvp){
		if(rsvp){
			console.log("get Rsvp: " + rsvp);
			res.json({success: true, rsvp: rsvp});
		}
		else{
			console.log("get Rsvp Got error: " + err);
			res.json({success: false, rsvp: + err});
		}
	});
});


//--------------------------------------------------
//     CANCEL RSVP
//--------------------------------------------------
app.get('/api/rsvp/cancel/:id', function(req, res, next){
	var id = req.params.id;
	console.log("rsvp id: " + id);
	Rsvp.remove({"_id": id})
	.then(function(err, event){
		if(event){
			res.json({success: true, message: "Rsvp cancel !", event: event});
		}
		else{
		res.json({success: false, message: "Rsvp Not Found cancel !"});	
		}
	});	
});


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
