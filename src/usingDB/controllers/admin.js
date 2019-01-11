const jwt			= require('jsonwebtoken');

const login_utils	= require('./login_utils');
const utils			= require('./utils');
const queries		= require('./queries');
const config		= require('../../../config.js');

const db			= config.db;



// invite user ================================================================
	function inviteUser(req, res){
		utils.userExists(req.body.email)
		.then(data =>{
			if (!data){
				// create v_token
				var v_token = jwt.sign({usr: req.body.email, grp: req.body.user_group_id}, config.v_secret);
				db.none(queries.PQ_inviteUser, [req.body.email, v_token])
				.then( function() {
					config.postmarkClient.sendEmail({
						"From": "bmoodley@student.wethinkcode.co.za",
						"To": req.body.email,
						"Subject": "Invite test",
						"TextBody": "https://smile-coaching-platform-dev.herokuapp.com/api/users/verify/" + v_token
					});
					utils.resObj(res, 200, true, 'user invite sent to: ' + req.body.email, null);
				})
				.catch(error => {
					console.log('ERROR:', error); // print the error
					utils.resObj(res, 500, false, 'error: failed to invite user', error);
				})
				.finally(db.end);
			} else {
				utils.resObj(res, 400, false, 'user with that email already exists', null);				
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 500, false, 'error: failed to invite user', error);
		})
		.finally(db.end);
	}

// u_token generator ==========================================================

function tokenGenerate(req, res){
	const token = jwt.sign({usr: req.body.email, grp: req.body.user_group_id}, config.u_secret);
	utils.resObj(res, 200, true, "generated token: [" + token + "]", null);
}


/*
I'm about to create a file for admin functions:

including but not limited to inviting a new user by email. 
Getting lists including inactives
Getting data to display in graphs (still to be decided on what data)
*/

module.exports = {
	inviteUser: inviteUser,
	tokenGenerate: tokenGenerate
}