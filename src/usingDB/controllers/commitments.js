const login_utils	= require('./login_utils');
const queries		= require('./queries');
const config		= require('../../../config');
const pgp			= require('pg-promise')(/*options*/);
const jwt			= require('jsonwebtoken');

const db			= config.db;

// create
	function createCommitment(req, res){
		db.none(queries.PQ_createCommitment, [req.body.goal_title, req.body.goal_description, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time, req.body.is_full_day, req.body.is_recurring, req.body.user_id, req.body.created_by, req.body.created_date, req.body.parent_goal_id])
		.then( function() {
			res.status(200)
			.json({
				success: true,
				message: 'created new commitment'
			});
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
		})
		.finally(db.end);
	}

// read
	function getCommitmentsByUser(req, res){
		db.any(queries.PQ_getCommitmentByUser, [req.params.user_id])
		.then(data => {
			if (data){
				res.status(200)
				.json({
					status: 'success',
					message: 'Retrieved all commitments by this user',
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

// delete
	function deleteCommitment(req, res){
		db.result(queries.PQ_deleteCommitment, [req.params.id])
		.then( result => {
			res.status(200)
				.json({
					status: 'success',
					message: `Removed ${result.rowCount} commitment`
			});
		})
		.catch(error => {
			console.log('Error:', error);
		})
		.finally(db.end);
	}

module.exports = {
createCommitment: createCommitment,
getCommitmentsByUser: getCommitmentsByUser,
deleteCommitment: deleteCommitment
};