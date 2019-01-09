const queries		= require('./queries');
const config		= require('../../../config');
const utils			= require('./utils');

const db			= config.db;

// create
	function createCommitment(req, res){
		if (req.body.parent_goal_id == null){
			db.none(queries.PQ_createGoal, [req.body.goal_title, req.body.goal_description, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time, req.body.is_full_day, req.body.is_recurring, req.body.user_id, req.body.created_by, req.body.created_date, req.body.difficulty])
			.then( function() {
				utils.resObj(res, 200, true, 'created new goal', null);
			})
			.catch(error => {
				console.log('ERROR:', error); // print the error
				utils.resObj(res, 500, false, 'error: goal not created', error);
			})
			.finally(db.end);
			return;
		} else {
			db.none(queries.PQ_createCommitment, [req.body.goal_title, req.body.goal_description, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time, req.body.is_full_day, req.body.is_recurring, req.body.user_id, req.body.created_by, req.body.created_date, req.body.parent_goal_id, req.body.difficulty, req.body.recurring_type, req.body.separation_count, req.body.max_occurrence, req.body.hour_of_day, req.body.day_of_week, req.body.day_of_month, req.body.day_of_year, req.body.week_of_month, req.body.week_of_year, req.body.month_of_year])
			.then( function() {
				utils.resObj(res, 200, true, 'created new commitment under goal: ' + req.body.parent_goal_id, null);
			})
			.catch(error => {
				console.log('ERROR:', error); // print the error
				utils.resObj(res, 500, false, 'error: commitment not created for goal: ' + req.body.parent_goal_id, error);
			})
			.finally(db.end);
		}
	}

// read
	function getCommitmentsByUser(req, res){
		utils.userExistsID(req.params.user_id)
		.then(data => {
			if (data){
				db.any(queries.PQ_getCommitmentsByUser, [req.params.user_id])
				.then(data => {
					if (data.length){
						utils.resObj(res, 200, true, 'retreived all commitments by this user', data);
					} else {
						utils.resObj(res, 200, true, 'no commitments by this user exist', null);
					}
				})
				.catch(error => {
					console.log('ERROR:', error); // print the error
					utils.resObj(res, 200, false, 'error: could not get commitments by user_id', error);			
				})
				.finally(db.end);
			} else {
				utils.resObj(res, 200, false, 'user with that user_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: could not get commitments by user_id', error);			
		})
		.finally(db.end);
	}

	function getCommitmentByID(req, res){
		db.any(queries.PQ_getCommitmentByID, [req.params.goal_id])
		.then(data => {
			if (data.length){
				utils.resObj(res, 200, true, 'retreived commitment', data);
			} else {
				utils.resObj(res, 400, false, 'commitment with that goal_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 500, false, 'error: could not get commitment', error);			
		})
		.finally(db.end);
	}


	function getAllCommitments(req, res){
		db.any(queries.PQ_getAllCommitments)
		.then(data => {
			if (data.length){
				utils.resObj(res, 200, true, 'retreived all commitments', data);
			} else {
				utils.resObj(res, 200, false, 'no commitments exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: could not get commitments', error);
		})
		.finally(db.end);
	}

// update
	function updateCommitment(req, res){
		utils.commitmentExists(req.body.goal_id)
		.then(data => {
			if (data){
				console.log('commitment exists');
				db.none(queries.PQ_updateCommitment, [req.body.goal_title, req.body.goal_description, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time, req.body.is_full_day, req.body.is_recurring, req.body.goal_id])
				.then(data => {
					utils.resObj(res, 200, true, 'commitment updated', null);
				})
				.catch(error => {
					console.log('Error:', error);
					utils.resObj(res, 200, false, 'commitment not updated', error);
				})
				.finally(db.end);
			}
			else {
				utils.resObj(res, 200, false, 'commitment with specified goal_id does not exist', null);
			}
		})
		.catch(err => {
			console.log('ERROR:', err); // print the error
			utils.resObj(res, 200, false, 'error: failed to update commitment', error);
		})
		.finally(db.end);
	};

// delete

	function deleteCommitment(req, res){
		utils.commitmentExists(req.params.goal_id)
		.then(data =>{
			if (data){
				db.result(queries.PQ_deleteCommitment, [req.params.goal_id])
				.then( result => {
					if (result.rowCount){
						utils.resObj(res, 200, true, 'commitment has been deactivated, to restore go to trash', null);
					} else {
						utils.resObj(res, 200, false, 'failed to delete commitment', null);
					}
				})
			} else {
				utils.resObj(res, 200, false, 'commitment with specified commitment_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('Error:', error);
			utils.resObj(res, 200, false, 'error: failed to delete commitment', error);
		})
		.finally(db.end);
	}

module.exports = {
createCommitment: createCommitment,
getCommitmentsByUser: getCommitmentsByUser,
getCommitmentByID: getCommitmentByID,
getAllCommitments: getAllCommitments,
updateCommitment: updateCommitment,
deleteCommitment: deleteCommitment
};
//req.body.goal_title, req.body.goal_description, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time, req.body.is_full_day, req.body.is_recurring, req.body.user_id, req.body.created_by, req.body.created_date, req.body.parent_goal_id, req.body.difficulty, req.body.recurring_type, req.body.separation_count, req.body.max_occurrence, req.body.hour_of_day, req.body.day_of_week, req.body.day_of_month, req.body.day_of_year, req.body.week_of_month, req.body.week_of_year, req.body.month_of_yeal 