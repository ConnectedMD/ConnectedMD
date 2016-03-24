# ConnectedMD

# Setup
Install latest node

`npm install -g cordova`

`npm install -g gulp-cli`

`npm install -g grunt-cli`

# Updating components
run `npm update` in the project root folder. This will update components used for node.

run `npm update` in the `cordova` folder. This will update components used for cordova and web.

# Running The Web Server as node server

run `ionic serve`, this will start the local server and launch the browser. It will also create a www/build folder from the app folder.

# Running The Web Server as node server
run `node server.js port=80 env=dev api=http://localhost:8080/`

port => the port you want to use for local development. If you are running IIS, port 80 will not be available.

api => the base url for the api. If not specified, it will connect to the qa api

env => controls debuging, logging and settings. use `dev`, `qa`, `prod`.

# VSCode / Visual Studio Community 2015
You can use VSCode if you are just working with web code. To debug mobile, use Visual Studio.


# ionic startup messages
♬ ♫ ♬ ♫  Your Ionic app is ready to go! ♬ ♫ ♬ ♫

Make sure to cd into your new app directory:
  cd ConnectedMD

To run your app in the browser (great for initial development):
  ionic serve

To run on iOS:
  ionic run ios

To run on Android:
  ionic run android

To test your app on a device easily, try Ionic View:
  http://view.ionic.io

New! Add push notifications, update your app remotely, and package iOS and Android apps with the Ionic Platform!
https://apps.ionic.io/signup

New to Ionic? Get started here: http://ionicframework.com/docs/v2/getting-started