const jwt			= require('jsonwebtoken');
const datetime		= require('node-datetime');

const login_utils	= require('./login_utils');
const utils			= require('./utils');
const queries		= require('./queries');
const config		= require('../../../config.js');


const db			= config.db;

// getSingleUser ==============================================================

	function getSingleUser(req, res){
		db.oneOrNone(queries.PQ_getSingleUser, [req.params.user_id])
		.then(data => {
			if (data){//test
				utils.resObj(res, 200, true, 'retrieved single user', data);
			} else {
				utils.resObj(res, 400, false, 'no user with specified user_id', null);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 200, false, 'failed to get user', error);
		})
		.finally(db.end);
	}

// getAllUsers ================================================================

	function getAllUsers(req, res) {
		db.any(queries.PQ_getAllUsers) // took very long for some reason // test
		.then(data => {
			if (data){//test
				utils.resObj(res, 200, true, 'retrieved all users', data);
			} else {
				utils.resObj(res, 400, false, 'failed to retrieved all users', data);
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 500, false, 'error: failed to retrieved all users', error);
		})
		.finally(db.end);
	}

// addNewUser =================================================================

	function addNewUser(req, res) { // DEV version, doesn't implement verify_token
		if (!req.body.email || !req.body.user_password || !req.body.first_name || !req.body.last_name || !req.body.phone_number || !req.body.user_group_id) {
			utils.resObj(res, 400, false, 'missing values', null);
		} else if(!login_utils.isValidEmail(req.body.email)) {
			utils.resObj(res, 400, false, 'email formatted incorrectly', null);
		}
		utils.userExists(req.body.email)
		.then(data => {
			if (data){
				utils.resObj(res, 400, false, 'user with that email already exists', null);
			} else {
				const hashedPassword = login_utils.hashPassword(req.body.user_password);
				db.none(queries.PQ_addNewUser, [req.body.first_name, req.body.last_name, req.body.phone_number, req.body.email, hashedPassword, true, req.body.user_group_id])
					.then( function() {
						utils.resObj(res, 200, true, 'created new user', null);
					})
					.catch(error => {
						console.log('ERROR:', error); // print the error
						utils.resObj(res, 500, false, 'error: failed to create new user', error);
					})
					.finally(db.end);

				const token = jwt.sign({usr: req.body.email, grp: req.body.user_group_id}, config.u_secret);
				db.none(queries.PQ_addNewUserToken, [token, req.body.email])
					.then()
					.catch(error => {
						console.log('ERROR:', error); // print the error
						utils.resObj(res, 500, false, 'error: failed to create token for user', error);
					})
					.finally(db.end);
			}
		})
	}

