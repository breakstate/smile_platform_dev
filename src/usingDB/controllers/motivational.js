const queries		= require('./queries');
const config		= require('../../../config');
const utils			= require('./utils');

const db			= config.db;

// create
	function createMotivational(req, res){
		db.none(queries.PQ_createMotivational, [req.body.description, req.body.tags])
		.then( function() {
			utils.resObj(res, 200, true, 'created new motivational entry', null);
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: failed to create motivational entry', error); // utils
		})
		.finally(db.end);
	}

// read
	function getRandomMotivational(req, res){
		db.any(queries.PQ_getRandomMotivational)
		.then(data => {
			if (data.length){
				utils.resObj(res, 200, true, 'retrieved random motivational entry', data);
			} else {
				utils.resObj(res, 200, false, 'no motivational entries exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error);
			utils.resObj(res, 200, false, 'error: failed to get random motivational entry', error);
		})
		.finally(db.end);
	}

	function getAllMotivational(req, res){
		db.any(queries.PQ_getAllMotivational)
		.then(data => {
			if (data.length){
				utils.resObj(res, 200, true, 'retreived all motivational entries', data);
			} else {
				utils.resObj(res, 200, false, 'no motivational entries exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: failed to get motivational entries', error);
		})
		.finally(db.end);
	}

// update
	function updateMotivational(req, res){
		utils.motivationalExists(req.body.id)
		.then(data => {
			if (data){
				console.log('motivational entry exists');
				db.none(queries.PQ_updateMotivational, [req.body.description, req.body.tags, req.body.id])
				.then(data => {
					utils.resObj(res, 200, true, 'motivational entry updated', null);
				})
				.catch(error => {
					console.log('Error:', error);
					utils.resObj(res, 200, false, 'motivational entry not updated', error);
				})
				.finally(db.end);
			}
			else {
				utils.resObj(res, 200, false, 'motivational entry with specified id does not exist', null);
			}
		})
		.catch(err => {
			console.log('ERROR:', err); // print the error
			utils.resObj(res, 200, false, 'error: failed to update motivational entry', err);
		})
		.finally(db.end);
	};

// delete
	function deleteMotivational(req, res){ // ADD CHECK FOR IF DELETION OCCURED AT ALL
		utils.motivationalExists(req.params.motivational_id)
		.then(data =>{
			if (data){
				db.result(queries.PQ_deleteMotivational, [req.params.motivational_id])
				.then( result => {
					if (result.rowCount){
						utils.resObj(res, 200, true, 'motivational entry has been deactivated, to restore go to trash', null);
					} else {
						utils.resObj(res, 200, false, 'failed to delete motivational entry', null);
					}
				})
			} else {
				utils.resObj(res, 200, false, 'motivational entry with specified id does not exist', null);
			}
		})
		.catch(error => {
			console.log('Error:', error);
			utils.resObj(res, 200, false, 'error: failed to delete motivational entry', error);
		})
		.finally(db.end);
	}

module.exports = {
	createMotivational: createMotivational,
	getRandomMotivational: getRandomMotivational,
	getAllMotivational: getAllMotivational,
	updateMotivational: updateMotivational,
	deleteMotivational: deleteMotivational
};