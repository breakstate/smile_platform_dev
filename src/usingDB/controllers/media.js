const queries		= require('./queries');
const config		= require('../../../config');
const utils			= require('./utils');

const db			= config.db;

// create
	function createMedia(req, res){
		db.none(queries.PQ_createMedia, [req.body.path_to_media, req.body.media_title, req.body.user_id])
		.then( function() {
			utils.resObj(res, 200, true, 'created new media entry', null);
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: failed to create media entry', error); // utils
		})
		.finally(db.end);
	}

// read
	function getMediaByUser(req, res){
		utils.userExistsID(req.params.user_id)
		.then(data => {
			if (data){
				db.any(queries.PQ_getMediaByUser, [req.params.user_id])
				.then(data => {
					if (data.length){
						utils.resObj(res, 200, true, 'retrieved all media entries by this user', data);
					} else {
						utils.resObj(res, 200, false, 'no media entries by this user exist', null);
					}
				})
				.catch(error => { // IS THIS REDUNDANT?????? 
					console.log('ERROR:', error); // print the error
					utils.resObj(res, 200, false, 'error: failed to get media entries by user', error);
				})
				.finally(db.end);
			} else {
				utils.resObj(res, 200, false, 'user with that user_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: failed to get media entries by user', error);
		})
		.finally(db.end);
	}

	function getAllMedia(req, res){
		db.any(queries.PQ_getAllMedia)
		.then(data => {
			if (data.length){
				utils.resObj(res, 200, true, 'retreived all media entries', data);
			} else {
				utils.resObj(res, 200, false, 'no media entries exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: failed to get media entries', error);
		})
		.finally(db.end);
	}

// update
	function updateMedia(req, res){
		utils.mediaExists(req.body.meida_id)
		.then(data => {
			if (data){
				console.log('media entry exists');
				db.none(queries.PQ_updateMedia, [req.body.path_to_media, req.body.media_title, req.body.meida_id])
				.then(data => {
					utils.resObj(res, 200, true, 'media entry updated', null);
				})
				.catch(error => {
					console.log('Error:', error);
					utils.resObj(res, 200, false, 'media entry not updated', error);
				})
				.finally(db.end);
			}
			else {
				utils.resObj(res, 200, false, 'media entry with specified media_id does not exist', null);
			}
		})
		.catch(err => {
			console.log('ERROR:', err); // print the error
			utils.resObj(res, 200, false, 'error: failed to update media entry', err);
		})
		.finally(db.end);
	};

// delete
	function deleteMedia(req, res){ // ADD CHECK FOR IF DELETION OCCURED AT ALL
		utils.mediaExists(req.params.media_id)
		.then(data =>{
			if (data){
				db.result(queries.PQ_deleteMedia, [req.params.media_id])
				.then( result => {
					if (result.rowCount){
						utils.resObj(res, 200, true, 'media entry has been deactivated, to restore go to trash', null);
					} else {
						utils.resObj(res, 200, false, 'failed to delte media entry', null);
					}
				})
			} else {
				utils.resObj(res, 200, false, 'media entry with specified media_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('Error:', error);
			utils.resObj(res, 200, false, 'error: failed to delete media entry', error);
		})
		.finally(db.end);
	}

module.exports = {
	createMedia: createMedia,
	getMediaByUser: getMediaByUser,
	getAllMedia: getAllMedia,
	updateMedia: updateMedia,
	deleteMedia: deleteMedia
};