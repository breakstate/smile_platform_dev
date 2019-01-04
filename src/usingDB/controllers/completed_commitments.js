const queries		= require('./queries');
const config		= require('../../../config');
const utils			= require('./utils');

const db			= config.db;

// create
	function createCompletedCommitment(req, res){
		db.none(queries.PQ_createCompletedCommitment, [req.body.goal_title, req.body.goal_description, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time, req.body.is_full_day, req.body.is_recurring, req.body.user_id, req.body.created_by, req.body.created_date, req.body.parent_goal_id])
		.then( function() {
			utils.resObj(res, 200, true, 'created new completed commitments', null);
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: completed commitments not created', error);
		})
		.finally(db.end);
	}

// read
	function getCompletedCommitmentsByUser(req, res){
		utils.userExistsID(req.params.user_id)
		.then(data => {
			if (data){
				db.any(queries.PQ_getCompletedCommitmentsByUser, [req.params.user_id])
				.then(data => {
					if (data.length){
						utils.resObj(res, 200, true, 'retreived all completed commitments by this user', null);
					} else {
						utils.resObj(res, 200, false, 'no completed commitmentss by this user exist', null);
					}
				})
				.catch(error => {
					console.log('ERROR:', error); // print the error
					utils.resObj(res, 200, false, 'error: could not get completed commitments by user_id', error);			
				})
				.finally(db.end);
			} else {
				utils.resObj(res, 200, false, 'user with that user_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: could not get completed commitments by user_id', error);			
		})
		.finally(db.end);
	}

	function getAllCompletedCommitments(req, res){
		db.any(queries.PQ_getAllCompletedCommitments)
		.then(data => {
			if (data){
				utils.resObj(res, 200, true, 'retreived all completed commitments', data);
			} else {
				utils.resObj(res, 200, false, 'no completed commitmentss exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: could not get completed commitments', error);
		})
		.finally(db.end);
	}

// update

// delete

	function deleteCompletedCommitment(req, res){
		utils.completedCommitmentExists(req.params.goal_id)
		.then(data =>{
			if (data){
				db.result(queries.PQ_deleteCompletedCommitment, [req.params.goal_id])
				.then( result => {
					if (result.rowCount){
						utils.resObj(res, 200, true, 'commitment has been deactivated, to restore go to trash', null);
					} else {
						utils.resObj(res, 200, false, 'failed to delete completed commitments', null);
					}
				})
			} else {
				utils.resObj(res, 200, false, 'commitment with specified completed commitments_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('Error:', error);
			utils.resObj(res, 200, false, 'error: failed to delete completed commitments', error);
		})
		.finally(db.end);
	}

module.exports = {
createCompletedCommitment: createCompletedCommitment,
getCompletedCommitmentsByUser: getCompletedCommitmentsByUser,
getAllCompletedCommitments: getAllCompletedCommitments,
deleteCompletedCommitment: deleteCompletedCommitment
};