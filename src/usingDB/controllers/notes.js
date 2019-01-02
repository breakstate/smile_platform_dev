const login_utils	= require('./login_utils');
const queries		= require('./queries');
const config		= require('../../../config');
const pgp			= require('pg-promise')(/*options*/);
const jwt			= require('jsonwebtoken');

const db			= config.db;

// create
	function createNote(req, res){
		db.none(queries.PQ_createNote, [req.body.user_id, req.body.note, req.body.date_created, false, null])
		.then( function() {
			res.status(200)
			.json({
				success: true,
				message: 'created new user'
			});
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
		})
		.finally(db.end);
	}

// read
	function getNotesByUser(req, res){
		db.any(queries.getCommitmentByUser, [user_id])
		.then(data => {
			if (data){
				res.status(200)
				.json({
					status: 'success',
					message: 'Retrieved all notes by this user',
					data: data
				});
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
		})
		.finally(db.end);
}

// update
	function updateNote(req, res){
		// check if token has admin rights
		db.none(queries.PQ_updateNote,
		[req.body.note, req.body.date_edited, true, req.body.note_id])
			.then(data => {
				res.status(200)
				.json({
					status: 'success',
					message: 'Updated note'
				});
			})
			.catch(error => {
				console.log('Error:', error);
			})
			.finally(db.end);
	}

// delete
	function deleteNote(req, res){
		db.result(queries.PQ_deleteNote, [note_id])
		.then( result => {
			res.status(200)
				.json({
				  status: 'success',
				  message: `Removed ${result.rowCount} note`
			});
		})
		.catch(error => {
			console.log('Error:', error);
		})
		.finally(db.end);
	}

module.exports = {
	createNote: createNote,
	getNotesByUser: getNotesByUser,
	updateNote: updateNote,
	deleteNote: deleteNote
};