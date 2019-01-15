# SMILE API DOC

## Index
- [basic_overview](#basic_overview)
- [features](#Features)
  - [implemented_features](#implemeted_features)
  - [future_features](#future_features)
- [technical_overview](#technical_overview)
- [setup](#setup)
- [usage](#usage)
- [endpoints](#endpoints)
  - [admin](#admin)
  - [achievements](#achievements)
  - [achievements_d](#achievements_d)
  - [analytics](#analytics)
  - [checkins](#checkins)
  - [commitments](#commitments)
  - [completed_commitments](#completed_commitments)
  - [media](#media)
  - [motivational](#motivational)
  - [notes](#notes)
  - [notifications](#notifications)
  - [users](#users)
- [links](#links)
  
## Basic_overview
API stands for Application Programming Interface. It is responsible for taking requests for information (from our Angular front end, in our case), retreiving that information from our databse, and then returning that information to our Angular front end to be displayed in a meaningful way. Our API is an ExpressJS application and interacts with our Angular front end and PostgreSQL database.  

## Features
### Implemented_features
The features will be listed in the following format: Feature name, feature description.
Terminology:
- CRUD (Create, Read, Update and Delete)

The API has the following features implemented:
- add new user
  - This is used to force verify a user for testing purposes. The email does not have to exist but still needs to be in the correct format.
- CRUD for users.
  - Create, Read Update, and Delete of all users in the system. This includes achievements, information and stats.
- Secure signup and login.
  - Hashed passwords and JSON Web Token authentication on login (routes are not protected int the API at this time, only in the front end)
- Admin ability to invite new users by email
  - Invites user to create an account, also token verified.
- Admin ability to generate u_token manually
  - This can be used to update or change a u_toke for testing purposes.
- Password reset for users
  - Resets the password via confirmation email.
- Notifications
  - CRUD for notifications (notifications have a seen/unseen attribute)
- Notes
  - CRUD for User-created notes
- Motivations quotes
  - CRUD for motivational quotes 
- Media 
  - CRUD for media (online storage solution is needed)
- Commitments
  - CRUD for commitments as well as for completed commitments for commitment tracking
- Checkin system
  - CRUD for checkin system
- Analytics and data tracking
  - CRUD for analytics. The API tracks when users login, create commitments, create notes, create checkins or complete commitments.  

## Technical_overview
There is no separate dev or prod environment implemented at this time. In its current form it can be hosted on heroku (tested).  
- All CRUD functions can be found in src/usingDB/controllers.
- server.js is the entry point of our Express API.
- package.json contains all of the depencies of the project.
- Included is a "collection file" which can be imported into postman. It includes all of the functional endpoints of the API. These are named "SocialTechLocal.postman_collection.json" and "SocialTechLive.postman_collection.json" for when locally hosting and live hosting, respectively. The SocialTechLive url will need to be updated depending on your hosting choices (just open the .json and change all occurances of the url and you'll be fine).
- All functions that were not directly pertinent to endpoints were saved in folders containing the world "utils"
  

<hr>  

## Setup
###### Linux
The following process will take you through installation of nodejs v 10.x (Latest release, not LTS)  
```sudo apt-get update```  
```sudo apt install curl```  
```curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -```  
```sudo apt-get install nodejs```  
```sudo apt-get install npm```  
```npm install```

<hr>  

## Usage
Install postman from https://www.getpostman.com/ or install the Chrome app  
  
For requests requiring input:
- key: value pairs go in the **Body** section
- select x-www-form-urlencoded radio button
- select JSON from the drop-down menu above the output

<hr>  

## Endpoints

**HTTP request type:**
**End point:**
**Body:**
**Note:**

<hr>  

### Admin
#### Invite new user
**HTTP request type:** POST  
**End point:** REDACTED DUE TO LIMITED EMAILS  
**Note:** This will send an email containing a singup link and verification token to the specified email.  

#### Generate u_token manually
**HTTP request type:** POST  
**End point:** [url]/api/admin/generate_token  
**Body:** email, user_group_id  
**Note:** This will return a u_token.  

<hr>  

### Achievements
#### Add new user achievement
**HTTP request type:** POST  
**End point:** [url]/api/achievements  
**Body:** id, user_id, percent_complete, last_entry, next_entry, time  
**Note:** This creates new user achievement associated with the specified user_id, and of achievementtype: id.  

#### Get all achievements
**HTTP request type:** GET  
**End point:** [url]/api/achievements  
**Note:** This will return all achievements  

#### Get achievements by user_id
**HTTP request type:** GET  
**End point:** [url]/api/achievements/:user_id  
**Note:** This will return all achievements for specified user_id  

<hr>  

### Achievements_d
#### Add new achievement type
**HTTP request type:** POST  
**End point:** [url]/api/achievements_d  
**Body:** id, name, xp_worth  
**Note:** this id is one of the only ones that we have to specify ourselves. This is because the achievements will be handmade by the admins and won't be changed dynamically. They will be static.  

#### Update achievement type
**HTTP request type:** GET  
**End point:** [url]/api/achievements_d  
**Body:**   
**Note:** Gets list of all achievement types currently stored.  

#### Delete motivational entry
**HTTP request type:** DELETE  
**End point:** [url]/api/achievements_d/:id  
**Note:** Simply add the id value to the url, eg. ```.../api/achievements_d/2```. "status" in returned object will be "fail" if the the specified media entry does not exist.   
**WARNING: this action cannot be undone.**  

<hr>  

### Analytics
#### Get all activity logs
**HTTP request type:** GET  
**End point:** [url]/api/analytics/all  
**Note:** This will return all activity logs  

#### Get activity logs by user_id
**HTTP request type:** GET  
**End point:** [url]/api/analytics/by_user/:user_id  
**Note:** This will return all activity logs by user. eg ```...by_user/2```  

#### Get activity logs by date
**HTTP request type:** GET  
**End point:** [url]/api/analytics/by_date/:date  
**Note:** This will return all activity logs by user. eg ```...by_date/2019-01-10```  

#### Get activity logs by user_id and date
**HTTP request type:** GET  
**End point:** [url]/api/analytics/by_user_date/:user_id/:date  
**Note:** This will return all activity logs by user and date. eg ```...by_user/2/2019-01-10```  

<hr>  

### Checkins
#### Add new checkin entry
**HTTP request type:** POST  
**End point:** [url]/api/checkins  
**Body:** user_id, date_answered, time_answered, q1...q34  
**Note:** eg of date format: ```Jan, 01, 2019 or 2019-01-01```.  

#### Get checkins by user
**HTTP request type:** GET  
**End point:** [url]/api/checkins/:user_id  
**Note:** This will return all checkins from specified user_id

#### Get all checkins
**HTTP request type:** GET  
**End point:** [url]/api/checkins  
**Note:** This will return all checkins  

#### Update checkin
**HTTP request type:** PUT  
**End point:**  
**Body:**  
**Note:** Implementation pending until deemed necessary?  

#### Delete checkin
**HTTP request type:** DELETE  
**End point:** [url]/api/checkins/:checkin_id  
**Note:** Simply add the checkin_id value to the url, eg. ```.../api/checkins/2```. "status" in returned object will be "fail" if the the specified note_id does not exist.   
**WARNING: this action cannot be undone.**  

<hr>  

### Commitments
#### Add new GOAL
**HTTP request type:** POST  
**End point:** [url]/api/commitments  
**Body:** goal_title, goal_description, start_date, end_date, start_time, end_time, is_full_day, is_recurring, user_id, created_by, created_date, difficulty  
**Note:** Note that this is not a mistake. The endpoints for creating commitments is the same as for creating goals. The body is the only thing that differs. eg of date format: ```Jan, 01, 2019 or 2019-01-01```, eg of timestamp format: ```2018-12-12 17:00:00``` (May need to change these). Refer to db spreadsheet for more info.

#### Add new COMMITMENT
**HTTP request type:** POST  
**End point:** [url]/api/commitments  
**Body:** goal_title, goal_description, start_date, end_date, start_time, end_time, is_full_day, is_recurring, user_id, created_by, created_date, parent_goal_id, difficulty, recurring_type, separation_count, max_occurrence, hour_of_day, day_of_week, day_of_month, day_of_year, week_of_month, week_of_year, month_of_year  
**Note:**  eg of date format: ```Jan, 01, 2019 or 2019-01-01```, eg of timestamp format: ```2018-12-12 17:00:00``` (May need to change these). Refer to db spreadsheet for more info. Commitments will need their recurring_pattern information when being created.

#### Get commitment by user
**HTTP request type:** GET  
**End point:** [url]/api/commitments/:user_id  
**Note:** This will return all commitments from specified user_id (May add get commitment by commitment ID)

#### Get all commitments
**HTTP request type:** GET  
**End point:** [url]/api/commitments  
**Note:** This will return all commitments

#### Get single commitments by goal_id
**HTTP request type:** GET  
**End point:** [url]/api/commitment_id/:goal_id  
**Note:** This will return commitment with specified goal_id if it exists

#### Update commitment
**HTTP request type:** PUT  
**End point:** [url]/api/commitments  
**Body:** goal_title, goal_description, start_date, end_date, start_time, end_time, is_full_day, is_recurring, goal_id  
**Note:** eg of date format: ```Jan, 01, 2019 or 2019-01-01```. eg of timestamp format: ```17:00:00```. See sheet for types. All values must be present - any number of values can be changes in a single request, but unchanged values need to be included as well.  

#### SAFE delete commitment
**HTTP request type:** POST  
**End point:** [url]/api/commitments/safe_delete  
**Body:** goal_id  
**Note:** This will set active to false  

#### Delete commitment
**HTTP request type:** DELETE  
**End point:** [url]/api/commitments/:id  
**Note:** Simply add the user_id value to the url, eg. ```.../api/commitments/2```  
**WARNING: this action cannot be undone.**  

<hr>  

### Completed_commitments
#### Set commitment as complete
**HTTP request type:** POST  
**End point:** [url]/api/completed_commitments  
**Body:** goal_id, date_completed, note, satisfaction  
**Note:**  eg of date format: ```Jan, 01, 2019 or 2019-01-01```. This will change the "completed" value of the related commitment to true in the "commitments" table. Recurring patterns usage needs to be finalized.  

#### Get completed commitment by user
**HTTP request type:** GET  
**End point:** [url]/api/completed_commmitment/:user_id  
**Note:** Simply add the user_id value to the url, eg. ```.../api/completed_commitments/2```  

#### Get all completed commitments
**HTTP request type:** GET  
**End point:** [url]/api/completed_commitments  
**Note:** This will return all completed commitments  

#### Update completed commitment
**HTTP request type:** PUT  
**End point:**   
**Body:**   
**Note:** Implementaion pending until deemed necessary  

#### Delete commitment
**HTTP request type:** DELETE  
**End point:**   
**Note:** Don't delete yet, may not be necessary  
**WARNING: this action cannot be undone.**  

<hr>  

### Media
#### Add new media entry
**HTTP request type:** POST  
**End point:** [url]/api/media  
**Body:** path_to_media, media_title, user_id  
**Note:**   

#### Get media by user
**HTTP request type:** GET  
**End point:** [url]/api/media/:user_id  
**Note:** This will return all media entries from specified user_id

#### Get all media
**HTTP request type:** GET  
**End point:** [url]/api/media  
**Note:** This will return all media entries  

#### Update media
**HTTP request type:** PUT  
**End point:** [url]/api/media  
**Body:** path_to_media, media_title, media_id  
**Note:** Updates media entry  

#### Delete media
**HTTP request type:** DELETE  
**End point:** [url]/api/media/media_id  
**Note:** Simply add the media_id value to the url, eg. ```.../api/media/2```. "status" in returned object will be "fail" if the the specified media entry does not exist.   
**WARNING: this action cannot be undone.**  

<hr>  

### Motivational
#### Add new motivational entry
**HTTP request type:** POST  
**End point:** [url]/api/motivational  
**Body:** description, tags  
**Note:** tags will be comma delimited and the string needs to be built on the front end. Tags are not high priority, only important for stretch goals.  

#### Get random motivational entry
**HTTP request type:** GET  
**End point:** [url]/api/motivational_r  
**Note:** This will return a random entry from the motivational_messages table  

#### Get all motivational entries
**HTTP request type:** GET  
**End point:** [url]/api/motivational  
**Note:** This will return all motivational entries  

#### Update motivational entry
**HTTP request type:** PUT  
**End point:** [url]/api/motivational  
**Body:** description, tags  
**Note:** tags will be comma delimited and the string needs to be built on the front end. Tags are not high priority, only important for stretch goals.  

#### Delete motivational entry
**HTTP request type:** DELETE  
**End point:** [url]/api/motivational/:motivational_id  
**Note:** Simply add the motivational_id value to the url, eg. ```.../api/media/2```. "status" in returned object will be "fail" if the the specified media entry does not exist.   
**WARNING: this action cannot be undone.**  

<hr>  

### Notes
#### Add new note
**HTTP request type:** POST  
**End point:** [url]/api/notes  
**Body:** user_id, note, date_created  
**Note:** eg of date format: ```Jan, 01, 2019 or 2019-01-01```. "note" is the actual note text.  

#### Get notes by user
**HTTP request type:** GET  
**End point:** [url]/api/notes/:user_id  
**Note:** This will return all notes from specified user_id

#### Get all notes
**HTTP request type:** GET  
**End point:** [url]/api/notes  
**Note:** This will return all notes

#### Update note
**HTTP request type:** PUT  
**End point:** [url]/api/notes  
**Body:** note, date_edited, note_id  
**Note:** eg of date format: ```Jan, 01, 2019 or 2019-01-01```. "status" in returned object will be "fail" if the the specified note_id does not exist.  

#### Delete note
**HTTP request type:** DELETE  
**End point:** [url]/api/notes/:note_id  
**Note:** Simply add the note_id value to the url, eg. ```.../api/notes/2```. "status" in returned object will be "fail" if the the specified note_id does not exist.   
**WARNING: this action cannot be undone.**  

<hr>  

### Notifications
#### Create new notification
**HTTP request type:** POST  
**End point:** .../api/notifications/create  
**Body:** user_id, notification, time_date  
**Note:** notification is just text. Example of date ```.../2019-01-10```. Is unseen by default  

#### Get all notifications by user_id
**HTTP request type:** GET  
**End point:** .../api/notifications/all/:user_id  
**Note:** This will return all notifications (seen and unseen) for user. eg ```...all/2```  

#### Get all unseen noticications by user_id
**HTTP request type:** GET  
**End point:** .../api/notifications/unseen/:user_id  
**Note:** This will return all unseen notifications for user. eg ```...all/2```  

#### Get all seen noticications by user_id
**HTTP request type:** GET  
**End point:** .../api/notifications/seen/:user_id  
**Note:** This will return all seen notifications for user. eg ```...all/2```  

#### Update notification to seen
**HTTP request type:** GET  
**End point:** .../api/notifications/set_as_seen/:id  
**Note:** This will set specified notification's seen value to true in the db.  simply add the id to the url eg ```...set_as_seen/2```  

<hr>  

### Users
#### Add new user to system (DEV use)
**HTTP request type:** POST  
**End point:** [url]/api/users  
**Body:** first_name, last_name, phone_number, email, user_password, user_group_id (refer to db spreadsheet for info on user_group_id  
**Note:** For ease of testing please make the password identical to the first name including any capitalization. This creates a fully verified user that is ready to login without needing to complete signup. Good for testing purposes  

#### Get list of all users
**HTTP request type:** GET  
**End point:** [url]/api/users  
**Note:** This will return all user information from user_info (including hashed passwords) mainly for debugging at this point.  

#### Get single user by user_id
**HTTP request type:** GET  
**End point:** [url]/api/users/:user_id  
**Note:** Simply add the user_id value to the url, eg. ```.../api/users/2```

#### Login
**HTTP request type:** POST  
**End point:** [url]/api/login  
**Body:** email, user_password  
**Note:** login requires the user to have gone through the verification and signup process unless the user was created manually. // maybe move to admin

#### Login with token
**HTTP request type:** POST  
**End point:** [url]/api/token_login  
**Body:** token  
**Note:** Checks to see if token is present, if token is valid, and to see if user exists  

#### Update user INFO
**HTTP request type:** PUT  
**End point:** [url]/api/users/update_info  
**Body:** first_name, last_name, phone_number, user_id  
**Note:** This is meant for updating info that isn't sensative. Password reset will be separate.  

#### Update user STATS
**HTTP request type:** PUT  
**End point:** [url]/api/users/update_stats  
**Body:** user_id, exp_increase  
**Note:** This is meant for updating user stats. exp_increase will add the amount specified to exp_points. Only put the amount to be added, and not the full new amount. More fields to be included shortly!  

#### SET user STATS
**HTTP request type:** PUT  
**End point:** [url]/api/users/set_stats  
**Body:** user_id, exp_points  
**Note:** This is meant for updating user stats. exp_increase will be set to the amount specified to exp_points. Put the new full amount. More fields to be included shortly!  

#### Update user password
**HTTP request type:** POST  
**End point:** [url]/api/users/update_password  
**Body:** user_id, user_password  
**Note:** This callis meant for the last step in updating the user's password. This will be called after the Reset user password (once completed).  

#### Delete user
**HTTP request type:** DELETE  
**End point:** [url]/api/users/:user_id  
**Note:** Simply add the user_id value to the url, eg. ```.../api/users/2```  
**WARNING: this action cannot be undone.**  

#### Verify invitation
**HTTP request type:** GET  
**End point:** [url]/api/users/verify/:v_token  
**Note:** This endpoint peprforms a check to see if the v_token provided is valid. The user will have received this token in an automated email upon being invited by an admin.  
#### Signup
**HTTP request type:** POST  
**End point:** [url]/api/users/users/signup  
**Body:** first_name, last_name, user_password, phone_number, v_token, email, user_group_id  
**Note:** Some values in Body may be redundant. It's hard to guage without the frontend endpoints right now but this is currently functional. This endpoint updates an invited user with all the appropriate information to allow to user to login and use the app.  

<hr>  

## LINKS

- https://scotch.io/tutorials/getting-started-with-node-express-and-postgres-using-sequelize - for when we implement sequalize

- https://websiteforstudents.com/install-the-latest-node-js-and-nmp-packages-on-ubuntu-16-04-18-04-lts/ - ubuntu installation

- https://www.codementor.io/olawalealadeusi896/building-a-simple-api-with-nodejs-expressjs-postgresql-db-and-jwt-3-mke10c5c5 - PEAN + JWT but async instead of promises (helper) *****

- https://medium.com/queers-in-tech/server-side-json-web-token-implementation-with-postgresql-and-node-7278eb9dc1b2 - may or may not be useful

- https://medium.com/@ThatGuyTinus/callbacks-vs-promises-vs-async-await-f65ed7c2b9b4 callbacks vs promises vs async

- https://github.com/vitaly-t/pg-promise/wiki/Learn-by-Example#raw-result - good documentation for pg-promise

- https://github.com/vitaly-t/pg-promise/wiki/Learn-by-Example#prepared-statements - more good documentation

- https://mherman.org/blog/designing-a-restful-api-with-node-and-postgres/ - good layout tutorial (puppies) *****

- https://stackoverflow.com/questions/129677/whats-the-best-method-for-sanitizing-user-input-with-php - SQL security tips

- https://www.npmjs.com/package/morgan - morgan documentation

- https://www.npmjs.com/package/jsonwebtoken - json usage tut

- https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens - login and token authentification

- https://en.wikipedia.org/wiki/List_of_HTTP_status_codes http codes

- https://github.com/breakstate/node-postgres-promises/blob/master/queries.js - example by author

- https://github.com/vitaly-t/pg-promise/wiki/Chaining-Queries - chaining queries

- https://scotch.io/tutorials/authenticate-a-node-es6-api-with-json-web-tokens - login and token authentication

- https://www.youtube.com/watch?v=2bPQInszQCk - restful API with express and postgres

- https://github.com/wildbit/postmark.js/wiki/Migrating-from-1.x-to-2.x-version - postmark setup
