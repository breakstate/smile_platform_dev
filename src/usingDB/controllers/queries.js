const PQ = require('pg-promise').ParameterizedQuery;

// utils
const PQ_userExists = new PQ('SELECT user_id FROM user_info WHERE email = $1');
const PQ_userExistsID = new PQ('SELECT user_id FROM user_info WHERE user_id = $1');
const PQ_noteExists = new PQ('SELECT note_id FROM notes WHERE note_id = $1');
const PQ_commitmentExists = new PQ('SELECT goal_id FROM goal WHERE goal_id = $1');
const PQ_completedCommitmentExists = new PQ('SELECT goal_id FROM completed_goals WHERE goal_id = $1');
const PQ_checkinExists = new PQ('SELECT checkin_id FROM check_in WHERE checkin_id = $1');


// user.js
const PQ_getSingleUser = new PQ('SELECT * FROM user_info WHERE user_id=$1');
const PQ_getAllUsers = new PQ('SELECT * FROM user_info');//.token FROM user_info INNER JOIN authentication ON user_info.user_id = authentication.user_id');
const PQ_userLogin = new PQ('SELECT email, user_password, user_id, v_token FROM user_info WHERE email = $1'); // v_token to be replace with u_token
const PQ_addNewUser = new PQ('INSERT INTO user_info(first_name, last_name, phone_number, email, user_password, verified, user_group_id, v_token) VALUES($1, $2, $3, $4, $5, $6, $7, $8)');
const PQ_addNewUserVerifyToken = new PQ('UPDATE user_info SET v_token = $1 WHERE email = $2'); // add verify_token here once implemented
const PQ_getUserToken = new PQ('SELECT v_token FROM user_info WHERE email = $1');
const PQ_getUserId = new PQ('SELECT user_id FROM user_info WHERE email = $1');
const PQ_deleteUser = new PQ('DELETE FROM user_info WHERE user_id = $1');

// commitments.js
const PQ_createCommitment = new PQ('INSERT INTO goal(goal_title, goal_description, start_date, end_date, start_time, end_time, is_full_day, is_recurring, user_id, created_by, created_date, parent_goal_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)'); // duration instead of end time maybe
const PQ_getCommitmentsByUser = new PQ("SELECT goal_id, goal_title, goal_description, TO_CHAR(start_date, 'yyyy-mm-dd') as start_date, TO_CHAR(end_date, 'yyyy-mm-dd') as end_date, start_time, end_time, is_full_day, is_recurring, user_id, created_by, TO_CHAR(created_date, 'yyyy-mm-dd') as created_date, parent_goal_id FROM goal WHERE user_id = $1");//('SELECT * FROM goal WHERE user_id = $1');
const PQ_getAllCommitments = new PQ('SELECT * FROM goal');
const PQ_updateCommitment = new PQ('UPDATE goal SET goal_title=$1, goal_description=$2, start_date=$3, end_date=$4, start_time=$5, end_time=$6, is_full_day=$7, is_recurring=$8, goal_id=$9 WHERE goal_id=$9');
const PQ_deleteCommitment = new PQ('DELETE FROM goal WHERE goal_id = $1');// update table to show goal_id instead of id

// completed commitments.js
const PQ_createCompletedCommitment = new PQ('INSERT INTO completed_goals(goal_id, date_completed, note, satisfaction) VALUES($1, $2, $3, $4)');
const PQ_setCommitmentComplete = new PQ('UPDATE goal SET complete=$1 WHERE goal_id=$2')
const PQ_getCompletedCommitmentsByUser = new PQ("SELECT t1.goal_id, t1.date_completed, t1.note, t1.satisfaction FROM completed_goals t1 INNER JOIN goal t2 ON t1.goal_id = t2.goal_id AND t2.user_id = $1");//SELECT goal_id, date_completed, note, satisfaction FROM completed_goals WHERE user_id = $1");//('SELECT * FROM goal WHERE user_id = $1');
const PQ_getAllCompletedCommitments = new PQ('SELECT * FROM completed_goals');
//const PQ_deleteCompletedCommitment = new PQ('DELETE FROM goal WHERE goal_id = $1');// update table to show goal_id instead of id

