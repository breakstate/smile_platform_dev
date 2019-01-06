const queries		= require('./queries');
const config		= require('../../../config');
const utils			= require('./utils');

const db			= config.db;

// create achievement type ====================================================

	function createAchievementType(req, res){
		db.none(queries.PQ_createAchievementType, [req.body.id, req.body.name, req.body.xp_worth])
		.then( function() {
			utils.resObj(res, 200, true, 'created new achievement type', null);
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 500, false, 'error: failed to create achievement type', error); // utils
		})
		.finally(db.end);
	}

// get all achievement types ==================================================

	function getAllAchievementTypes(req, res){
		db.any(queries.PQ_getAllAchievementTypes)
		.then(data => {
			if (data.length){
				utils.resObj(res, 200, true, 'retreived all achievement types', data);
			} else {
				utils.resObj(res, 400, false, 'no achievement types exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 500, false, 'error: failed to get achievements', error);
		})
		.finally(db.end);
	}

// update
/*
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
*/

// delete achievement typep ===================================================

	function deleteAchievementType(req, res){ // ADD CHECK FOR IF DELETION OCCURED AT ALL
		utils.achievementTypeExists(req.params.achievements_d_id)
		.then(data =>{
			if (data){
				db.result(queries.PQ_deleteAchievementType, [req.params.achievements_d_id])
				.then( result => {
					if (result.rowCount){
						utils.resObj(res, 200, true, 'achievement type has been deactivated, to restore go to trash', null);
					} else {
						utils.resObj(res, 400, false, 'failed to delete achievement type', null);
					}
				})
			} else {
				utils.resObj(res, 400, false, 'achievement type with specified id does not exist', null);
			}
		})
		.catch(error => {
			console.log('Error:', error);
			utils.resObj(res, 500, false, 'error: failed to delete achievement type', error);
		})
		.finally(db.end);
	}

module.exports = {
	createAchievementType: createAchievementType,
	getAllAchievementTypes: getAllAchievementTypes,
	deleteAchievementType: deleteAchievementType
};