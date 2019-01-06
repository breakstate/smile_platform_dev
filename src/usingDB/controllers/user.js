const jwt			= require('jsonwebtoken');

const login_utils	= require('./login_utils');
const utils			= require('./utils');
const queries		= require('./queries');
const config		= require('../../../config.js');

const db			= config.db;

// getSingleUser ==============================================================

	function getSingleUser(req, res){
		db.oneOrNone(queries.PQ_getSingleUser, [req.params.user_id])
		.then(data => {
			if (data){
				res.status(200)
				.json({
					success: true,
					message: 'Retrieved single user',
					data: data
				});
			}
			else {
				res.status(200)
				.json({
					success: false,
					message: 'No user with specified user_id',
				});
			}
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error
			utils.returnErrObj(res, 200, 'failed to get user', error);
		})
		.finally(db.end);
	}

// getAllUsers ================================================================

	function getAllUsers(req, res) {
		if (1){
			//console.log('Got a word in');
		}
		db.any(queries.PQ_getAllUsers) // took very long for some reason // test
			.then(data => {
				res.status(200)
				.json({
					success: true,
					data: data,
					message: 'Retrieved ALL users'
				});
			})
			.catch(error => {
				console.log('ERROR:', error); // print the error
			})
			.finally(db.end);
	}

// addNewUser =================================================================

	function addNewUser(req, res) { // DEV version, doesn't implement verify_token
		if (!req.body.email || !req.body.user_password || !req.body.first_name || !req.body.last_name || !req.body.phone_number || !req.body.user_group_id) {
			return res.status(400)
			.json({
				success: false,
				message: 'missing values'
			})
		} else if(!login_utils.isValidEmail(req.body.email)) {
			return res.status(400)
			.json({
				success: false,
				message: 'email formatted incorrectly'
			})
		}
		utils.userExists(req.body.email)
		.then(data => {
			if (data.length){
				console.log('user exists');
				return res.status(200)
				.json({
					success: false,
					message: 'user with that email already exists'
				})
			}
			else {
				console.log('user does not exist');
		// verify other fields as well
		const hashedPassword = login_utils.hashPassword(req.body.user_password);
		
		db.none(queries.PQ_addNewUser, [req.body.first_name, req.body.last_name, req.body.phone_number, req.body.email, hashedPassword, false, req.body.user_group_id, 0])
			.then( function() {
				res.status(200)
				.json({
					success: false,
					message: 'created new user'
				});
			})
			.catch(error => {
				console.log('ERROR:', error); // print the error
			})
			.finally(db.end);

		const token = jwt.sign({usr: req.body.email, grp: req.body.user_group_id}, config.secret);
		db.none(queries.PQ_addNewUserVerifyToken, [token, req.body.email])
			.then(/*  function () {
				//user_id = data.user_id
				res.status(200)
				.json({
					tok: token
				});
			}*/)
			.catch(error => {
				console.log('ERROR:', error); // print the error
			})
			.finally(db.end);
		}
	})
}
// authenticateUser ===========================================================
/*
	function authenticateUser(req, res){
		if (!req.body.email || !req.body.user_password) {
			return res.status(400)
			.json({
				success: false,
				message: 'email and/or password missing'
			})
		} else if (!login_utils.isValidEmail(req.body.email)) {
			return res.status(400)
			.json({
				success: false,
				message: 'email formatted incorrectly'
			})
		}
		db.oneOrNone({
			name: 'find-user',
			text: 'select email, user_password from user_info where email = $1', // can also be QueryFile object
			values: [req.body.email] // sterlilized
		})
			.then( data => {
				if (data){
					if (login_utils.comparePassword(data.user_password, req.body.user_password)){

						var token = jwt.sign({foo: 'bar', user: data.email}, config.secret);
						var decoded = jwt.verify(token, config.secret);
						console.log(decoded.user)

						res.status(200)
						.json({
							success: true,
							message: 'Authenticating',
							token1: token,
							data: data,
							data2 : data.user_password,
							data1: data.email,
						})
					} else {
						res.status(200)
						.json({
							success: false,
							message: 'incorrect password',
							data: data,
							data1: data.email,
							data2: data.user_password,
							data3: req.body.user_password
						})
					}
				} else {
					res.status(200)
					.json({
						success: false,
						message: 'user ' + req.body.email + ' not found',
					})
				}
			})
			.catch(error => {
				console.log('ERROR:', error); // print the error
			})
			.finally(db.end);
		//console.log('POST user authentication: SUCCEEDED');
	}
*/



