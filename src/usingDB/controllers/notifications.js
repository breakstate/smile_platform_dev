const queries		= require('./queries');
const config		= require('../../../config');
const utils			= require('./utils');

const db			= config.db;

// create
	function createNotification(req, res){
		db.none(queries.PQ_createNotification, [req.body.user_id, req.body.notification, req.body.time_date])
		.then( function() {
			utils.resObj(res, 200, true, 'created notification', null);
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: failed to create notification', error); // utils
		})
		.finally(db.end);
	}

// read
	function getUnseenNotificationsByUser(req, res){
		utils.userExistsID(req.params.user_id)
		.then(data => {
			if (data){
				db.any(queries.PQ_getUnseenNotificationsByUser, [req.params.user_id])
				.then(data => {
					if (data.length){
						utils.resObj(res, 200, true, 'retrieved all unseen notifications by this user', data);
					} else {
						utils.resObj(res, 200, false, 'no unseen notifications by this user exist', null);
					}
				})
				.catch(error => {
					console.log('ERROR:', error); // print the error
					utils.resObj(res, 200, false, 'error: failed to get unseen notifications by user', error);
				})
				.finally(db.end);
			} else {
				utils.resObj(res, 200, false, 'user with that user_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: failed to get unseen notifications by user', error);
		})
		.finally(db.end);
	}

	function getSeenNotificationsByUser(req, res){
		utils.userExistsID(req.params.user_id)
		.then(data => {
			if (data){
				db.any(queries.PQ_getSeenNotificationsByUser, [req.params.user_id])
				.then(data => {
					if (data.length){
						utils.resObj(res, 200, true, 'retrieved all seen notifications by this user', data);
					} else {
						utils.resObj(res, 200, false, 'no seen notifications by this user exist', null);
					}
				})
				.catch(error => {
					console.log('ERROR:', error); // print the error
					utils.resObj(res, 200, false, 'error: failed to get seen notifications by user', error);
				})
				.finally(db.end);
			} else {
				utils.resObj(res, 200, false, 'user with that user_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: failed to get seen notifications by user', error);
		})
		.finally(db.end);
	}

	function getAllNotificationsByUser(req, res){
		utils.userExistsID(req.params.user_id)
		.then(data => {
			if (data){
				db.any(queries.PQ_getAllNotificationsByUser, [req.params.user_id])
				.then(data => {
					if (data.length){
						utils.resObj(res, 200, true, 'retrieved all notifications by this user', data);
					} else {
						utils.resObj(res, 200, false, 'no notifications by this user exist', null);
					}
				})
				.catch(error => {
					console.log('ERROR:', error); // print the error
					utils.resObj(res, 200, false, 'error: failed to get notifications by user', error);
				})
				.finally(db.end);
			} else {
				utils.resObj(res, 200, false, 'user with that user_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'error: failed to get notifications by user', error);
		})
		.finally(db.end);
	}

// update
	function updateNotification(req, res){
		utils.notificationExists(req.params.id)
		.then(data => {
			if (data){
				db.none(queries.PQ_updateNotification, [req.params.id])
				.then(data => {
					utils.resObj(res, 200, true, 'notification updated', null);
				})
				.catch(error => {
					console.log('Error:', error);
					utils.resObj(res, 200, false, 'notification not updated', error);
				})
				.finally(db.end);
			}
			else {
				utils.resObj(res, 200, false, 'notification with specified id does not exist', null);
			}
		})
		.catch(err => {
			console.log('ERROR:', err); // print the error
			utils.resObj(res, 200, false, 'error: failed to update notification', err);
		})
		.finally(db.end);
	};

module.exports = {
	createNotification: createNotification,
	getUnseenNotificationsByUser: getUnseenNotificationsByUser,
	getSeenNotificationsByUser: getSeenNotificationsByUser,
	getAllNotificationsByUser: getAllNotificationsByUser,
	updateNotification: updateNotification
};