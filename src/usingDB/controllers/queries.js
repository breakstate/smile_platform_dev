const PQ = require('pg-promise').ParameterizedQuery;

// user.js
const PQ_getAllUsers = new PQ('SELECT * FROM user_info');//.token FROM user_info INNER JOIN authentication ON user_info.user_id = authentication.user_id');
const PQ_userLogin = new PQ('SELECT email, user_password, user_id, v_token FROM user_info WHERE email = $1'); // v_token to be replace with u_token
const PQ_addNewUser = new PQ('INSERT INTO user_info(first_name, last_name, phone_number, email, user_password, verified, user_group_id, v_token) VALUES($1, $2, $3, $4, $5, $6, $7, $8)');
const PQ_addNewUserVerifyToken = new PQ('UPDATE user_info SET v_token = $1 WHERE email = $2'); // add verify_token here once implemented
const PQ_getUserToken = new PQ('SELECT v_token FROM user_info WHERE email = $1');
const PQ_getUserId = new PQ('SELECT user_id FROM user_info WHERE email = $1');
const PQ_userExists = new PQ('SELECT user_id FROM user_info WHERE email = $1');

// commitments.js
const PQ_getCommitmentByUser = new PQ('SELECT * FROM goal WHERE user_id = $1')


/*
SELECT t1.completed_date, t2.goal_description, t3.first_name
FROM completed_goals t1 INNER JOIN goal t2 ON t1.goal_id = t2.goal_id 
INNER JOIN user_info t3 ON t2.user_id = t3.user_id
*/ 
module.exports = {
	PQ_getAllUsers: PQ_getAllUsers,
	PQ_userLogin: PQ_userLogin,
	PQ_getUserToken: PQ_getUserToken,
	PQ_addNewUser: PQ_addNewUser,
	PQ_addNewUserVerifyToken: PQ_addNewUserVerifyToken,
	PQ_getUserId : PQ_getUserId,
	PQ_userExists : PQ_userExists
};