// notes.js
const PQ_createNote = new PQ('INSERT INTO notes(user_id, note, date_created, is_edited, date_edited) VALUES($1, $2, $3, $4, $5)');
const PQ_getNotesByUser = new PQ('SELECT * FROM notes WHERE user_id = $1');
const PQ_getAllNotes = new PQ('SELECT * FROM notes');
const PQ_updateNote = new PQ('UPDATE notes SET note=$1, date_edited=$2, is_edited=$3 WHERE note_id=$4')
const PQ_deleteNote = new PQ('DELETE FROM notes WHERE note_id = $1');

// checkins.js
const PQ_createCheckin = new PQ('INSERT INTO check_in(user_id, date_answered, time_answered, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25, q26, q27, q28, q29, q30, q31, q32, q33, q34) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37)'); // duration instead of end time maybe
const PQ_getCheckinsByUser = new PQ("SELECT checkin_id, user_id, TO_CHAR(date_answered, 'yyyy-mm-dd') as date_answered, time_answered, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25, q26, q27, q28, q29, q30, q31, q32, q33, q34 FROM check_in WHERE user_id = $1");
const PQ_getAllCheckins = new PQ("SELECT checkin_id, user_id, TO_CHAR(date_answered, 'yyyy-mm-dd') as date_answered, time_answered, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25, q26, q27, q28, q29, q30, q31, q32, q33, q34 FROM check_in");
//const PQ_updateCheckin = new PQ('UPDATE goal SET goal_title=$1, goal_description=$2, start_date=$3, end_date=$4, start_time=$5, end_time=$6, is_full_day=$7, is_recurring=$8, goal_id=$9 WHERE goal_id=$9');
const PQ_deleteCheckin = new PQ('DELETE FROM check_in WHERE checkin_id = $1');


/*
EXAMPLES:

TO_CHAR(start_date, 'yyyy-mm-dd') as start_date

SELECT t1.completed_date, t2.goal_description, t3.first_name
FROM completed_goals t1 INNER JOIN goal t2 ON t1.goal_id = t2.goal_id 
INNER JOIN user_info t3 ON t2.user_id = t3.user_id
*/ 

//SELECT t1.goal_id, t1.date_completed, t1.note, t1.satisfaction FROM completed_goals t1 INNER JOIN goal t2 ON t1.goal_id = t2.goal_id AND t2.user_id = $1
module.exports = {
	// utils
	PQ_userExists : PQ_userExists,
	PQ_userExistsID: PQ_userExistsID,
	PQ_noteExists: PQ_noteExists,
	PQ_commitmentExists: PQ_commitmentExists,
	PQ_completedCommitmentExists: PQ_completedCommitmentExists,
	PQ_checkinExists: PQ_checkinExists,

	// user.js
	PQ_getSingleUser: PQ_getSingleUser,
	PQ_getAllUsers: PQ_getAllUsers,
	PQ_userLogin: PQ_userLogin,
	PQ_getUserToken: PQ_getUserToken,
	PQ_addNewUser: PQ_addNewUser,
	PQ_addNewUserVerifyToken: PQ_addNewUserVerifyToken,
	PQ_getUserId : PQ_getUserId,
	PQ_deleteUser: PQ_deleteUser,

	// commitments.js
	PQ_createCommitment: PQ_createCommitment,
	PQ_getCommitmentsByUser: PQ_getCommitmentsByUser,
	PQ_getAllCommitments: PQ_getAllCommitments,
	PQ_updateCommitment: PQ_updateCommitment,
	PQ_deleteCommitment: PQ_deleteCommitment,

	// notes.js
	PQ_createNote: PQ_createNote,
	PQ_getNotesByUser: PQ_getNotesByUser,
	PQ_getAllNotes: PQ_getAllNotes,
	PQ_updateNote: PQ_updateNote,
	PQ_deleteNote: PQ_deleteNote,

	// completed commitments.js
	PQ_createCompletedCommitment: PQ_createCompletedCommitment,
	PQ_setCommitmentComplete: PQ_setCommitmentComplete,
	PQ_getCompletedCommitmentsByUser: PQ_getCompletedCommitmentsByUser,
	PQ_getAllCompletedCommitments: PQ_getAllCompletedCommitments,
//	PQ_deleteCompletedCommitment: PQ_deleteCompletedCommitment,

	// checkins.js
	PQ_createCheckin: PQ_createCheckin,
	PQ_getCheckinsByUser: PQ_getCheckinsByUser,
	PQ_getAllCheckins: PQ_getAllCheckins,
//	PQ_updateCheckin: PQ_updateCheckin,
	PQ_deleteCheckin: PQ_deleteCheckin
};