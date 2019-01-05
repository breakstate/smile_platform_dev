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

// commitment exists ==========================================================
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

module.exports = {
	resObj: resObj,
	userExists: userExists,
	userExistsID: userExistsID,
	noteExists: noteExists,
	commitmentExists: commitmentExists,
	completedCommitmentExists: completedCommitmentExists
}
//export default login_utils; check why this doesnt work