// fetch token ================================================================

	function fetchToken(email, prev_data){
		return new Promise((resolve, reject) => {
			db.oneOrNone(queries.PQ_getUserToken, [email])
			.then(data => {
				resolve(data);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

// login ======================================================================

	function rememberMe(req, res){
		var email;
		var isAdmin;
		if (!req.body.token){
			utils.resObj(res, 400, false, 'no token provided', null);
		} else {
			jwt.verify(req.body.token, config.u_secret, function(err, decoded) {
				if (err) {
					utils.resObj(res, 403, false, 'invalid token', null);
				} else {
					email = decoded.usr;
					db.oneOrNone(queries.PQ_userLogin, [email])
					.then(data =>{
						if (data){
							if (decoded.grp == 2){
								isAdmin = true;
							} else {
								isAdmin = false;
							}
							data['admin'] = isAdmin;
							utils.resObj(res, 200, true, 'authorized user', data);
							var date_time = datetime.create();
							date_time = date_time.format('Y/m/d H:M:S');
							utils.logActivity(data.user_id, date_time, "[logged in (token)]")
							.then({})
							.catch(error => {
								console.log('ERROR:', error); // print the error
								utils.resObj(res, 500, false, 'error: token login not logged', error);
							})
							.finally(db.end);
						} else {
							utils.resObj(res, 400, false, 'unauthorized user', null);
						}
					})
					.catch(error => {
						console.log('ERROR:', error); // print the error
						utils.resObj(res, 500, false, 'error: login failed', error);
					})
					.finally(db.end);
				}
			})
		}
	}

	function login(req, res){
		if (!req.body.email || !req.body.user_password || !req.body.email.length || !req.body.user_password.length) {
			utils.resObj(res, 400, false, 'email and/or password missing', null);
		} else if (!login_utils.isValidEmail(req.body.email)) {
			utils.resObj(res, 400, false, 'email formatted incorrectly', null);
		}
		db.oneOrNone(queries.PQ_userLogin, [req.body.email])
			.then( data1 => {
				if (data1){
					if (login_utils.comparePassword(data1.user_password, req.body.user_password)){
						var isAdmin;
						fetchToken(req.body.email, data1)
						.then(data => {
							if (data){
								jwt.verify(data.u_token, config.u_secret, function(err, decoded) {
									if (err) {
										utils.resObj(res, 403, false, 'invalid token', err);
									} else {
										if (decoded.grp == 2){
											isAdmin = true;
										} else {
											isAdmin = false;
										}
										data1['admin'] = isAdmin;
										utils.resObj(res, 200, true, 'authorized user', data1);
										var date_time = datetime.create();
										date_time = date_time.format('Y/m/d H:M:S');
										utils.logActivity(data1.user_id, date_time, "[logged in]")
											.then({})
											.catch(error => {
												console.log('ERROR:', error); // print the error
												utils.resObj(res, 500, false, 'error: loggin not logged', error);
											})
											.finally(db.end);
									}
								})
							} else {
								utils.resObj(res, 403, false, 'could not verify user', null);								
							}
						})
						.catch(err => {
							console.log('ERROR:', err); // print the error
							utils.resObj(res, 500, false, 'error: failed to verify token', err);
						})
						.finally(db.end);
					} else {
						utils.resObj(res, 403, false, 'incorrect password', null);
					}
				} else {
					utils.resObj(res, 403, false, 'user not found', null);
				}
			})
			.catch(error => {
				console.log('ERROR:', error); // print the error
				utils.resObj(res, 500, false, 'error: login failed', error);
			})
			.finally(db.end);
	}

// signup =====================================================================

	function verifyInvite(req, res){
		jwt.verify(req.params.v_token, config.v_secret, function(err, decoded) {
			if (err) {
				utils.resObj(res, 403, false, 'invalid verification link', null);
			} else {
				var data = {};
				data['email'] = decoded.usr;
				data['user_group_id'] = decoded.grp;
				utils.resObj(res, 200, true, 'Welcome, ' + decoded.usr + '!\nPlease fill in the following form to complete signup...', data);
				// if success = true here, Angular needs to open/redirect to the signup form
			}
		})
	}

	function signup(req, res) {
		if (!req.body.email || !req.body.user_group_id || !req.body.user_password || !req.body.first_name || !req.body.last_name || !req.body.phone_number || !req.body.v_token) {
			utils.resObj(res, 400, false, 'missing values', null);
		} else if(!login_utils.isValidEmail(req.body.email)) {
			utils.resObj(res, 400, false, 'email formatted incorrectly', null);
		}
		utils.userExists(req.body.email)
		.then(data => {
			if (data){
				const hashedPassword = login_utils.hashPassword(req.body.user_password);
				db.none(queries.PQ_userSignup, [req.body.first_name, req.body.last_name, req.body.phone_number, hashedPassword, true, req.body.user_group_id, req.body.email])
					.then( function() {
						console.log("test!");
						utils.resObj(res, 200, true, 'completed signup!', null);
						db.none(queries.PQ_addNewUserToken, [u_token, req.bodyemail])
						.then( function (){
							console.log(u_token.usr);
						})
						.catch(error => {
							console.log('ERROR:', error); // print the error
							utils.resObj(res, 500, false, 'error: failed to create token for user', error);
						})
						.finally(db.end);
						utils.resObj(res, 200, true, 'completed signup!', null);
					})
					.catch(error => {
						console.log('ERROR:', error); // print the error
						utils.resObj(res, 500, false, 'error: failed to complete signup', error);
					})
					.finally(db.end);
				const u_token = jwt.sign({usr: req.body.email, grp: req.body.user_group_id}, config.u_secret);

			} else {
				utils.resObj(res, 400, false, "user with that email doesn't exist", null);
			}	
		})
	}
/*
	const hashedPassword = login_utils.hashPassword(req.body.user_password);
	db.none(queries.PQ_addNewUser, [req.body.first_name, req.body.last_name, req.body.phone_number, req.body.email, hashedPassword, true, req.body.user_group_id])
		.then( function() {
			utils.resObj(res, 200, true, 'created new user', null);
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 500, false, 'error: failed to create new user', error);
		})
		.finally(db.end);

	const token = jwt.sign({usr: req.body.email, grp: req.body.user_group_id}, config.u_secret);
	db.none(queries.PQ_addNewUserToken, [token, req.body.email])
		.then()
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.resObj(res, 500, false, 'error: failed to create token for user', error);
		})
		.finally(db.end);
*/
// update user ================================================================

	function updateUser(req, res){ // separate update for password, email
		utils.userExistsID(req.body.user_id)
		.then(data => {
			if (data){
				db.none(queries.PQ_updateUser, [req.body.first_name, req.body.last_name, req.body.phone_number, req.body.user_id])
				.then(data => {
					utils.resObj(res, 200, true, 'user updated', null);
				})
				.catch(error => {
					console.log('Error:', error);
					utils.resObj(res, 500, false, 'error: user not updated', error);
				})
				.finally(db.end);
			}
			else {
				utils.resObj(res, 400, false, 'user with specified user_id does not exist', null);
			}
		})
		.catch(err => {
			console.log('ERROR:', err); // print the error
			utils.resObj(res, 500, false, 'error: failed to update user', err);
		})
		.finally(db.end);
	};

	function updateUserStats(req, res){
		utils.userExistsID(req.body.user_id)
		.then(data => {
			if (data){
				db.none(queries.PQ_updateUserStats, [req.body.user_id, req.body.exp_increase])
				.then(data => {
					utils.resObj(res, 200, true, 'user stats updated', null);
				})
				.catch(error => {
					console.log('Error:', error);
					utils.resObj(res, 500, false, 'error: user stats not updated', error);
				})
				.finally(db.end);
			}
			else {
				utils.resObj(res, 400, false, 'user with specified user_id does not exist', null);
			}
		})
		.catch(err => {
			console.log('ERROR:', err); // print the error
			utils.resObj(res, 500, false, 'error: failed to update user stats', err);
		})
		.finally(db.end);
	};

	function setUserStats(req, res){
		utils.userExistsID(req.body.user_id)
		.then(data => {
			if (data){
				db.none(queries.PQ_setUserStats, [req.body.user_id, req.body.exp_points])
				.then(data => {
					utils.resObj(res, 200, true, 'user stats updated', null);
				})
				.catch(error => {
					console.log('Error:', error);
					utils.resObj(res, 500, false, 'error: user stats not updated', error);
				})
				.finally(db.end);
			}
			else {
				utils.resObj(res, 400, false, 'user with specified user_id does not exist', null);
			}
		})
		.catch(err => {
			console.log('ERROR:', err); // print the error
			utils.resObj(res, 500, false, 'error: failed to update user stats', err);
		})
		.finally(db.end);
	};

	function updateUserPassword(req, res){
		utils.userExistsID(req.body.user_id)
		.then(data => {
			if (data){
				hashedPassword = login_utils.hashPassword(req.body.user_password);
				db.none(queries.PQ_updateUserPassword, [req.body.user_id, hashedPassword])
				.then(data => {
					utils.resObj(res, 200, true, 'user password updated', null);
				})
				.catch(error => {
					console.log('Error:', error);
					utils.resObj(res, 500, false, 'error: user password not updated', error);
				})
				.finally(db.end);
			}
			else {
				utils.resObj(res, 400, false, 'user with specified user_id does not exist', null);
			}
		})
		.catch(err => {
			console.log('ERROR:', err); // print the error
			utils.resObj(res, 500, false, 'error: failed to update user stats', err);
		})
		.finally(db.end);
	};

// deleteUser =================================================================

	function deleteUser(req, res){
		utils.userExistsID(req.params.user_id)
		.then(data =>{
			if (data){
				db.result(queries.PQ_deleteUser, [req.params.user_id])
				.then( result => {
					if (result.rowCount){
						utils.resObj(res, 200, true, 'user has been permanently deleted', null);
					} else {
						utils.resObj(res, 400, false, 'failed to delete user', null);
					}
				})
				.catch(err => {
					console.log('ERROR:', err); // print the error
					utils.resObj(res, 500, false, 'error: failed to delete user', err);
				})
				.finally(db.end);
			} else {
				utils.resObj(res, 400, false, 'user with specified user_id does not exist', null);
			}
		})
		.catch(error => {
			console.log('Error:', error);
			utils.resObj(res, 500, false, 'error: failed to delete user, failed to find user', error);
		})
		.finally(db.end);
	}

// safeDeleteUser =================================================================

	function safeDeleteUser(req, res){
		utils.userExistsID(req.body.user_id)
		.then(data =>{
			if (data){
				db.none(queries.PQ_safeDeleteUser, [req.body.user_id])
				.then( function() {
					utils.resObj(res, 200, true, 'user has been deactivated, to restore go to trash', null);
				})
				.catch(err => {
					console.log('ERROR:', err); // print the error
					utils.resObj(res, 500, false, 'error: failed to deactivate user', err);
				})
				.finally(db.end);
			} else {
				utils.resObj(res, 400, false, 'no active user with that user_id', null);
			}
		})
		.catch(error => {
			console.log('Error:', error);
			utils.resObj(res, 500, false, 'error: failed to deactivate user, failed to find user', error);
		})
		.finally(db.end);
	}

module.exports = {
	getSingleUser: getSingleUser,
	getAllUsers: getAllUsers,
	addNewUser: addNewUser,
	rememberMe: rememberMe,
	login: login,
	signup: signup,
	verifyInvite: verifyInvite,
	updateUser: updateUser,
	updateUserStats: updateUserStats,
	setUserStats: setUserStats,
	updateUserPassword: updateUserPassword,
	deleteUser: deleteUser,
	safeDeleteUser: safeDeleteUser
};