const queries		= require('./queries');
const config		= require('../../../config');
const users			= require('./user');
const utils			= require('./utils');

const db			= config.db;

// create
	function createNote(req, res){
		db.none(queries.PQ_createNote, [req.body.user_id, req.body.note, req.body.date_created, false, null])
		.then( function() {
			utils.resObj(res, 200, 'success', 'created new note', null);
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, 'fail', 'error: failed to create note', error); // utils
		})
		.finally(db.end);
	}

// read
	function getNotesByUser(req, res){
		utils.userExistsID(req.params.user_id)
		.then(data => {
			if (data){
				db.any(queries.PQ_getNotesByUser, [req.params.user_id])
				.then(data => {
					if (data.length){
						utils.resObj(res, 200, 'success', 'retrieved all notes by this user', data);
					} else {
						utils.resObj(res, 200, 'fail', 'no notes by this user exist', null);
					}
				})
				.catch(error => { // IS THIS REDUNDANT?????? 
					console.log('ERROR:', error); // print the error
					utils.resObj(res, 200, 'fail', 'error: failed to get notes by user', error);
				})
				.finally(db.end);
			} else {
				utils.resObj(res, 200, 'fail', 'user with that user_id does not exist', error);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, 'fail', 'error: failed to get notes by user', error);
		})
		.finally(db.end);
	}

	function getAllNotes(req, res){
		db.any(queries.PQ_getAllNotes)
		.then(data => {
			if (data.length){
				utils.resObj(res, 200, 'success', 'retreived all notes', data);
			} else {
				utils.resObj(res, 200, 'fail', 'no notes exist', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, 'fail', 'error: failed to get notes', error);
		})
		.finally(db.end);
	}

// update
	function updateNote(req, res){
		utils.noteExists(req.body.note_id)
		.then(data => {
			if (data){
				console.log('note exists');
				db.none(queries.PQ_updateNote, [req.body.note, req.body.date_edited, true, req.body.note_id])
				.then(data => {
					utils.resObj(res, 200, 'success', 'note updated', null);
				})
				.catch(error => {
					console.log('Error:', error);
					utils.resObj(res, 200, 'fail', 'note not updated', error);
				})
				.finally(db.end);
			}
			else {
				utils.resObj(res, 200, 'fail', 'note with specified note_id does not exist', null);
			}
		})
		.catch(err => {
			console.log('ERROR:', err); // print the error
			utils.resObj(res, 200, 'fail', 'error: failed to create note', error);
		})
		.finally(db.end);
	};

// delete
	function deleteNote(req, res){ // ADD CHECK FOR IF DELETION OCCURED AT ALL
		utils.noteExists(req.params.note_id)
		.then(data =>{
			if (data){
				db.result(queries.PQ_deleteNote, [req.params.note_id])
				.then( result => {
					if (result.rowCount){
						utils.resObj(res, 200, 'success', 'note has been deactivated, to restore go to trash', null);
					} else {
						utils.resObj(res, 200, 'fail', 'failed to delte note', null);
					}
				})
			} else {
				utils.resObj(res, 200, 'fail', 'note with specified note_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('Error:', error);
			utils.resObj(res, 200, 'fail', 'error: failed to delete note', error);
		})
		.finally(db.end);
	}

module.exports = {
	createNote: createNote,
	getNotesByUser: getNotesByUser,
	getAllNotes: getAllNotes,
	updateNote: updateNote,
	deleteNote: deleteNote
};