// getUserId ==================================================================

	function getUserId(email){
		
	}

// fetchToken =================================================================
/*
	function fetchToken(user_id){
		var token;
		db.one(queries.PQ_getUserToken, [user_id])
			.then( data => {
				token = data.token;
			})
			.catch(error => {
				console.log('ERROR:', error); // print the error
			})
			.finally(db.end);
		return token;
	}
*/
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
		//var decoded;
		var isAdmin;
		if (!req.body.token){
			utils.resObj(res, 400, false, 'no token provided', null);
		} else {
			jwt.verify(req.body.token, config.secret, function(err, decoded) {
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
						} else {
							utils.resObj(res, 400, false, 'unauthorized user', null);
						}
					})
					.catch(error => {
						console.log('ERROR:', error); // print the error
					})
					.finally(db.end);
				}
			})
		}
	}

	function login(req, res){
		if (!req.body.email || !req.body.user_password || !req.body.email.length || !req.body.user_password.length) {
			return res.status(400)
			.json({
				success: false,
				message: 'email and/or password missing'
			})
		} else if (!login_utils.isValidEmail(req.body.email)) {
			return res.status(200)
			.json({
				success: false,
				message: 'email formatted incorrectly'
			})
		}
		db.oneOrNone(queries.PQ_userLogin, [req.body.email])
			.then( data1 => {
				if (data1){
					if (login_utils.comparePassword(data1.user_password, req.body.user_password)){

						//var token = jwt.sign({foo: 'bar', user: data.email}, config.secret);
						//var decoded = jwt.verify(token, config.secret);
						//console.log(decoded.user)

						//const token = fetchToken(data.user_id);
						//var decoded = jwt.verify(token, config.secret);
						//console.log(decoded.user)
						// token to be stored locally by front end

						var isAdmin;

						fetchToken(req.body.email, data1)
						.then(data => {
							if (data){
								console.log(data.v_token);
								var decoded = jwt.verify(data.v_token, config.secret);
								console.log(decoded);
								if (decoded.grp == 2){
									isAdmin = true;
								} else {
									isAdmin = false;
								}
								console.log(data1.email);
								data1['admin'] = isAdmin;

								res.status(200)
								.json({
									success: true,
									message: 'authorized user',
									data: data1,
								})
							}
							else {}})
						.catch(err => {
							console.log('ERROR:', error); // print the error
						})
					} else {
						res.status(200)
						.json({
							success: false,
							message: 'incorrect password'
						})
					}
				} else {
					res.status(200)
					.json({
						success: false,
						message: 'user ' + req.body.email + ' not found',
					})
				}
			})
			.catch(error => {
				console.log('ERROR:', error); // print the error
			})
			.finally(db.end);
	}

// updateUser =================================================================

	function updateUser(req, res){
		// check if token has admin rights
		db.none('update user_info set first_name=$1, last_name=$2, phone_number=$3, email=$4, user_id=$5, user_password=$6 where user_id=$5',
		[req.body.first_name, req.body.last_name, req.body.phone_number, req.body.email, req.body.user_id, req.body.user_password])
		.then(data => {
			res.status(200)
				.json({
					success: true,
					message: 'Updated user'
				});
			})
		.catch(error => {
			console.log('Error:', error);
			})
		.finally(db.end);
	}

// deleteUser =================================================================

	function deleteUser(req, res){
		db.result(queries.PQ_deleteUser, [req.params.user_id])
		.then( result => {
			res.status(200)
				.json({
				  success: true,
				  message: `Removed ${result.rowCount} user`
			});
		})
		.catch(error => {
			console.log('Error:', error);
		})
		.finally(db.end);
	  //console.log('DELETE to remove user: SUCCEEDED');
	}

module.exports = {
	getSingleUser: getSingleUser,
	getAllUsers: getAllUsers,
	addNewUser: addNewUser,
	rememberMe: rememberMe,
	login: login,
	//authenticateUser: authenticateUser,
	updateUser: updateUser,
	deleteUser: deleteUser
};