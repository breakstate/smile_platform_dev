const queries		= require('./queries');
const config		= require('../../../config');
const users			= require('./user');

const db			= config.db;

// note exists
	function noteExists(note_id){
		return new Promise((resolve, reject) => {
			db.oneOrNone(queries.PQ_noteExists, [note_id])
			.then(data => {
				resolve(data);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

// create
	function createNote(req, res){
		db.none(queries.PQ_createNote, [req.body.user_id, req.body.note, req.body.date_created, false, null])
		.then( function() {
			res.status(200)
			.json({
				status: 'success',
				message: 'created new note'
			});
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			res.status(200)
			.json({
				status: 'fail',
				message: error
			});
		})
		.finally(db.end);
	}

// read
	function getNotesByUser(req, res){
		db.any(queries.PQ_getNotesByUser, [req.params.user_id])
		.then(data => {
			if (data.length){
				res.status(200)
				.json({
					status: 'success',
					message: 'Retrieved all notes by this user',
					data: data
				});
			} else {
				res.status(200)
				.json({
					status: 'fail',
					message: 'No notes by this user',
				});
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
		})
		.finally(db.end);
	}

	function getAllNotes(req, res){
		db.any(queries.PQ_getAllNotes)
		.then(data => {
			if (data.length){
				res.status(200)
				.json({
					status: 'success',
					message: 'Retrieved all notes',
					data: data
				});
			} else {
				res.status(200)
				.json({
					status: 'fail',
					message: 'No notes exist',
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
		noteExists(req.body.note_id)
		.then(data => {
			if (data){
				console.log('note exists');
				db.none(queries.PQ_updateNote, [req.body.note, req.body.date_edited, true, req.body.note_id])
				.then(data => {
					res.status(200)
					.json({
						status: 'success',
						message: 'Updated note',
					});
				})
				.catch(error => {
					console.log('Error:', error);
				})
				.finally(db.end);
			}
			else {
				res.status(200)
				.json({
					status: 'fail',
					message: 'Note with specified note_id does not exist'
				});
			}
		})
		.catch(err => {
			console.log('ERROR:', err); // print the error
		})
		.finally(db.end);
	};

// delete
	function deleteNote(req, res){ // ADD CHECK FOR IF DELETION OCCURED AT ALL
		noteExists(req.params.note_id)
		.then(data =>{
			if (data){
				db.result(queries.PQ_deleteNote, [req.params.note_id])
				.then( result => {
					if (result.rowCount){
						res.status(200)
							.json({
							status: 'success',
							message: `Removed ${result.rowCount} note`
						});
					} else {
						res.status(200)
						.json({
						status: 'fail',
						message: 'Failed to delete note'
						});
					}
				})
			} else {
				res.status(200)
				.json({
				status: 'fail',
				message: 'Note with specified note_id does not exist'
				});
			}
		})
		.catch(error => {
			console.log('Error:', error);
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