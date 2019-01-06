const queries		= require('./queries');
const config		= require('../../../config');
const utils			= require('./utils');

const db			= config.db;

// create
	function setCommitmentComplete(goal_id){
		return new Promise((resolve, reject) => {
			db.none(queries.PQ_setCommitmentComplete, [true, goal_id])
			.then(data => {
				resolve(data);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

	function createCompletedCommitment(req, res){ // needs testing after db update
		utils.commitmentExists(req.body.goal_id)
		.then(data =>{
			if (data){
				setCommitmentComplete(req.body.goal_id)
				.then(() =>{
					db.none(queries.PQ_createCompletedCommitment, [req.body.goal_id, req.body.date_completed, req.body.note, req.body.satisfaction])
					.then( function() {
						utils.resObj(res, 200, true, 'created new completed commitments', null);
					})
					.catch(error => {
						console.log('ERROR:', error); // print the error
						utils.resObj(res, 200, false, 'error: completed commitments not created', error);
					})
					.finally(db.end);
				})
				.catch(error => {
					console.log('ERROR:', error); // print the error
					utils.resObj(res, 200, false, 'error: could not set commitment as completed', error);
				})
				.finally(db.end);
			} else {
				utils.resObj(res, 400, false, 'commitment with specified goal_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: could not check if commitment exists', error);
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
						utils.resObj(res, 200, true, 'retreived all completed commitments by this user', data);
					} else {
						utils.resObj(res, 200, false, 'no completed commitments by this user exist', null);
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
			if (data.length){ // tested
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