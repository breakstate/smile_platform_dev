// server.js

// BASE SETUP
// ============================================================================

// call the packages we need
const express		= require('express');	// call express
const app			= express();			// define our app using express
const bodyParser	= require('body-parser');
const morgan		= require('morgan');
const cors			= require('cors');

const config		= require('./config');
const user			= require('./src/usingDB/controllers/user');
const commitments	= require('./src/usingDB/controllers/commitments');
const completed_commitments	= require('./src/usingDB/controllers/completed_commitments');
const notes			= require('./src/usingDB/controllers/notes');
const checkins		= require('./src/usingDB/controllers/checkins');
const achievements	= require('./src/usingDB/controllers/achievements');
const media			= require('./src/usingDB/controllers/media');
const motivational	= require('./src/usingDB/controllers/motivational');

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

	// routes for /users
	router.route('/users')
		.post(user.addNewUser)
		.get(user.getAllUsers) // without passwords or ID
		.put(user.updateUser) // put for each field needing updating
	router.route('/users/:user_id')
		.get(user.getSingleUser)
		.delete(user.deleteUser)

	// routes for /commitments
	router.route('/commitments')
		.post(commitments.createCommitment)
		.get(commitments.getAllCommitments)
		.put(commitments.updateCommitment)
	router.route('/commitments/:user_id')
		.get(commitments.getCommitmentsByUser)
	router.route('/commitments/:goal_id')// may need to change name of column
		.delete(commitments.deleteCommitment)

	// routes for /completed_commitments
	router.route('/completed_commitments')
		.post(completed_commitments.createCompletedCommitment)
		.get(completed_commitments.getAllCompletedCommitments)
	router.route('/completed_commitments/:user_id')
		.get(completed_commitments.getCompletedCommitmentsByUser)
	//router.route('/completed_commitments/:goal_id')// may need to change name of column
	//	.delete(completed_commitments.deleteCompletedCommitment)

	// routes for /notes
	router.route('/notes')
		.put(notes.updateNote)
		.post(notes.createNote)
		.get(notes.getAllNotes)
	router.route('/notes/:user_id')
		.get(notes.getNotesByUser)
	router.route('/notes/:note_id')
		.delete(notes.deleteNote)

	// routes for /checkins
	router.route('/checkins')
		.post(checkins.createCheckin)
		.get(checkins.getAllCheckins)
		//.put(checkins.updatecheckin)
	router.route('/checkins/:user_id')
		.get(checkins.getCheckinsByUser)
	router.route('/checkins/:checkin_id')
		.delete(checkins.deleteCheckin)

	// routes for /achievements
	router.route('/achievements')
		.put(achievements.updateAchievement)
		.post(achievements.createAchievement)
		.get(achievements.getAllAchievements)
	router.route('/achievements/:user_id')
		.get(achievements.getAchievementsByUser)
	router.route('/achievements/:achievement_id')
		.delete(achievements.deleteAchievement)

	// routes for /media
	router.route('/media')
		.put(media.updateMedia)
		.post(media.createMedia)
		.get(media.getAllMedia)
	router.route('/media/:user_id')
		.get(media.getMediaByUser)
	router.route('/media/:media_id')
		.delete(media.deleteMedia)

	// routes for /motivational
	router.route('/motivational')
		.put(motivational.updateMotivational)
		.post(motivational.createMotivational)
		.get(motivational.getAllMotivational)
	router.route('/motivational/:motivational_id')
		.delete(motivational.deleteMotivational)
	router.route('/motivational_r')
		.get(motivational.getRandomMotivational)

// REGISTER OUR ROUTES -----------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ============================================================================
app.listen(port);
console.log('API should be running at localhost:' + port + ' - See README.md for details');
