const express    =  require('express');
var bodyParser   =  require('body-parser');
var mongoose     =  require('mongoose');
var Event        =  require('./schema/event');
var Rsvp         =  require('./schema/rsvp');
var User 		 =  require('./schema/user');
const TokenMaker = require('./helpers/tokenMaker');
//var event        =  require('./routes/event');

const app        =  express();


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies


var secretKey = "MyEvent"
var tokenMaker = new TokenMaker(secretKey);


app.get('/api/demo', function(req, res){
	    res.sendFile(__dirname + "/templates/" + "index.html");
});


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
			res.json({success: false, "getAllEvent Got error ": + err});
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
			res.json({success: false, "getAllRsvp Got error ": + err});
			console.log("getAllRsvp Got error: " + err);
		}
	});
});


//--------------------------------------------------
//     GET EVENT BY ID
//--------------------------------------------------
app.get('/api/event/:id', function(req, res, next){
	var id = req.params.id;

	Event.find({"_id": id})
	.then( function(event){
		if(event){
			console.log("get Event: " + event);
			res.json({success: true, event: event});
		}
		else{
			console.log("get Event Got error: " + err);
			res.json({success: false, message: "Id not found"});
		}
	});
});


//--------------------------------------------------
//     GET EVENT BY Status
//--------------------------------------------------
app.get('/api/event/status/:status', function(req, res, next){
	var status = req.params.status;
	
	Event.find({"status": status})
	.then( function(err, event){
		if(event){
			console.log("get Event: " + event);
			res.json({success: true, event: event});
		}
		else{
			console.log("get Event Got error: " + err);
			res.json({success: false, message: "status Not match"});
		}
	});
});


//--------------------------------------------------
//     Edit EVENT
//--------------------------------------------------
app.post('/api/event/edit', function(req, res, next){
	var id = req.body.id;
	var event_type = req.body.event_type;
	var store_number = req.body.store_number;
	var store = req.body.store;
	var floor = req.body.floor;
	var event_date = req.body.event_date;
	var start_time = req.body.start_time;
	var end_time = req.body.end_time;
	var contact_email = req.body.contact_email;
	var contact_phone = req.body.contact_phone;
	var status = req.body.status;

	Event.update({_id: id}, {"$set": {event_type: event_type,
		store_number: store_number,
		store: store,
		floor: floor,
		event_date: event_date,
		start_time: start_time,
		end_time: end_time,
		contact_email: contact_email,
		contact_phone: contact_phone,
		status: status}})
	.exec()
	.then(function(update){
		if(update){
			res.json({success: true, message: "Event Updated !"});
		}
		else{
			res.json({success: false, message: "Event not Updated !"});	
		}
	});
});


//--------------------------------------------------
//     Edit EVENT Status
//--------------------------------------------------
app.post('/api/event/update_status', function(req, res, next){
	var id = req.body.id;
	var status = req.body.status;

	Event.update({_id: id}, {"$set": {status: status}})
	.exec()
	.then(function(update){
		if(update){
			res.json({success: true, message: "Event Status Updated !"});
		}
		else{
			res.json({success: false, message: "Event not Updated !"});	
		}
	});
});


//--------------------------------------------------
//     CANCEL EVENT
//--------------------------------------------------
app.get('/api/event/cancel/:id', function(req, res, next){
	var id = req.params.id;

	Event.remove({"_id": id})
	.then(function(err, event){
		if(event){
			res.json({success: true, message: "Event Cancel !", event: event});
		}
		else{
		res.json({success: false, message: "Event Not Found Cancel !"});	
		}
	});	
});


//--------------------------------------------------
//     GET RSVP BY ID
//--------------------------------------------------
app.get('/api/rsvp/:id', function(req, res, next){
	var id = req.params.id;

	Rsvp.find({"_id": id})
	.then( function(rsvp){
		if(rsvp){
			res.json({success: true, rsvp: rsvp});
		}
		else{
			res.json({success: false, rsvp: err});
		}
	});
});


//--------------------------------------------------
//     GET RSVP BY EVENT ID
//--------------------------------------------------
app.get('/api/rsvp/event_id/:id', function(req, res, next){
	var id = req.params.id;

	Rsvp.find({"event_id": id})
	.then( function(rsvp){
		if(rsvp){
			res.json({success: true, rsvp: rsvp});
		}
		else{
			res.json({success: false, rsvp: err});
		}
	});
});


//--------------------------------------------------
//     GET RSVP BY REG ID
//--------------------------------------------------
app.get('/api/rsvp/reg_id/:id', function(req, res, next){
	var id = req.params.id;

	Rsvp.find({"reg_id": id})
	.then( function(rsvp){
		if(rsvp){
			res.json({success: true, rsvp: rsvp});
		}
		else{
			res.json({success: false, rsvp: err});
		}
	});
});


//--------------------------------------------------
//     CANCEL RSVP
//--------------------------------------------------
app.get('/api/rsvp/cancel/:id', function(req, res, next){
	var id = req.params.id;
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


//--------------------------------------------------
//     ADD USER
//--------------------------------------------------
app.post('/api/user', function(req, res, next){
	var user = new User({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		username: req.body.username,
		email: req.body.email,
		password: req.body.password
	});

	var token = tokenMaker.createUserToken(user);
	user.save(function(err, user){
		if(err){
			console.log("user save error: " + err);
			res.json({success: false, error: ""+ err});
		} else {
			res.json({ success: true, message: 'user created !', User: user});
			console.log("suceessss")
        }
	});
});


//--------------------------------------------------
//     USER LOGIN
//--------------------------------------------------
app.post('/api/user/login', function(req, res, next){
	var email = req.body.email;
	User.findOne({email: email})
	.exec(function(err, user){
		if(err) throw err;
		if(!user){
			console.log("error" + err);
			res.json({success: false, message: "User Not Found!"});	
			}
		else if(user){

            var validPassword = user.comparePassword(req.body.password);
			
			if(!validPassword) {
                res.status(403).json({ success: false, message: 'Invalid Password !'});
            }
            else{
				console.log("user" + user);
				var token = tokenMaker.createUserToken(user);
				res.json({success: true, message: "User Login !", token: token});
			}
		}
	});	
});


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
