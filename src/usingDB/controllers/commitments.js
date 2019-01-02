const login_utils	= require('./login_utils');
const queries		= require('./queries');
const config		= require('../../../config.js');
const pgp			= require('pg-promise')(/*options*/);
const jwt			= require('jsonwebtoken');

const db			= config.db;

	function getCommitmentByUser(req, res){
		db.any(queries.getCommitmentByUser, [])

	}

module.exports = {
	getCommitmentByUser: getCommitmentByUser
};