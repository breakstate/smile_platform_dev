const queries		= require('./queries');
const config		= require('../../../config');
const utils			= require('./utils');

const db			= config.db;

// create
	function createCommitment(req, res){
		db.none(queries.PQ_createCommitment, [req.body.goal_title, req.body.goal_description, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time, req.body.is_full_day, req.body.is_recurring, req.body.user_id, req.body.created_by, req.body.created_date, req.body.parent_goal_id])
		.then( function() {
			utils.resObj(res, 200, true, 'created new commitment', null);
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: commitment not created', error);
		})
		.finally(db.end);
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
						utils.resObj(res, 200, false, 'no commitments by this user exist', null);
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

	function getAllCommitments(req, res){
		db.any(queries.PQ_getAllCommitments)
		.then(data => {
			if (data){
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
getAllCommitments: getAllCommitments,
updateCommitment: updateCommitment,
deleteCommitment: deleteCommitment
};