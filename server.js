// server.js

// BASE SETUP
// ============================================================================

// call the packages we need
const express		= require('express');	// call express
const app			= express();			// define our app using express
const bodyParser	= require('body-parser');
const pg			= require('pg');
const pgp			= require('pg-promise')(/*options*/);
const jwt			= require('jsonwebtoken');
const config		= require('./config');
const user			= require('./src/usingDB/controllers/user');
const morgan		= require('morgan');

// configure database connection
const db = config.db;

// configure app to use bodyParser()
// this will let us get the data from a POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

var port = process.env.PORT || 8080;	// set out port

// ROUTES FOR OUT API
// ============================================================================
var router = express.Router();			// get instance of the express Router

	// middleware to use for all requests
	router.use(function(req, res, next) {
		//config.postmarkClient.sendEmail({ // WORKS!
		//	"From": "bmoodley@student.wethinkcode.co.za",
		//	"To": "bmoodley@student.wethinkcode.co.za",
		//	"Subject": "Test",
		//	"TextBody": "Hello from Postmark!"
		//  });
		// do logging
		console.log('Something is happening (this is to simulate middleware that runs for each request)');
		next(); // make sure we go to the next routes and don't stop here
	});

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.get('/', function(req, res) {
		console.log('GET /');
		res.json({ message: 'Welcome to Smile API' });
	});

	// more routes for our API will happen here

	router.route('/login')
		.post(user.login)

	// on routes that end in /authenticate
	//router.route('/authenticate')
	//	.post(user.authenticateUser)

	// on routes that end in /users
	router.route('/users')
		.post(user.addNewUser)
		.get(user.getAllUsers) // without passwords or ID
		.put(user.updateUser) // put for each field needing updating
		.delete(user.deleteUser)

	// on routes that end in /bears/:bear_id
	router.route('/bears/:bear_id')
		.get(function(req, res) { // get user using user ID
			console.log('GET bear by specific ID');
			res.json({ message: 'GET to /bears/:bear_id successful' });
		})

		.put(function(req, res) {
			console.log('PUT to update bear');
			res.json({ message: 'PUT to /bears/:bear_id successful'});
		})

		.delete(function(req, res) {
			console.log('DELETE to remove bear');
			res.json({ message: 'DELETE to /bears/:bear_id successful' });
		});

// REGISTER OUR ROUTES -----------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ============================================================================
app.listen(port);
console.log('API should be running at localhost:' + port + ' - See README.md for details');
