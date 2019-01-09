const queries		= require('./queries');
const config		= require('../../../config');
const utils			= require('./utils');

const db			= config.db;

// create
	function createCheckin(req, res){
		db.none(queries.PQ_createCheckin, [req.body.user_id, req.body.date_answered, req.body.time_answered, req.body.q1, req.body.q2, req.body.q3, req.body.q4, req.body.q5, req.body.q6, req.body.q7, req.body.q8, req.body.q9, req.body.q10, req.body.q11, req.body.q12, req.body.q13, req.body.q14, req.body.q15, req.body.q16, req.body.q17, req.body.q18, req.body.q19, req.body.q20, req.body.q21, req.body.q22, req.body.q23, req.body.q24, req.body.q25, req.body.q26, req.body.q27, req.body.q28, req.body.q29, req.body.q30, req.body.q31, req.body.q32, req.body.q33, req.body.q34])
		.then( function() {
			utils.resObj(res, 200, true, 'created new checkin', null);
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: checkin not created', error);
		})
		.finally(db.end);
	}

// read
	function getCheckinsByUser(req, res){
		utils.userExistsID(req.params.user_id)
		.then(data => {
			if (data){
				db.any(queries.PQ_getCheckinsByUser, [req.params.user_id])
				.then(data => {
					if (data.length){
						utils.resObj(res, 200, true, 'retreived all checkins by this user', data);
					} else {
						utils.resObj(res, 200, true, 'no checkins by this user exist', null);
					}
				})
				.catch(error => {
					console.log('ERROR:', error); // print the error
					utils.resObj(res, 200, false, 'error: could not get checkins by user_id', error);			
				})
				.finally(db.end);
			} else {
				utils.resObj(res, 200, false, 'user with that user_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: could not get checkins by user_id', error);			
		})
		.finally(db.end);
	}

	function getAllCheckins(req, res){
		db.any(queries.PQ_getAllCheckins)
		.then(data => {
			if (data.length){
				utils.resObj(res, 200, true, 'retreived all checkins', data);
			} else {
				utils.resObj(res, 200, false, 'no checkins exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: could not get checkins', error);
		})
		.finally(db.end);
	}

// update
	function updateCheckin(req, res){
		utils.CheckinExists(req.body.goal_id)
		.then(data => {
			if (data){
				console.log('checkin exists');
				db.none(queries.PQ_updateCheckin, [req.body.goal_title, req.body.goal_description, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time, req.body.is_full_day, req.body.is_recurring, req.body.goal_id])
				.then(data => {
					utils.resObj(res, 200, true, 'checkin updated', null);
				})
				.catch(error => {
					console.log('Error:', error);
					utils.resObj(res, 200, false, 'checkin not updated', error);
				})
				.finally(db.end);
			}
			else {
				utils.resObj(res, 200, false, 'checkin with specified goal_id does not exist', null);
			}
		})
		.catch(err => {
			console.log('ERROR:', err); // print the error
			utils.resObj(res, 200, false, 'error: failed to update checkin', error);
		})
		.finally(db.end);
	};

// delete

	function deleteCheckin(req, res){
		utils.checkinExists(req.params.checkin_id)
		.then(data =>{
			if (data){
				db.result(queries.PQ_deleteCheckin, [req.params.checkin_id])
				.then( result => {
					if (result.rowCount){
						utils.resObj(res, 200, true, 'checkin has been deactivated, to restore go to trash', null);
					} else {
						utils.resObj(res, 200, false, 'failed to delete checkin', null);
					}
				})
			} else {
				utils.resObj(res, 200, false, 'checkin with specified checkin_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('Error:', error);
			utils.resObj(res, 200, false, 'error: failed to delete checkin', error);
		})
		.finally(db.end);
	}

// safeDeleteCheckins =========================================================

function safeDeleteCheckin(req, res){
	utils.checkinExists(req.body.checkin_id)
	.then(data =>{
		if (data){
			db.none(queries.PQ_safeDeleteCheckin, [req.body.checkin_id])
			.then( function() {
				utils.resObj(res, 200, true, 'commitment has been deactivated, to restore go to trash', null);
			})
			.catch(err => {
				console.log('ERROR:', err); // print the error
				utils.resObj(res, 500, false, 'error: failed to deactivate commitment', err);
			})
			.finally(db.end);
		} else {
			utils.resObj(res, 400, false, 'no active commitment with that user_id', null);
		}
	})
	.catch(error => {
		console.log('Error:', error);
		utils.resObj(res, 500, false, 'error: failed to deactivate commitment, failed to find commitment', error);
	})
	.finally(db.end);
}


module.exports = {
createCheckin: createCheckin,
getCheckinsByUser: getCheckinsByUser,
getAllCheckins: getAllCheckins,
updateCheckin: updateCheckin,
deleteCheckin: deleteCheckin,
safeDeleteCheckin: safeDeleteCheckin
};