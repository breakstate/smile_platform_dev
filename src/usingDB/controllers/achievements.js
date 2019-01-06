const queries		= require('./queries');
const config		= require('../../../config');
const utils			= require('./utils');

const db			= config.db;

// create achievement =========================================================

	function createAchievement(req, res){
		db.none(queries.PQ_createAchievement, [req.body.id, req.body.user_id, req.body.percent_complete, req.body.last_entry, req.body.next_entry, req.body.times])
		.then( function() {
			utils.resObj(res, 200, true, 'created new achievement', null);
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: failed to create achievement', error); // utils
		})
		.finally(db.end);
	}

// get achievements by user ===================================================

	function getAchievementsByUser(req, res){
		utils.userExistsID(req.params.user_id)
		.then(data => {
			if (data){
				db.any(queries.PQ_getAchievementsByUser, [req.params.user_id])
				.then(data => {
					if (data.length){
						utils.resObj(res, 200, true, 'retrieved all achievements by this user', data);
					} else {
						utils.resObj(res, 200, false, 'no achievements by this user exist', null);
					}
				})
				.catch(error => { // IS THIS REDUNDANT?????? 
					console.log('ERROR:', error); // print the error
					utils.resObj(res, 200, false, 'error: failed to get achievements by user', error);
				})
				.finally(db.end);
			} else {
				utils.resObj(res, 200, false, 'user with that user_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: failed to get achievements by user', error);
		})
		.finally(db.end);
	}

	function getAllAchievements(req, res){
		db.any(queries.PQ_getAllAchievements)
		.then(data => {
			if (data.length){
				utils.resObj(res, 200, true, 'retreived all achievements', data);
			} else {
				utils.resObj(res, 200, false, 'no achievements exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: failed to get achievements', error);
		})
		.finally(db.end);
	}

/*
// update
	function updateAchievement(req, res){
		utils.achievementExists(req.body.Achievement_id)
		.then(data => {
			if (data){
				console.log('achievement exists');
				db.none(queries.PQ_updateAchievement, [req.body.note, req.body.date_edited, true, req.body.note_id])
				.then(data => {
					utils.resObj(res, 200, true, 'achievement updated', null);
				})
				.catch(error => {
					console.log('Error:', error);
					utils.resObj(res, 200, false, 'achievement not updated', error);
				})
				.finally(db.end);
			}
			else {
				utils.resObj(res, 200, false, 'achievement with specified achievement_id does not exist', null);
			}
		})
		.catch(err => {
			console.log('ERROR:', err); // print the error
			utils.resObj(res, 200, false, 'error: failed to update achievement', error);
		})
		.finally(db.end);
	};

// delete
	function deleteAchievement(req, res){ // ADD CHECK FOR IF DELETION OCCURED AT ALL
		utils.achievementExists(req.params.note_id)
		.then(data =>{
			if (data){
				db.result(queries.PQ_deleteAchievement, [req.params.achievement_id])
				.then( result => {
					if (result.rowCount){
						utils.resObj(res, 200, true, 'achievement has been deactivated, to restore go to trash', null);
					} else {
						utils.resObj(res, 200, false, 'failed to delte achievement', null);
					}
				})
			} else {
				utils.resObj(res, 200, false, 'achievement with specified achievement_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('Error:', error);
			utils.resObj(res, 200, false, 'error: failed to delete achievement', error);
		})
		.finally(db.end);
	}
*/
module.exports = {
	createAchievement: createAchievement,
	getAchievementsByUser: getAchievementsByUser,
	getAllAchievements: getAllAchievements,
//	updateAchievement: updateAchievement,
//	deleteAchievement: deleteAchievement
};