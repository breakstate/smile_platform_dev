const config		= require('../../../config');
const queries		= require('./queries');

const db			= config.db;


//*****************************************************************************
// FUNCTIONS ==================================================================
//*****************************************************************************

	function resObj(res, status, statusMessage, message, data) {
		res.status(status)
		.json({
			success: statusMessage,
			message: message,
			data: data
		});
	}

//*****************************************************************************
// PROMISES +==================================================================
//*****************************************************************************

// userExists =================================================================

	function userExists(email){
		return new Promise((resolve, reject) => {
			db.oneOrNone(queries.PQ_userExists, [email])
			.then(data => {
				resolve(data);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

// userExists =================================================================

	function userExistsID(user_id){
		return new Promise((resolve, reject) => {
			db.oneOrNone(queries.PQ_userExistsID, [user_id])
			.then(data => {
				resolve(data);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

// note exists ================================================================

	function noteExists(note_id){
		return new Promise((resolve, reject) => {
			db.oneOrNone(queries.PQ_noteExists, [note_id])
			.then(data => {
				resolve(data);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

// commitment exists ==========================================================

	function commitmentExists(goal_id){
		return new Promise((resolve, reject) => {
			db.oneOrNone(queries.PQ_commitmentExists, [goal_id])
			.then(data => {
				resolve(data);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

// completed commitment exists ================================================

	function completedCommitmentExists(goal_id){
		return new Promise((resolve, reject) => {
			db.oneOrNone(queries.PQ_completedCommitmentExists, [goal_id])
			.then(data => {
				resolve(data);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

// checkin exists =============================================================

	function checkinExists(checkin_id){
		return new Promise((resolve, reject) => {
			db.oneOrNone(queries.PQ_checkinExists, [checkin_id])
			.then(data => {
				resolve(data);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

// media exists ===============================================================

	function mediaExists(media_id){
		return new Promise((resolve, reject) => {
			db.oneOrNone(queries.PQ_mediaExists, [media_id])
			.then(data => {
				resolve(data);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

// motivational exists ========================================================

	function motivationalExists(motivational_id){
		return new Promise((resolve, reject) => {
			db.oneOrNone(queries.PQ_motivationalExists, [motivational_id])
			.then(data => {
				resolve(data);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

// achievement exists ========================================================

	function achievementExists(achievement_id){
		return new Promise((resolve, reject) => {
			db.oneOrNone(queries.PQ_achievementExists, [achievement_id])
			.then(data => {
				resolve(data);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

// achievement type exists ====================================================

	function achievementTypeExists(achievementType_id){
		return new Promise((resolve, reject) => {
			db.oneOrNone(queries.PQ_achievementTypeExists, [achievementType_id])
			.then(data => {
				resolve(data);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

// log activity ==============================================================

	function logActivity(user_id, date_time, description){
		return new Promise((resolve, reject) => {
			db.none(queries.PQ_logActivity, [user_id, date_time, description])
			.then(() => {
				console.log("logged activity: " + description + " for user_id: " + user_id);
			})
			.catch(err => {
				reject(err);
			})
		})
	}
	
/*
	var date_time = datetime.create();
	date_time = date_time.format('Y/m/d');
	utils.logActivity(req.body.user_id, date_time, "[created checkin]")
	.then({})
	.catch(error => {
		console.log('ERROR:', error); // print the error
		utils.resObj(res, 500, false, 'error: checkin not logged', error);
	})
	.finally(db.end);
*/

module.exports = {
	resObj: resObj,
	userExists: userExists,
	userExistsID: userExistsID,
	noteExists: noteExists,
	commitmentExists: commitmentExists,
	completedCommitmentExists: completedCommitmentExists,
	checkinExists: checkinExists,
	mediaExists: mediaExists,
	motivationalExists: motivationalExists,
	achievementExists: achievementExists,
	achievementTypeExists: achievementTypeExists,
	logActivity: logActivity
}
//export default login_utils; check why this doesnt work