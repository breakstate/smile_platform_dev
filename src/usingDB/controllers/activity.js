const queries		= require('./queries');
const config		= require('../../../config');
const utils			= require('./utils');

const db			= config.db;

// read
	function getActivityByUser(req, res){
		utils.userExistsID(req.params.user_id)
		.then(data => {
			if (data){
				db.any(queries.PQ_getActivityByUser, [req.params.user_id])
				.then(data => {
					if (data.length){
						utils.resObj(res, 200, true, 'retrieved all activity logs by specified user_id', data);
					} else {
						utils.resObj(res, 400, false, 'no activity logs by this user exist', null);
					}
				})
				.catch(error => { // IS THIS REDUNDANT?????? 
					console.log('ERROR:', error); // print the error
					utils.resObj(res, 500, false, 'error: failed to get activity logs by user', error);
				})
				.finally(db.end);
			} else {
				utils.resObj(res, 400, false, 'user with that user_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 500, false, 'error: failed to get activity logs by user', error);
		})
		.finally(db.end);
	}

	function getActivityByPK(req, res){
		utils.userExistsID(req.params.user_id)
		.then(data => {
			if (data){
				db.any(queries.PQ_getActivityByPK, [req.params.user_id, req.params.date])
				.then(data => {
					if (data.length){
						utils.resObj(res, 200, true, 'retrieved all activity logs by specified user_id', data);
					} else {
						utils.resObj(res, 400, false, 'no activity logs by this user exist', null);
					}
				})
				.catch(error => { // IS THIS REDUNDANT?????? 
					console.log('ERROR:', error); // print the error
					utils.resObj(res, 500, false, 'error: failed to get activity logs by user', error);
				})
				.finally(db.end);
			} else {
				utils.resObj(res, 400, false, 'user with that user_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 500, false, 'error: failed to get activity logs by user', error);
		})
		.finally(db.end);
	}

	function getAllActivity(req, res){
		db.any(queries.PQ_getAllActivity)
		.then(data => {
			if (data.length){
				utils.resObj(res, 200, true, 'retreived all activity logs', data);
			} else {
				utils.resObj(res, 400, false, 'no activity logs exists', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 500, false, 'error: failed to get activity logs', error);
		})
		.finally(db.end);
	}

	function getActivityByDate(req, res){
		db.any(queries.PQ_getActivityByDate, [req.params.date])
		.then(data => {
			if (data.length){
				utils.resObj(res, 200, true, 'retreived all activity logs by date', data);
			} else {
				utils.resObj(res, 400, false, 'no activity logs for this date exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 500, false, 'error: failed to get activity logs by date', error);
		})
		.finally(db.end);
	}

// delete
/*
	function deleteNote(req, res){ // ADD CHECK FOR IF DELETION OCCURED AT ALL
		utils.noteExists(req.params.note_id)
		.then(data =>{
			if (data){
				db.result(queries.PQ_deleteNote, [req.params.note_id])
				.then( result => {
					if (result.rowCount){
						utils.resObj(res, 200, true, 'note has been deactivated, to restore go to trash', null);
					} else {
						utils.resObj(res, 200, false, 'failed to delte note', null);
					}
				})
			} else {
				utils.resObj(res, 200, false, 'note with specified note_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('Error:', error);
			utils.resObj(res, 200, false, 'error: failed to delete note', error);
		})
		.finally(db.end);
	}
*/
module.exports = {
	getActivityByDate: getActivityByDate,
	getActivityByPK: getActivityByPK,
	getActivityByUser: getActivityByUser,
	getAllActivity: getAllActivity
};