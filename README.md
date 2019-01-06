# SMILE API DOC

## Index
- [setup](#setup)
- [usage](#usage)
- [endpoints](#endpoints)
  - [users](#users)
  - [commitments](#commitments)
  - [completed_commitments](#completed_commitments)
  - [notes](#notes)
  - [checkins](#checkins)
  - [media](#media)
  - [motivational](#motivational)
  - [achievementtypes](#achievementtypes)
  - [achievements](#achievements)
- [links](#links)
  

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

### Users
#### Add new user to system
**HTTP request type:** POST  
**End point:** localhost:8080/api/users  
**Body:** first_name, last_name, phone_number, email, user_password, user_group_id (refer to db spreadsheet for info on user_group_id  
**Note:** For ease of testing please make the password identical to the first name including any capitalization.


#### Get list of all users
**HTTP request type:** GET  
**End point:** localhost:8080/api/users  
**Note:** This will return all user information from user_info (including hashed passwords) mainly for debugging at this point.  

#### Get single user by usuer_id
**HTTP request type:** GET  
**End point:** localhost:8080/api/users/:user_id  
**Note:** Simply add the user_id value to the url, eg. ```.../api/users/2```

#### Login
**HTTP request type:** POST  
**End point:** localhost:8080/api/login  
**Body:** email, user_password  
**Note:**  Currently logging in does not require the user to be verified as Postmark integration is underway. Logging in should demonstrate the system's ability to check that the user exists and that the password they enter matched the hashed password in the database. Fully fledged Token authentication will come later and also relies on Postmark.

#### Login with token
**HTTP request type:** POST  
**End point:** localhost:8080/api/token_login  
**Body:** token  
**Note:** Checks exist to see if token is present, to see if token is valid, and to see if user exists  

#### Update user
**HTTP request type:** PUT  
**End point:** localhost:8080/api/users  
**Body:** first_name, last_name, phone_number, user_id  
**Note:** This is meant for updating info that isn't sensative. Email and password changing will be separate  

#### Delete user
**HTTP request type:** DELETE  
**End point:** localhost:8080/api/users/:user_id  
**Note:** Simply add the user_id value to the url, eg. ```.../api/users/2```  
**WARNING: this action cannot be undone.**  

<hr>  

### Commitments
#### Add new commitment
**HTTP request type:** POST  
**End point:** localhost:8080/api/commitments  
**Body:** goal_title, goal_description, start_date, end_date, start_time, end_time, is_full_day, is_recurring, user_id, created_by, created_date, parent_goal_id  
**Note:**  eg of date format: ```Jan, 01, 2019 or 2019-01-01```, eg of timestamp format: ```2018-12-12 17:00:00``` (May need to change these). Refer to db spreadsheet for more info.

#### Get commitment by user
**HTTP request type:** GET  
**End point:** localhost:8080/api/commitments/:user_id  
**Note:** This will return all commitments from specified user_id (May add get commitment by commitment ID)

#### Get all commitments
**HTTP request type:** GET  
**End point:** localhost:8080/api/commitments  
**Note:** This will return all commitments

#### Update commitment
**HTTP request type:** PUT  
**End point:** localhost:8080/api/commitments  
**Body:** goal_title, goal_description, start_date, end_date, start_time, end_time, is_full_day, is_recurring, goal_id  
**Note:** eg of date format: ```Jan, 01, 2019 or 2019-01-01```. eg of timestamp format: ```17:00:00```. See sheet for types. All values must be present - any number of values can be changes in a single request, but unchanged values need to be included as well.  

#### Delete commitment
**HTTP request type:** DELETE  
**End point:** localhost:8080/api/commitments/:id  
**Note:** Simply add the user_id value to the url, eg. ```.../api/commitments/2```  
**WARNING: this action cannot be undone.**  

<hr>  

### Completed_commitments
#### Set commitment as complete
**HTTP request type:** POST  
**End point:** localhost:8080/api/completed_commitments  
**Body:** goal_id, date_completed, note, satisfaction  
**Note:**  eg of date format: ```Jan, 01, 2019 or 2019-01-01```. This will change the "completed" value of the related commitment to true in the "commitments" table. Recurring patterns usage needs to be finalized.  

#### Get completed commitment by user
**HTTP request type:** GET  
**End point:** localhost:8080/api/completed_commmitment/:user_id  
**Note:** Simply add the user_id value to the url, eg. ```.../api/completed_commitments/2```  

#### Get all completed commitments
**HTTP request type:** GET  
**End point:** localhost:8080/api/completed_commitments  
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

### Notes
#### Add new note
**HTTP request type:** POST  
**End point:** localhost:8080/api/notes  
**Body:** user_id, note, date_created  
**Note:** eg of date format: ```Jan, 01, 2019 or 2019-01-01```. "note" is the actual note text.  

#### Get notes by user
**HTTP request type:** GET  
**End point:** localhost:8080/api/notes/:user_id  
**Note:** This will return all notes from specified user_id

#### Get all notes
**HTTP request type:** GET  
**End point:** localhost:8080/api/notes  
**Note:** This will return all notes

#### Update note
**HTTP request type:** PUT  
**End point:** localhost:8080/api/notes  
**Body:** note, date_edited, note_id  
**Note:** eg of date format: ```Jan, 01, 2019 or 2019-01-01```. "status" in returned object will be "fail" if the the specified note_id does not exist.  

#### Delete note
**HTTP request type:** DELETE  
**End point:** localhost:8080/api/notes/:note_id  
**Note:** Simply add the note_id value to the url, eg. ```.../api/notes/2```. "status" in returned object will be "fail" if the the specified note_id does not exist.   
**WARNING: this action cannot be undone.**  

<hr>  

### Checkins
#### Add new checkin entry
**HTTP request type:** POST  
**End point:** localhost:8080/api/checkins  
**Body:** user_id, date_answered, time_answered, q1...q34  
**Note:** eg of date format: ```Jan, 01, 2019 or 2019-01-01```.  

#### Get checkins by user
**HTTP request type:** GET  
**End point:** localhost:8080/api/checkins/:user_id  
**Note:** This will return all checkins from specified user_id

#### Get all checkins
**HTTP request type:** GET  
**End point:** localhost:8080/api/checkins  
**Note:** This will return all checkins  

#### Update checkin
**HTTP request type:** PUT  
**End point:**  
**Body:**  
**Note:** Implementation pending until deemed necessary?  

#### Delete checkin
**HTTP request type:** DELETE  
**End point:** localhost:8080/api/checkins/:checkin_id  
**Note:** Simply add the checkin_id value to the url, eg. ```.../api/checkins/2```. "status" in returned object will be "fail" if the the specified note_id does not exist.   
**WARNING: this action cannot be undone.**  

<hr>  

### Media
#### Add new media entry
**HTTP request type:** POST  
**End point:** localhost:8080/api/media  
**Body:** path_to_media, media_title, user_id  
**Note:**   

#### Get media by user
**HTTP request type:** GET  
**End point:** localhost:8080/api/media/:user_id  
**Note:** This will return all media entries from specified user_id

#### Get all media
**HTTP request type:** GET  
**End point:** localhost:8080/api/media  
**Note:** This will return all media entries  

#### Update media
**HTTP request type:** PUT  
**End point:** localhost:8080/api/media  
**Body:** path_to_media, media_title, meida_id  
**Note:** meida_id is not a type here. Once corrected in the DB it will media_id  

#### Delete media
**HTTP request type:** DELETE  
**End point:** localhost:8080/api/media/media_id  
**Note:** Simply add the media_id value to the url, eg. ```.../api/media/2```. "status" in returned object will be "fail" if the the specified media entry does not exist.   
**WARNING: this action cannot be undone.**  

<hr>  

### Motivational
#### Add new motivational entry
**HTTP request type:** POST  
**End point:** localhost:8080/api/motivational  
**Body:** description, tags  
**Note:** tags will be comma delimited and the string needs to be built on the front end. Tags are not high priority, only important for stretch goals.  

#### Get random motivational entry
**HTTP request type:** GET  
**End point:** localhost:8080/api/motivational_r  
**Note:** This will return a random entry from the motivational_messages table  

#### Get all motivational entries
**HTTP request type:** GET  
**End point:** localhost:8080/api/motivational  
**Note:** This will return all motivational entries  

#### Update motivational entry
**HTTP request type:** PUT  
**End point:** localhost:8080/api/motivational  
**Body:** description, tags  
**Note:** tags will be comma delimited and the string needs to be built on the front end. Tags are not high priority, only important for stretch goals.  

#### Delete motivational entry
**HTTP request type:** DELETE  
**End point:** localhost:8080/api/motivational/:motivational_id  
**Note:** Simply add the motivational_id value to the url, eg. ```.../api/media/2```. "status" in returned object will be "fail" if the the specified media entry does not exist.   
**WARNING: this action cannot be undone.**  

<hr>  

### Achievementtypes
#### Add new achievement type
**HTTP request type:** POST  
**End point:** localhost:8080/api/achievements_d  
**Body:** id, name, xp_worth  
**Note:** this id is one of the only ones that we have to specify ourselves. This is because the achievements will be handmade by the admins and won't be changed dynamically. They will be static.  

#### Update achievement type
**HTTP request type:** GET  
**End point:** localhost:8080/api/achievements_d  
**Body:**   
**Note:** Gets list of all achievement types currently stored.  

#### Delete motivational entry
**HTTP request type:** DELETE  
**End point:** localhost:8080/api/achievements_d/:id  
**Note:** Simply add the id value to the url, eg. ```.../api/achievements_d/2```. "status" in returned object will be "fail" if the the specified media entry does not exist.   
**WARNING: this action cannot be undone.**  

<hr>  

### Achievements
#### Add new user achievement
**HTTP request type:** POST  
**End point:** localhost:8080/api/achievements  
**Body:** id, user_id, percent_complete, last_entry, next_entry, time  
**Note:** This creates new user achievement associated with the specified user_id, and of achievementtype: id.   

#### Get all achievements
**HTTP request type:** GET  
**End point:** localhost:8080/api/achievements  
**Note:** This will return all achievements  

#### Get achievements by user_id
**HTTP request type:** GET  
**End point:** localhost:8080/api/achievements/:user_id  
**Note:** This will return all achievements for specified user_id  

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
