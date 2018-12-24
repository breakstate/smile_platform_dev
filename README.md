# SMILE API DOC
## Setup
###### Linux
```sudo apt-get update```  
```sudo apt install curl```  
```curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -```  
```sudo apt-get install nodejs```  
```sudo apt-get install npm```  
```npm install```

## Usage
Install postman from https://www.getpostman.com/ or install the Chrome app  
  
For requests requiring input:
- key: value pairs go in the **Body** section
- select x-www-form-urlencoded radio button
- select JSON from the drop-down menu above the output

###### Add new user to system
In postman, open a new tab. Set the HTTP request type to **POST** with the address **localhost:8080/api/users.**
in *Body* make sure the following fields are present: first_name, last_name, phone_number, email, user_password, user_group_id (refer to db spreadsheet for info on user_group_id). For ease of testing please make the password identical to the first name including any capitalization. 

###### Get list of all users
In postman, open a new tab. Set the HTTP request type to **GET** with the address **localhost:8080/api/users.**
This will return all user information from user_info (including hashed passwords) mainly for debugging at this point.

###### login
In postman, open a new tab. Set the HTTP request type to **POST** with the address **localhost:8080/api/login.**
Currently logging in does not require the user to be verified as Postmark integration is underway. Logging in should demonstrate the system's ability to check that the user exists and that the password they enter matched the hashed password in the database. Fully fledged Token authentication will come later and also relies on Postmark. (An incorrect password will result in a fail message but, for testing purposes, will still return data relating to the user if the email exits in the db).

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
