
# Media Tracker Back-End


## Description

These are the back-end REST APIs for the Media Tracker app. See [this repository](https://github.com/Simone3/ReactMediaTracker) for more information. 


## Technical Details

The project defines several REST APIs to read and write the app entities, such as categories, groups, media items, etc.

Main components:
- NodeJS
- Express
- MongoDB (Mongoose)
- Firebase
- TypeScript


## Installation

- Download and install NodeJS and NPM from [here](https://nodejs.org/en/download/).
- Signup and request an API key from [Google Books](https://books.google.com).
- Signup and request an API key from [The Movie Database (TMDb)](https://www.themoviedb.org).
- Signup and request an API key from [Giant Bomb](http://www.giantbomb.com).
- Setup Firebase:
  - Create an account on [Firebase](https://firebase.google.com/).
  - Create a *dev* and/or a *prod* project.
  - For each project, activate the "Email/Password" sign-in method (Authentication -> Sign-in method).
- Clone this repository via Git.
- Define the current environment properties:
  - Open *app/config/config-sample.ts* to see a sample configuration file.
  - You can either define the environment variable *MEDIA_TRACKER_BE_CONFIG* containing a similar JSON as a string or create a *app/config/MEDIA_TRACKER_BE_CONFIG.json* file directly containing the config JSON.
  - Either way, you can leave all properties as is except for:
    - `db.url` (URL to your MongoDB database).
    - Several properties with the external API keys (Google Books, TMDb, Giant Bomb) requested above, see `<your_api_key_here>`.
    - `firebase.databaseUrl` with the URL that can be copied from the corresponding Firebase project (Project settings -> Service accounts -> Firebase Admin SDK -> databaseURL).
    - `firebase.serviceAccountKey` with the JSON that can be downloaded from the corresponding Firebase project (Project settings -> Service accounts -> Firebase Admin SDK -> Generate new private key).


## Run locally

- Setup a development project on Firebase (see above).
- Define the configuration for *dev* environment (see above). For *dev*, it should be easier to use the *MEDIA_TRACKER_BE_CONFIG.json* file.
- Download and install MongoDB following [this guide](https://docs.mongodb.com/manual/administration/install-community/).
- Execute `npm install` in the root project folder.
- Run the application:
  - Run: build the app (build command in Visual Studio Code) and then `npm run start`
  - Debug: use the Visual Studio Code "Debug" task or `npm run debug`
- Most APIs require a Firebase authentication token. You can either invoke them via Postman using a simple HTTP tester page (see *dev/FirebaseTester/Notes.txt*) or you can setup and install the [React Native app](https://github.com/Simone3/ReactMediaTracker) (*dev* environment).


## Run on server

The app can be deployed on any server. For example, on Heroku:
- Signup and create a project on [Heroku](https://www.heroku.com) (free tier available).
- Signup and create a database cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available).
- Setup a production project on Firebase (see above).
- Define the configuration for *prod* environment (see above). You can define the *MEDIA_TRACKER_BE_CONFIG* environment variable on Heroku from Settings -> Config Vars. You can get the database URL from the MongoDB Atlas website (SRV URL).
- Install [Heroku CLI](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up).
- On the project root folder, execute:
  - `heroku login`
  - `heroku git:remote -a <heroku_app_name>` 
  - `git push heroku master:master`
- You can now setup and install the [React Native app](https://github.com/Simone3/ReactMediaTracker) (*prod* environment).
