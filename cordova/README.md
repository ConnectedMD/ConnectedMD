# ConnectedMD

# Setup
Install latest node

`npm install -g cordova`

`npm install -g gulp-cli`

`npm install -g grunt-cli`

# Updating components
run `npm update` in the project root folder. This will update components used for node.

run `npm update` in the `ConnectedMD` folder. This will update components used for cordova and web.

run `grunt update` in the `ConnectedMD` folder if you have added new libs. This will update the www/libs folder.

# Running The Web Server
run `node server.js port=80 env=dev api=http://localhost:8080/`

port => the port you want to use for local development. If you are running IIS, port 80 will not be available.

api => the base url for the api. If not specified, it will connect to the qa api

env => controls debuging, logging and settings. use `dev`, `qa`, `prod`.

# VSCode / Visual Studio Community 2015
You can use VSCode if you are just working with web code. To debug mobile, use Visual Studio.